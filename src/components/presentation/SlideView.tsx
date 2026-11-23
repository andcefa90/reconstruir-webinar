import { Suspense } from 'react'
import { SlideContext } from '../../hooks/useSlide'
import { FaqSlide, slideComponents } from '../../slides'

/** Renderiza una slide (o slide de apoyo) con su contexto. Reutilizado en /presenter. */
export function SlideView({ id, step, preview = false }: { id: string; step: number; preview?: boolean }) {
  const Comp = id.startsWith('faq-') ? FaqSlide : slideComponents[id]
  return (
    <SlideContext.Provider value={{ id, step, preview }}>
      <Suspense fallback={null}>
        <Comp />
      </Suspense>
    </SlideContext.Provider>
  )
}

export const themeBg = { light: 'var(--color-ivory)', dark: 'var(--color-night)' } as const
