import { AnimatePresence, motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import { ease } from '../../animations/motion'
import { usePresentation } from '../../hooks/usePresentation'
import { useSlide } from '../../hooks/useSlide'
import { formatTime } from '../../hooks/useTimer'
import { TextButton } from '../ui/primitives'
import { TimerRing } from './TimerRing'

/** Botón "Comenzar ejercicio" + anillo, embebido dentro de una slide con timer. */
export function ExerciseTimer({ size = 180, tone = 'light' as 'light' | 'dark', label = 'Comenzar ejercicio' }) {
  const { slide, state, startTimer } = usePresentation()
  const { id, preview } = useSlide()
  const cfg = slide.id === id ? slide.timer : undefined
  const mine = state.timer.key === id
  if (!cfg) return null
  return (
    <div className="flex min-h-[64px] items-center">
      <AnimatePresence mode="wait" initial={false}>
        {mine && !preview ? (
          <motion.div
            key="ring"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <TimerRing size={size} tone={tone} />
          </motion.div>
        ) : (
          <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TextButton
              tone={tone === 'light' ? 'wine' : 'ivory'}
              icon={<Timer size={18} strokeWidth={1.5} />}
              onClick={() => startTimer(id, cfg.label, cfg.seconds)}
            >
              {label} · {formatTime(cfg.seconds)}
            </TextButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Indicador flotante cuando hay un timer activo de otra slide. */
export function FloatingTimer() {
  const { state, slide } = usePresentation()
  const visible = state.timer.key !== null && state.timer.key !== slide.id
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute right-[64px] top-[48px] z-30 flex items-center gap-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: ease.out }}
        >
          <span className="kicker text-[11px] text-stone-3">{state.timer.label}</span>
          <TimerRing size={84} controls={false} tone={slide.theme} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
