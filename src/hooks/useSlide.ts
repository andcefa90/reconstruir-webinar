import { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export type SlideCtx = {
  id: string
  step: number
  /** Render estático (miniaturas del modo presentador): sin secuencias ni interacción. */
  preview: boolean
}

export const SlideContext = createContext<SlideCtx>({ id: '', step: 0, preview: false })

/** Contexto de la slide actual + si debe saltarse la animación. */
export function useSlide() {
  const ctx = useContext(SlideContext)
  const reduced = useReducedMotion() ?? false
  return { ...ctx, instant: ctx.preview || reduced }
}

/**
 * Revela `count` elementos en secuencia temporal cuando `enabled`.
 * En miniatura o con reduced-motion devuelve todo revelado.
 */
export function useSequence(count: number, intervalMs: number, enabled = true, delayMs = 0) {
  const times = Array.from({ length: count }, (_, i) => delayMs + intervalMs * i)
  return useTimeline(times, enabled)
}

/** Como useSequence pero con instantes arbitrarios (ms desde que se habilita). */
export function useTimeline(times: number[], enabled = true) {
  const { instant } = useSlide()
  const [n, setN] = useState(0)
  const key = times.join(',')
  useEffect(() => {
    if (!enabled || instant) return
    setN(0)
    const timers = times.map((ms, i) => setTimeout(() => setN(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [key, enabled, instant]) // eslint-disable-line react-hooks/exhaustive-deps
  if (instant) return enabled ? times.length : 0
  return enabled ? n : 0
}
