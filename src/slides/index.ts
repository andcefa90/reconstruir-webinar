import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// Cada slide es un componente independiente, cargado bajo demanda
// y precargado en segundo plano tras el primer render.
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  cover: () => import('./Slide01Cover'),
  opening: () => import('./Slide02Opening'),
  tools: () => import('./Slide03Tools'),
  separation: () => import('./Slide04Separation'),
  fears: () => import('./Slide05Fears'),
  semaforo: () => import('./SlideSemaforo'),
  map: () => import('./SlideMap'),
  wheel: () => import('./Slide06LifeWheel'),
  control: () => import('./Slide07ControlCircle'),
  grief: () => import('./Slide08Grief'),
  griefTools: () => import('./SlideGriefTools'),
  letter: () => import('./SlideLetter'),
  forgiveness: () => import('./Slide09Forgiveness'),
  biff: () => import('./Slide10BIFF'),
  biffTool: () => import('./SlideBIFFTool'),
  minute10: () => import('./SlideMinute10'),
  coparenting: () => import('./Slide11Coparenting'),
  board: () => import('./SlideBoard'),
  purpose: () => import('./Slide12Purpose'),
  commitment: () => import('./Slide13Commitment'),
  limits: () => import('./SlideLimits'),
  closing: () => import('./Slide14Closing'),
  cta: () => import('./SlideCTA'),
}

const placeholder = () => import('./SlidePlaceholder')

export const slideComponents: Record<string, LazyExoticComponent<ComponentType>> = new Proxy(
  {} as Record<string, LazyExoticComponent<ComponentType>>,
  {
    get(cache, id: string) {
      cache[id] ??= lazy(loaders[id] ?? placeholder)
      return cache[id]
    },
  },
)

export const FaqSlide = lazy(() => import('./SupportFAQ'))

export function preloadSlides() {
  Object.values(loaders).forEach((l) => void l())
  void import('./SupportFAQ')
}
