import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { slides, type SlideMeta } from '../data/slides'
import { speakerNotes, type Notes } from '../data/speakerNotes'
import { playSound, type SoundKind } from '../utils/sound'

// ─── Presentation Engine ──────────────────────────────────────────
// Estado global único. Se sincroniza entre la ventana pública y /presenter
// mediante BroadcastChannel (mismo navegador, sin servidor).

export type TimerState = {
  key: string | null
  label: string
  duration: number // segundos
  startedAt: number | null // epoch ms cuando corre
  elapsed: number // ms acumulados antes de startedAt
}

export type ClockState = { startedAt: number | null; elapsed: number }

type Synced = {
  index: number
  step: number
  support: string | null
  timer: TimerState
  clock: ClockState
  interactions: Record<string, unknown>
}

type State = Synced & {
  sound: boolean
  escapeTick: number
  origin: 'local' | 'remote' | 'init'
}

type Action =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; index: number; step?: number }
  | { type: 'support'; id: string | null }
  | { type: 'timerStart'; key: string; label: string; duration: number }
  | { type: 'timerToggle' }
  | { type: 'timerReset' }
  | { type: 'timerClose' }
  | { type: 'clockToggle' }
  | { type: 'clockReset' }
  | { type: 'interaction'; key: string; value: unknown }
  | { type: 'sound' }
  | { type: 'escape' }
  | { type: 'hydrate'; snapshot: Synced }

const last = slides.length - 1
const emptyTimer: TimerState = { key: null, label: '', duration: 0, startedAt: null, elapsed: 0 }

function startClock(clock: ClockState): ClockState {
  return clock.startedAt || clock.elapsed ? clock : { startedAt: Date.now(), elapsed: 0 }
}

function reducer(s: State, a: Action): State {
  const local = { ...s, origin: 'local' as const }
  switch (a.type) {
    case 'next': {
      if (s.support) return { ...local, support: null }
      if (s.step < slides[s.index].steps - 1) return { ...local, step: s.step + 1 }
      if (s.index >= last) return s
      return { ...local, index: s.index + 1, step: 0, clock: startClock(s.clock) }
    }
    case 'prev': {
      if (s.support) return { ...local, support: null }
      if (s.step > 0) return { ...local, step: s.step - 1 }
      if (s.index <= 0) return s
      return { ...local, index: s.index - 1, step: slides[s.index - 1].steps - 1 }
    }
    case 'goto': {
      const index = Math.max(0, Math.min(last, a.index))
      const step = Math.max(0, Math.min(slides[index].steps - 1, a.step ?? 0))
      return { ...local, index, step, support: null }
    }
    case 'support':
      return { ...local, support: a.id }
    case 'timerStart':
      return { ...local, timer: { key: a.key, label: a.label, duration: a.duration, startedAt: Date.now(), elapsed: 0 } }
    case 'timerToggle': {
      const t = s.timer
      if (!t.key) return s
      if (t.startedAt) return { ...local, timer: { ...t, startedAt: null, elapsed: t.elapsed + Date.now() - t.startedAt } }
      if (t.elapsed >= t.duration * 1000) return { ...local, timer: { ...t, startedAt: Date.now(), elapsed: 0 } }
      return { ...local, timer: { ...t, startedAt: Date.now() } }
    }
    case 'timerReset':
      return { ...local, timer: { ...s.timer, startedAt: null, elapsed: 0 } }
    case 'timerClose':
      return { ...local, timer: emptyTimer }
    case 'clockToggle': {
      const c = s.clock
      if (c.startedAt) return { ...local, clock: { startedAt: null, elapsed: c.elapsed + Date.now() - c.startedAt } }
      return { ...local, clock: { ...c, startedAt: Date.now() } }
    }
    case 'clockReset':
      return { ...local, clock: { startedAt: null, elapsed: 0 } }
    case 'interaction':
      return { ...local, interactions: { ...s.interactions, [a.key]: a.value } }
    case 'sound':
      return { ...s, sound: !s.sound }
    case 'escape':
      return { ...s, escapeTick: s.escapeTick + 1, support: null }
    case 'hydrate':
      return { ...s, ...a.snapshot, origin: 'remote' }
  }
}

function initialState(): State {
  let index = 0
  try {
    const saved = Number(sessionStorage.getItem('reconstruir:index'))
    if (Number.isInteger(saved) && saved >= 0 && saved <= last) index = saved
  } catch {
    /* sin storage */
  }
  return {
    index,
    step: 0,
    support: null,
    timer: emptyTimer,
    clock: { startedAt: null, elapsed: 0 },
    interactions: {},
    sound: false,
    escapeTick: 0,
    origin: 'init',
  }
}

