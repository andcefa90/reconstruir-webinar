import { motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.fears

// Cada miedo llega desde una dirección distinta, borroso.
// Al nombrarlos (build 3) se ordenan en una sola línea, nítidos.
const scattered = [
  { x: -470, y: -40, from: { x: -500, y: 0 }, size: 150, rot: -4 },
  { x: 380, y: -130, from: { x: 0, y: -300 }, size: 128, rot: 3 },
  { x: -260, y: 170, from: { x: 0, y: 300 }, size: 118, rot: 2 },
  { x: 480, y: 140, from: { x: 500, y: 0 }, size: 138, rot: -3 },
]

export default function Slide05Fears() {
  const { step, instant } = useSlide()
  const arrived = step >= 1
  const named = step >= 2

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[140px] top-[170px]">
        <motion.div initial={false} animate={{ opacity: named ? 0.4 : 1 }} transition={{ duration: 0.9 }}>
          <RevealText as="h2" text={c.line1} className="font-serif text-[64px] font-light text-ink" />
        </motion.div>
        <RevealText
          as="h2"
          text={c.line2}
          show={named}
          className="mt-2 font-serif text-[64px] font-light italic text-wine"
          stagger={0.07}
        />
      </div>

      <div className="absolute left-1/2 top-[620px]">
        {c.items.map((fear, i) => {
          const s = scattered[i]
          const rowX = -570 + i * 380
          return (
            <motion.span
              key={fear}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans font-light uppercase tracking-[0.08em]"
              initial={instant ? false : { opacity: 0, x: s.x + s.from.x, y: s.y + s.from.y, filter: 'blur(20px)' }}
              animate={
                !arrived
                  ? { opacity: 0, x: s.x + s.from.x, y: s.y + s.from.y, filter: 'blur(20px)' }
                  : named
                    ? { opacity: 1, x: rowX, y: 80, rotate: 0, filter: 'blur(0px)', fontSize: '64px', color: 'var(--color-ink)' }
                    : { opacity: 0.55, x: s.x, y: s.y, rotate: s.rot, filter: 'blur(5px)', fontSize: `${s.size}px`, color: 'var(--color-stone-3)' }
              }
              transition={
                instant
                  ? { duration: 0 }
                  : { duration: named ? 1.1 : 1.6, ease: ease.emotional, delay: named ? i * 0.12 : arrived ? i * 0.35 : 0 }
              }
            >
              {fear}
            </motion.span>
          )
        })}
        <motion.span
          className="absolute top-[150px] block h-px origin-left bg-wine/50"
          style={{ left: -760, width: 1520 }}
          initial={false}
          animate={{ scaleX: named ? 1 : 0 }}
          transition={{ duration: 1.4, ease: ease.inOut, delay: named ? 0.6 : 0 }}
        />
      </div>
    </div>
  )
}
