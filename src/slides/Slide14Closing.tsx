import { motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { DrawPath } from '../components/animations/DrawPath'
import { Logo, RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.closing

/** El momento más silencioso: pocas palabras y el camino, por fin continuo. */
export default function Slide14Closing() {
  const { step, instant } = useSlide()
  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-x-0 top-[110px] flex justify-center"
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      >
        <Logo size="lg" />
      </motion.div>

      <div className="absolute inset-x-0 top-[300px] flex flex-col items-center">
        <RevealText
          as="h2"
          text={c.line1.toUpperCase()}
          className="font-serif text-[150px] font-light leading-[1] tracking-[0.02em] text-ink"
          delay={0.8}
          duration={1.4}
          stagger={0.2}
        />
        <RevealText
          as="h2"
          text={c.line2.toUpperCase()}
          className="mt-2 font-serif text-[150px] font-light leading-[1] tracking-[0.02em] text-wine"
          delay={1.6}
          duration={1.4}
          stagger={0.2}
        />
        <motion.p
          className="mt-16 font-serif text-[48px] font-light italic text-stone-4"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 12 }}
          transition={{ duration: 1.2, ease: ease.out }}
        >
          {c.thanks}
        </motion.p>
      </div>

      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        <DrawPath d="M-20,930 C600,930 1100,915 1940,880" stroke="var(--color-wine)" strokeWidth={1.5} delay={2.4} duration={3.2} />
      </svg>
    </div>
  )
}
