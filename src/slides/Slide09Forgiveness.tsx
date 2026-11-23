import { motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.forgiveness

export default function Slide09Forgiveness() {
  const { step, instant } = useSlide()
  const shift = step >= 1
  const tr = (delay = 0) => (instant ? { duration: 0 } : { duration: 1.2, ease: ease.emotional, delay })

  return (
    <div className="flex h-full flex-col px-[140px] pt-[140px]">
      <RevealText as="h2" text={c.title} className="font-serif text-[96px] font-light leading-none text-ink" />

      <div className="relative mt-[90px] grid flex-1 grid-cols-2">
        <motion.span
          className="absolute bottom-[170px] left-1/2 top-0 w-px bg-stone-1"
          initial={instant ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, ease: ease.inOut, delay: 0.4 }}
          style={{ originY: 0 }}
        />
        {/* PERDONAR NO ES — pierde peso */}
        <motion.div className="pr-20" initial={false} animate={{ opacity: shift ? 0.38 : 1, scale: shift ? 0.94 : 1 }} transition={tr()} style={{ originX: 0, originY: 0 }}>
          <p className="kicker text-stone-3">{c.noLabel}</p>
          <ul className="mt-10 space-y-8">
            {c.no.map((t, i) => (
              <li key={t} className="relative w-fit">
                <motion.span
                  className="block font-serif text-[52px] leading-tight text-ink"
                  initial={instant ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, fontWeight: shift ? 300 : 400 }}
                  transition={{ duration: 0.7, ease: ease.out, delay: instant ? 0 : 0.6 + i * 0.12 }}
                >
                  {t}
                </motion.span>
                <motion.span
                  className="absolute left-0 top-1/2 block h-px w-full origin-left bg-ink/50"
                  initial={false}
                  animate={{ scaleX: shift ? 1 : 0 }}
                  transition={instant ? { duration: 0 } : { duration: 0.6, ease: ease.inOut, delay: shift ? 0.2 + i * 0.18 : 0 }}
                />
              </li>
            ))}
          </ul>
        </motion.div>

        {/* PERDONAR SÍ ES — gana presencia */}
        <motion.div className="pl-20" initial={false} animate={{ scale: shift ? 1.04 : 1 }} transition={tr(0.3)} style={{ originX: 0, originY: 0 }}>
          <motion.p className="kicker" initial={false} animate={{ color: shift ? 'var(--color-wine)' : 'var(--color-stone-3)' }} transition={tr(0.3)}>
            {c.yesLabel}
          </motion.p>
          <ul className="mt-10 space-y-8">
            {c.yes.map((t, i) => (
              <motion.li
                key={t}
                className="font-serif text-[52px] leading-tight"
                initial={instant ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, color: shift ? 'var(--color-ink)' : 'var(--color-stone-4)', fontWeight: shift ? 400 : 300 }}
                transition={{ duration: 0.8, ease: ease.out, delay: instant ? 0 : shift ? 0.4 + i * 0.12 : 0.9 + i * 0.12 }}
              >
                {t}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
