import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { ease } from '../animations/motion'
import { TimerRing } from '../components/timers/TimerRing'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { slides } from '../data/slides'
import { usePresentation } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.minute10
const cfg = slides.find((s) => s.id === 'minute10')!.timer!

/** Pantalla de silencio: oscura, mínima. */
export default function SlideMinute10() {
  const { step, instant, preview, id } = useSlide()
  const { state, startTimer, role } = usePresentation()

  // El temporizador arranca al llegar al build 2 (solo desde la ventana pública).
  useEffect(() => {
    if (step >= 1 && !preview && role === 'audience' && state.timer.key !== id) startTimer(id, cfg.label, cfg.seconds)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col items-center justify-center text-ivory">
      <motion.div
        initial={false}
        animate={{ y: step >= 1 ? -40 : 0, scale: step >= 1 ? 0.6 : 1, opacity: step >= 2 ? 0.5 : 1 }}
        transition={{ duration: 1, ease: ease.emotional }}
      >
        <RevealText
          as="h2"
          text={c.headline.toUpperCase()}
          className="font-serif text-[120px] font-light tracking-[0.02em] text-ivory"
          duration={1.3}
          stagger={0.12}
        />
      </motion.div>

      <motion.div
        className="mt-6"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.92, height: step >= 1 ? 'auto' : 0 }}
        transition={{ duration: instant ? 0 : 1, ease: ease.emotional }}
      >
        <TimerRing size={step >= 2 ? 220 : 360} tone="dark" controls={step === 1} idleSeconds={cfg.seconds} />
      </motion.div>

      <div className="mt-14 flex gap-[72px]">
        {c.steps.map((s, i) => (
          <motion.span
            key={s}
            className="font-serif text-[64px] font-light italic"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 14, color: i === 3 ? 'var(--color-wine-soft)' : 'var(--color-ivory)' }}
            transition={{ duration: 0.8, ease: ease.out, delay: step >= 2 && !instant ? 0.4 + i * 0.5 : 0 }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
