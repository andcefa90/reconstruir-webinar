import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { usePresentation } from '../../hooks/usePresentation'
import { preloadSlides } from '../../slides'
import { ControlBar } from '../navigation/ControlBar'
import { ProgressBar } from '../navigation/ProgressBar'
import { FloatingTimer } from '../timers/ExerciseTimer'
import { useTimerChime } from '../timers/TimerRing'
import { Logo } from '../ui/primitives'
import { SlideContainer } from './SlideContainer'
import { Stage } from './Stage'

const BARE = new Set(['cover', 'closing', 'cta'])

/** Vista pública: lo que ve la audiencia. */
export function Presentation() {
  const { slide, state } = usePresentation()
  useKeyboardNavigation()
  useTimerChime()

  useEffect(() => {
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(preloadSlides) : setTimeout(preloadSlides, 800)
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id as number)
    }
  }, [])

  const bare = BARE.has(slide.id) && !state.support

  return (
    <main className="h-full w-full">
      <Stage>
        <SlideContainer />
        <AnimatePresence>
          {!bare && (
            <motion.div
              key="chrome"
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute left-[140px] top-[56px]">
                <Logo tone={slide.theme === 'dark' ? 'ivory' : 'ink'} />
              </div>
              <ProgressBar />
            </motion.div>
          )}
        </AnimatePresence>
        <FloatingTimer />
      </Stage>
      <ControlBar />
    </main>
  )
}