type Ctx = {
  state: State
  role: 'audience' | 'presenter'
  slide: SlideMeta
  notes: Notes
  next: () => void
  prev: () => void
  goto: (index: number, step?: number) => void
  openSupport: (id: string | null) => void
  startTimer: (key: string, label: string, seconds: number) => void
  toggleTimer: () => void
  resetTimer: () => void
  closeTimer: () => void
  toggleClock: () => void
  resetClock: () => void
  setInteraction: (key: string, value: unknown) => void
  toggleSound: () => void
  escape: () => void
  sound: (kind: SoundKind) => void
}

const PresentationContext = createContext<Ctx | null>(null)

const CHANNEL = 'reconstruir-sync'
const windowId = Math.random().toString(36).slice(2)

export function PresentationProvider({ role, children }: { role: Ctx['role']; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const channel = useRef<BroadcastChannel | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const snapshot = (s: State): Synced => ({
    index: s.index,
    step: s.step,
    support: s.support,
    timer: s.timer,
    clock: s.clock,
    interactions: s.interactions,
  })

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const ch = new BroadcastChannel(CHANNEL)
    channel.current = ch
    ch.onmessage = (e) => {
      const msg = e.data
      if (!msg || msg.from === windowId) return
      if (msg.type === 'hello' && role === 'audience') {
        ch.postMessage({ type: 'state', from: windowId, snapshot: snapshot(stateRef.current) })
      }
      if (msg.type === 'state') dispatch({ type: 'hydrate', snapshot: msg.snapshot })
    }
    ch.postMessage({ type: 'hello', from: windowId })
    return () => ch.close()
  }, [role])

  // Difunde cambios locales sincronizables.
  useEffect(() => {
    if (state.origin !== 'local') return
    channel.current?.postMessage({ type: 'state', from: windowId, snapshot: snapshot(state) })
  }, [state.index, state.step, state.support, state.timer, state.clock, state.interactions]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (role !== 'audience') return
    try {
      sessionStorage.setItem('reconstruir:index', String(state.index))
    } catch {
      /* sin storage */
    }
  }, [state.index, role])

  const soundOn = state.sound
  const sound = useCallback((kind: SoundKind) => soundOn && role === 'audience' && playSound(kind), [soundOn, role])

  // Sonido sutil de transición (solo si SOUND ON).
  const prevIndex = useRef(state.index)
  useEffect(() => {
    if (prevIndex.current !== state.index) sound('transition')
    prevIndex.current = state.index
  }, [state.index, sound])

  const value = useMemo<Ctx>(() => {
    const slide = slides[state.index]
    return {
      state,
      role,
      slide,
      notes: speakerNotes[slide.id] ?? { notes: [] },
      next: () => dispatch({ type: 'next' }),
      prev: () => dispatch({ type: 'prev' }),
      goto: (index, step) => dispatch({ type: 'goto', index, step }),
      openSupport: (id) => dispatch({ type: 'support', id }),
      startTimer: (key, label, seconds) => dispatch({ type: 'timerStart', key, label, duration: seconds }),
      toggleTimer: () => dispatch({ type: 'timerToggle' }),
      resetTimer: () => dispatch({ type: 'timerReset' }),
      closeTimer: () => dispatch({ type: 'timerClose' }),
      toggleClock: () => dispatch({ type: 'clockToggle' }),
      resetClock: () => dispatch({ type: 'clockReset' }),
      setInteraction: (key, v) => dispatch({ type: 'interaction', key, value: v }),
      toggleSound: () => dispatch({ type: 'sound' }),
      escape: () => dispatch({ type: 'escape' }),
      sound,
    }
  }, [state, role, sound])

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation fuera de PresentationProvider')
  return ctx
}

/** Estado de interacción persistente durante la sesión (sobrevive a la navegación). */
export function useInteraction<T>(key: string, initial: T): [T, (v: T) => void] {
  const { state, setInteraction } = usePresentation()
  const value = (key in state.interactions ? state.interactions[key] : initial) as T
  return [value, (v: T) => setInteraction(key, v)]
}

/** Ejecuta `fn` cada vez que el presentador pulsa ESC. */
export function useEscape(fn: () => void) {
  const { state } = usePresentation()
  const first = useRef(state.escapeTick)
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    if (state.escapeTick !== first.current) fnRef.current()
  }, [state.escapeTick])
}
