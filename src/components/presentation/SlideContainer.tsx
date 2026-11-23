import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { reducedTransition, slideTransitions, svgAnim } from '../../animations/motion'
import { usePresentation } from '../../hooks/usePresentation'
import { SlideView, themeBg } from './SlideView'

/**
 * Orquesta las transiciones narrativas. La slide entrante se dibuja encima
 * de la saliente (sin pantallas vacías) y la saliente se retira después.
 */
export function SlideContainer() {
  const { state, slide } = usePresentation()
  const reduced = useReducedMotion()
  const id = state.support ?? slide.id
  const theme = state.support ? 'light' : slide.theme
  const t = reduced ? reducedTransition : slideTransitions[state.support ? 'blur' : slide.transition]

  useEffect(() => {
    document.body.style.backgroundColor = slide.id === 'cover' && !state.support ? themeBg.dark : themeBg[theme]
  }, [theme, slide.id, state.support])

  return (
    <AnimatePresence initial={false}>
      <motion.section
        key={id}
        aria-roledescription="slide"
        aria-label={slide.title}
        className={`absolute inset-0 overflow-hidden ${theme === 'dark' ? 'grain grain-dark text-ivory' : 'grain text-ink'}`}
        style={{ backgroundColor: themeBg[theme] }}
        initial={svgAnim(t.initial)}
        animate={svgAnim(t.animate)}
        transition={t.transition}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: reduced ? 0 : 0.55 } }}
      >
        <SlideView id={id} step={state.support ? 0 : state.step} />
      </motion.section>
    </AnimatePresence>
  )
}
