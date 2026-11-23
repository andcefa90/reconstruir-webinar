import { useEffect, useState } from 'react'
import type { ClockState, TimerState } from './usePresentation'

function useTick(active: boolean, ms = 250) {
  const [, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setN((n) => n + 1), ms)
    return () => clearInterval(id)
  }, [active, ms])
}

/** Deriva el tiempo restante de un temporizador basado en epoch (consistente entre ventanas). */
export function useTimer(t: TimerState) {
  const running = t.startedAt !== null
  useTick(running)
  const elapsedMs = t.elapsed + (t.startedAt ? Date.now() - t.startedAt : 0)
  const total = t.duration * 1000
  const remainingMs = Math.max(0, total - elapsedMs)
  const done = t.key !== null && remainingMs === 0
  return {
    active: t.key !== null,
    running: running && !done,
    remaining: Math.ceil(remainingMs / 1000),
    progress: total ? Math.min(1, elapsedMs / total) : 0,
    done,
    final: !done && remainingMs <= 10_000 && t.key !== null,
  }
}

export function useClock(c: ClockState) {
  useTick(c.startedAt !== null, 500)
  const ms = c.elapsed + (c.startedAt ? Date.now() - c.startedAt : 0)
  return { seconds: Math.floor(ms / 1000), running: c.startedAt !== null }
}

export function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
