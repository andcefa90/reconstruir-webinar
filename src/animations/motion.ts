import type { TargetAndTransition, Transition } from 'framer-motion'

// Motion system: una sola fuente de verdad para tiempos y curvas.
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  emotional: [0.16, 1, 0.3, 1] as const,
}

export const dur = {
  micro: 0.2, // 150–250ms
  ui: 0.4, // 300–500ms
  slide: 0.7, // 500–900ms
  emotional: 1.2, // 800–1400ms
}

export type TransitionKind =
  | 'fade'
  | 'slide'
  | 'morph'
  | 'scale'
  | 'blur'
  | 'mask'
  | 'path'
  | 'split'
  | 'slowFade'
  | 'cinematic'

type Variant = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition }

const full = 'inset(0% 0% 0% 0%)'

export const slideTransitions: Record<TransitionKind, Variant> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, ease: ease.out } },
  slide: {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: ease.out },
  },
  morph: {
    initial: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 0.8, ease: ease.emotional },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: ease.out },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(14px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.7, ease: ease.out },
  },
  mask: {
    initial: { clipPath: 'inset(0% 100% 0% 0%)' },
    animate: { clipPath: full },
    transition: { duration: 0.8, ease: ease.inOut },
  },
  path: {
    initial: { clipPath: 'circle(0% at 50% 55%)' },
    animate: { clipPath: 'circle(80% at 50% 55%)' },
    transition: { duration: 0.9, ease: ease.inOut },
  },
  split: {
    initial: { clipPath: 'inset(0% 50% 0% 50%)' },
    animate: { clipPath: full },
    transition: { duration: 0.75, ease: ease.inOut },
  },
  slowFade: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2, ease: ease.inOut } },
  cinematic: {
    initial: { opacity: 0, scale: 1.02, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 1.4, ease: ease.emotional, delay: 0.15 },
  },
}

export const reducedTransition: Variant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15 },
}

/** Reveal estándar para elementos dentro de una slide. */
export const rise = (delay = 0, distance = 24) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: dur.slide, ease: ease.out, delay },
})

/**
 * framer-motion's TargetProperties typing rejects `pathLength` under TS 5.6
 * (the SVG intersection collapses); the values are valid at runtime.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const svgAnim = (v: Record<string, unknown>) => v as any
