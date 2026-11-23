import { AnimatePresence, motion } from 'framer-motion'
import { ease, svgAnim } from '../animations/motion'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.coparenting

// Los dos hogares de la slide de separación reaparecen; los temas de crianza
// cuelgan entre ambos, conectados a los dos.
const HOME_L = { x: 330, y: 760 }
const HOME_R = { x: 1590, y: 760 }
const nodes = c.nodes.map((name, i) => {
  const t = i / (c.nodes.length - 1)
  return { name, x: 560 + t * 800, y: 700 - Math.sin(t * Math.PI) * 170 }
})

export default function Slide11Coparenting() {
  const { step, instant } = useSlide()
  const tr = (d: number, delay = 0) => (instant ? { duration: 0 } : { duration: d, ease: ease.inOut, delay })

  return (
    <div className="relative h-full w-full">
      {/* EX PAREJA → SOCIOS DE CRIANZA */}
      <div className="absolute inset-x-0 top-[150px] flex h-[150px] items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={step === 0 ? 'from' : 'to'}
            className={`font-serif font-light uppercase leading-none tracking-[0.03em] ${step === 0 ? 'text-[150px] text-stone-3' : 'text-[120px] text-wine'}`}
            initial={instant ? false : { opacity: 0, filter: 'blur(16px)', letterSpacing: '0.2em' }}
            animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.03em' }}
            exit={{ opacity: 0, filter: 'blur(16px)', letterSpacing: '-0.02em' }}
            transition={{ duration: 0.9, ease: ease.emotional }}
          >
            {step === 0 ? c.from : c.to}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.p
        className="absolute inset-x-0 top-[340px] text-center font-serif text-[48px] font-light italic text-ink"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 12 }}
        transition={{ duration: 0.9, ease: ease.out, delay: step === 1 ? 0.8 : 0 }}
      >
        {c.quote}
      </motion.p>

      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        {nodes.map((n, i) =>
          [HOME_L, HOME_R].map((h, k) => (
            <motion.path
              key={`${i}-${k}`}
              d={`M${h.x},${h.y - 40} Q${(h.x + n.x) / 2},${Math.max(h.y, n.y) + 40} ${n.x},${n.y + 14}`}
              fill="none"
              stroke="var(--color-wine)"
              strokeOpacity={0.35}
              strokeWidth={1}
              initial={false}
              animate={svgAnim({ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 })}
              transition={tr(1.1, step >= 2 ? 0.5 + i * 0.12 : 0)}
            />
          )),
        )}
        {[HOME_L, HOME_R].map((h, k) => (
          <motion.g key={k} initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={tr(0.8)}>
            <path
              d={`M${h.x - 50},${h.y + 40} L${h.x - 50},${h.y - 10} L${h.x},${h.y - 50} L${h.x + 50},${h.y - 10} L${h.x + 50},${h.y + 40} Z`}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <text x={h.x} y={h.y + 90} textAnchor="middle" fontSize={15} letterSpacing="0.3em" fill="var(--color-stone-3)" fontFamily="var(--font-sans)" fontWeight={500}>
              HOGAR {k === 0 ? 'A' : 'B'}
            </text>
          </motion.g>
        ))}
      </svg>

      {nodes.map((n, i) => (
        <motion.div
          key={n.name}
          className="absolute flex flex-col items-center"
          style={{ left: n.x, top: n.y, translate: '-50% -50%' }}
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.6 }}
          transition={{ duration: instant ? 0 : 0.6, ease: ease.out, delay: step >= 2 && !instant ? 0.9 + i * 0.12 : 0 }}
        >
          <span className="h-3 w-3 rounded-full border-2 border-wine bg-ivory" />
          <span className="kicker mt-4 text-[16px] text-ink">{n.name}</span>
        </motion.div>
      ))}
    </div>
  )
}
