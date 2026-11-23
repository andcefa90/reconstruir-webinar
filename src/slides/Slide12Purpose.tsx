import { motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { DrawPath } from '../components/animations/DrawPath'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.purpose
// El camino: la misma línea de la portada, ahora continua y ascendente.
const PATH = 'M-20,840 C420,840 820,820 1200,780 S1700,700 1960,660'
const yAt = (x: number) => 840 - Math.max(0, (x - 300) / 1660) ** 1.6 * 180

/** Miniaturas de cada herramienta del recorrido. */
function Glyph({ i }: { i: number }) {
  const s = { fill: 'none', stroke: 'var(--color-wine)', strokeWidth: 1.5 }
  return (
    <svg width={72} height={72} viewBox="0 0 72 72" aria-hidden>
      {i === 0 && (
        <>
          <circle cx={36} cy={36} r={28} {...s} strokeOpacity={0.3} />
          <path d="M36,14 C50,18 58,30 52,42 C46,56 26,58 18,46 C10,34 20,16 36,14 Z" {...s} />
        </>
      )}
      {i === 1 && (
        <>
          <circle cx={36} cy={36} r={8} fill="var(--color-wine)" />
          <circle cx={36} cy={36} r={20} {...s} />
          <circle cx={36} cy={36} r={31} {...s} strokeDasharray="2 5" strokeOpacity={0.5} />
        </>
      )}
      {i === 2 && <path d="M4,36 C14,10 22,10 30,36 S46,62 54,36 S66,20 70,28" {...s} />}
      {i === 3 && (
        <text x={36} y={46} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={28} fill="var(--color-wine)">
          BIFF
        </text>
      )}
      {i === 4 && (
        <>
          <path d="M6,56 L6,36 L18,26 L30,36 L30,56 Z" {...s} />
          <path d="M42,56 L42,36 L54,26 L66,36 L66,56 Z" {...s} />
          <path d="M30,50 L42,50" {...s} strokeDasharray="2 3" />
        </>
      )}
    </svg>
  )
}

const scattered = [
  { x: 300, y: 260 },
  { x: 1560, y: 300 },
  { x: 760, y: 160 },
  { x: 1280, y: 150 },
  { x: 420, y: 520 },
]

export default function Slide12Purpose() {
  const { step, instant } = useSlide()
  const gathered = step >= 1
  const asking = step >= 2

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-x-0 top-[300px] text-center"
        initial={false}
        animate={{ opacity: gathered ? 0 : 1, y: gathered ? -40 : 0 }}
        transition={{ duration: 0.9, ease: ease.emotional }}
      >
        <RevealText as="h2" text={c.line1} className="font-serif text-[76px] font-light text-ink" stagger={0.07} />
        <RevealText as="p" text={c.line2} className="mt-2 font-serif text-[76px] font-light italic text-stone-4" delay={0.8} stagger={0.07} />
      </motion.div>

      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        <DrawPath d={PATH} show={gathered} stroke="var(--color-wine)" strokeWidth={1.5} duration={2.4} delay={0.6} />
      </svg>

      {c.recap.map((name, i) => {
        const x = 360 + i * 300
        const onPath = { x, y: yAt(x) - 60 }
        const s = scattered[i]
        return (
          <motion.div
            key={name}
            className="absolute flex flex-col items-center"
            style={{ translate: '-50% -50%' }}
            initial={false}
            animate={
              gathered
                ? { left: onPath.x, top: onPath.y, opacity: asking ? 0.55 : 1, scale: 1 }
                : { left: s.x, top: s.y, opacity: 0, scale: 0.7 }
            }
            transition={instant ? { duration: 0 } : { duration: 1.6, ease: ease.emotional, delay: gathered && !asking ? 0.2 + i * 0.18 : 0 }}
          >
            <Glyph i={i} />
            <span className="kicker mt-3 text-[13px] text-stone-4">{name}</span>
          </motion.div>
        )
      })}

      <div className="absolute inset-x-0 top-[300px] flex justify-center">
        <RevealText
          as="h2"
          text={c.question}
          show={asking}
          className="font-serif text-[150px] font-light leading-none text-wine"
          duration={1.6}
          stagger={0.18}
        />
      </div>
    </div>
  )
}
