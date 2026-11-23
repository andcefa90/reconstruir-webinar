import { AnimatePresence, motion } from 'framer-motion'
import { ease, svgAnim } from '../animations/motion'
import { Appear, Kicker, RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSequence, useSlide } from '../hooks/useSlide'

const c = presentation.separation

// Una casa formada por dos mitades. Al separarse, cada mitad completa su pared:
// la estructura no se destruye, se reorganiza.
const W = 340
const H = 300
const ROOF = 120
const half = (side: -1 | 1) =>
  side === -1 ? `M0,${H} L0,${ROOF} L${W / 2},0` : `M${W / 2},0 L${W},${ROOF} L${W},${H}`
const newWall = (side: -1 | 1) => `M${W / 2},${side === -1 ? 0 : 0} L${W / 2},${H}`

function House({ split }: { split: boolean }) {
  const { instant } = useSlide()
  const tr = instant ? { duration: 0 } : { duration: 1.4, ease: ease.emotional }
  return (
    <svg width={1100} height={420} viewBox="-380 -60 1100 420" aria-hidden className="overflow-visible">
      {([-1, 1] as const).map((side) => (
        <motion.g key={side} initial={false} animate={{ x: split ? side * 230 : 0, scale: split ? 0.82 : 1 }} transition={tr} style={{ originX: '50%', originY: '100%' }}>
          <path d={half(side)} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} strokeLinejoin="round" />
          <motion.path
            d={`M${side === -1 ? 0 : W},${H} L${W / 2},${H}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
          {/* la pared nueva que cada hogar construye */}
          <motion.path
            d={newWall(side)}
            fill="none"
            stroke="var(--color-wine)"
            strokeWidth={1.5}
            initial={false}
            animate={svgAnim({ pathLength: split ? 1 : 0, opacity: split ? 1 : 0 })}
            transition={instant ? { duration: 0 } : { duration: 1, delay: split ? 0.9 : 0, ease: ease.inOut }}
          />
          <motion.rect
            x={side === -1 ? 60 : W - 60 - 52}
            y={H - 90}
            width={52}
            height={90}
            fill="none"
            stroke="var(--color-stone-2)"
            strokeWidth={1}
          />
        </motion.g>
      ))}
      {/* el puente entre los dos hogares */}
      <motion.path
        d={`M${W / 2 - 150},${H - 30} L${W / 2 + 150},${H - 30}`}
        stroke="var(--color-wine)"
        strokeWidth={1}
        strokeDasharray="2 8"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: split ? 0.8 : 0 }}
        transition={instant ? { duration: 0 } : { duration: 1, delay: split ? 1.6 : 0 }}
      />
    </svg>
  )
}

export default function Slide04Separation() {
  const { step } = useSlide()
  const lossesActive = step === 2
  const n = useSequence(c.losses.length, 1150, lossesActive, 500)

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait" initial={false}>
        {step <= 1 && (
          <motion.div
            key="house"
            className="absolute inset-0 flex flex-col items-center pt-[150px]"
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-[60px] w-full text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={step}
                  className="kicker absolute inset-x-0 text-[18px] text-stone-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {step === 0 ? c.before : c.after}
                </motion.p>
              </AnimatePresence>
            </div>
            <House split={step >= 1} />
            <Appear show={step >= 1} delay={2} className="mt-10">
              <p className="text-center font-serif text-[58px] font-light leading-tight text-ink">
                Tu familia no se rompió, <span className="italic text-wine">se reorganizó</span> en dos hogares.
              </p>
            </Appear>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="losses"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Kicker className="absolute top-[260px]">{c.lossesIntro}</Kicker>
            <div className="relative h-[200px] w-full">
              {c.losses.map((loss, i) => {
                const current = n === i + 1
                const past = n > i + 1
                return (
                  <motion.p
                    key={loss}
                    className="absolute inset-x-0 text-center font-serif text-[120px] font-light text-ink"
                    initial={false}
                    animate={{
                      opacity: current ? 1 : 0,
                      filter: current ? 'blur(0px)' : 'blur(12px)',
                      y: current ? 0 : past ? -30 : 30,
                      letterSpacing: past ? '0.12em' : '0em',
                    }}
                    transition={{ duration: current ? 0.7 : 1.1, ease: ease.out }}
                  >
                    {loss}
                  </motion.p>
                )
              })}
            </div>
            <div className="absolute bottom-[200px] flex gap-3" aria-hidden>
              {c.losses.map((l, i) => (
                <motion.span
                  key={l}
                  className="h-1 w-1 rounded-full bg-stone-3"
                  animate={{ opacity: n > i ? 0.25 : 0.7, scale: n === i + 1 ? 1.8 : 1 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="final"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <RevealText
              as="h2"
              text={c.finalWord.toUpperCase()}
              className="font-serif text-[176px] font-light leading-none tracking-[0.03em] text-wine"
              duration={1.4}
            />
            <motion.span
              className="mt-12 block h-px w-[420px] origin-center bg-wine/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.8, ease: ease.inOut }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
