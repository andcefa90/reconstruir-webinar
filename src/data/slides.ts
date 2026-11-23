import type { TransitionKind } from '../animations/motion'

export type SlideTheme = 'light' | 'dark'

export type SlideMeta = {
  id: string
  title: string
  /** Índice de capítulo en presentation.chapters */
  chapter: number
  transition: TransitionKind
  theme: SlideTheme
  /** Número de builds (clicks) dentro de la slide. */
  steps: number
  /** Minutos recomendados (estimación, ajustar con la guía). */
  minutes: number
  /** Temporizador de ejercicio en segundos. */
  timer?: { seconds: number; label: string }
}

export const slides: SlideMeta[] = [
  { id: 'cover', title: 'Portada', chapter: 0, transition: 'fade', theme: 'light', steps: 1, minutes: 1 },
  { id: 'opening', title: 'Apertura', chapter: 0, transition: 'cinematic', theme: 'light', steps: 2, minutes: 2 },
  { id: 'tools', title: 'Lo que te vas a llevar hoy', chapter: 0, transition: 'mask', theme: 'light', steps: 2, minutes: 2 },
  { id: 'separation', title: 'La separación', chapter: 0, transition: 'split', theme: 'light', steps: 4, minutes: 4 },
  { id: 'fears', title: 'Miedos', chapter: 1, transition: 'blur', theme: 'light', steps: 3, minutes: 3 },
  { id: 'semaforo', title: 'Semáforo emocional', chapter: 1, transition: 'scale', theme: 'light', steps: 1, minutes: 3 },
  { id: 'map', title: 'El mapa roto', chapter: 2, transition: 'fade', theme: 'light', steps: 4, minutes: 2 },
  {
    id: 'wheel',
    title: 'Rueda de la Vida',
    chapter: 2,
    transition: 'morph',
    theme: 'light',
    steps: 2,
    minutes: 5,
    timer: { seconds: 120, label: 'Rueda de la Vida' },
  },
  {
    id: 'control',
    title: 'Círculo de Control',
    chapter: 3,
    transition: 'path',
    theme: 'light',
    steps: 2,
    minutes: 4,
    timer: { seconds: 120, label: 'Círculo de Control' },
  },
  { id: 'grief', title: 'El duelo', chapter: 4, transition: 'slowFade', theme: 'light', steps: 2, minutes: 3 },
  { id: 'griefTools', title: 'Tres herramientas', chapter: 4, transition: 'slide', theme: 'light', steps: 1, minutes: 3 },
  {
    id: 'letter',
    title: 'Carta de despedida',
    chapter: 4,
    transition: 'slowFade',
    theme: 'light',
    steps: 1,
    minutes: 3,
    timer: { seconds: 180, label: 'Carta de despedida' },
  },
  { id: 'forgiveness', title: 'Perdón', chapter: 5, transition: 'split', theme: 'light', steps: 2, minutes: 3 },
  { id: 'biff', title: 'BIFF', chapter: 6, transition: 'split', theme: 'light', steps: 3, minutes: 3 },
  {
    id: 'biffTool',
    title: 'BIFF interactivo',
    chapter: 6,
    transition: 'slide',
    theme: 'light',
    steps: 1,
    minutes: 3,
    timer: { seconds: 120, label: 'BIFF' },
  },
  {
    id: 'minute10',
    title: 'Regla del minuto 10',
    chapter: 6,
    transition: 'fade',
    theme: 'dark',
    steps: 3,
    minutes: 2,
    timer: { seconds: 600, label: 'Regla del minuto 10' },
  },
  { id: 'coparenting', title: 'Coparentalidad 50/50', chapter: 6, transition: 'morph', theme: 'light', steps: 3, minutes: 3 },
  { id: 'board', title: 'Tablero de coparentalidad', chapter: 6, transition: 'scale', theme: 'light', steps: 1, minutes: 3 },
  { id: 'purpose', title: 'Propósito', chapter: 7, transition: 'slowFade', theme: 'light', steps: 3, minutes: 2 },
  {
    id: 'commitment',
    title: 'Compromiso de 24 horas',
    chapter: 7,
    transition: 'fade',
    theme: 'light',
    steps: 1,
    minutes: 3,
    timer: { seconds: 60, label: 'Compromiso de 24 horas' },
  },
  { id: 'limits', title: 'Recomendaciones y límites', chapter: 8, transition: 'fade', theme: 'light', steps: 1, minutes: 1 },
  { id: 'closing', title: 'Cierre', chapter: 8, transition: 'cinematic', theme: 'light', steps: 2, minutes: 1 },
  { id: 'cta', title: 'Siguientes pasos', chapter: 8, transition: 'fade', theme: 'light', steps: 1, minutes: 2 },
]

/** Slides de apoyo: fuera de la navegación normal, accesibles desde /presenter. */
export const supportSlides = [0, 1, 2, 3, 4, 5].map((i) => ({ id: `faq-${i}`, index: i }))

export const totalMinutes = slides.reduce((a, s) => a + s.minutes, 0)
