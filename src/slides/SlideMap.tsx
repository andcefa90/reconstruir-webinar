import { motion } from 'framer-motion'
import { ease, svgAnim } from '../animations/motion'
import { DrawPath } from '../components/animations/DrawPath'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.map

// Mapa minimalista: calles, manzanas y una ruta hacia un destino.
const roads = [
  'M-20,640 C300,600 520,700 820,660 S1400,560 1940,620',
  'M380,-20 C420,260 360,520 420,760 S520,1000 480,1100',
  'M1180,-20 C1140,240 1240,460 1200,700 S1120,980 1180,1100',
  'M-20,320 C420,300 900,360 1940,300',
  'M760,640 C820,820 900,940 1020,1100',
  'M1540,-20 C1500,300 1620,560 1560,1100',
]
const route = 'M640,880 C700,760 760,700 900,664 S1150,560 1210,470 S1360,330 1520,310'
const blocks = [
  [470, 380, 250, 200],
  [1250, 370, 230, 240],
  [870, 720, 200, 140],
  [120, 690, 200, 220],
  [1620, 680, 200, 180],
]

export default function SlideMap() {
  const { step, instant } = useSlide()
  const broken = step >= 1
  const here = step >= 3
  const tr = (d: number, delay = 0) => (instant ? { duration: 0 } : { duration: d, ease: ease.inOut, delay })

  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        {blocks.map(([x, y, w, h], i) => (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="var(--color-cream)"
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: broken ? 0 : 0.7, x: broken ? (i % 2 ? 30 : -30) : 0 }}
            transition={tr(broken ? 1.2 : 1, broken ? i * 0.1 : 0.2)}
          />
        ))}
        {roads.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-stone-2)"
            strokeWidth={1.25}
            pathLength={1}
            initial={instant ? false : svgAnim({ pathLength: 0 })}
            animate={svgAnim(
              broken
                ? { pathLength: 1, opacity: here ? 0 : 0.5, strokeDasharray: '0.04 0.06', y: (i % 2 ? 1 : -1) * 14 }
                : { pathLength: 1, opacity: 1, strokeDasharray: '1 0', y: 0 },
            )}
            transition={broken ? tr(1.4, i * 0.08) : tr(1.6, i * 0.12)}
          />
        ))}
        {/* ruta hacia el destino */}
        <DrawPath d={route} show={!broken} stroke="var(--color-wine)" strokeWidth={2.5} strokeLinecap="round" delay={0.9} duration={1.8} />
        <motion.g initial={false} animate={{ opacity: broken ? 0 : 1, y: broken ? 20 : 0 }} transition={tr(0.8, broken ? 0 : 2.4)}>
          <circle cx={1520} cy={310} r={9} fill="var(--color-wine)" />
          <circle cx={1520} cy={310} r={22} fill="none" stroke="var(--color-wine)" strokeOpacity={0.3} />
        </motion.g>
        <motion.circle cx={640} cy={880} r={7} fill="var(--color-ink)" initial={false} animate={{ opacity: here ? 0 : 1 }} />

        {/* "Estás aquí": un punto y un círculo que anticipa la Rueda de la Vida */}
        <motion.circle
          cx={960}
          cy={600}
          r={8}
          fill="var(--color-wine)"
          initial={false}
          animate={{ opacity: here ? 1 : 0, scale: here ? 1 : 0 }}
          transition={tr(0.6)}
        />
        <motion.circle
          cx={960}
          cy={600}
          r={150}
          fill="none"
          stroke="var(--color-wine)"
          strokeWidth={1}
          style={{ rotate: -90, transformOrigin: '960px 600px' }}
          initial={false}
          animate={svgAnim({ pathLength: here ? 1 : 0, opacity: here ? 0.6 : 0 })}
          transition={tr(1.8, 0.4)}
        />
        {here && !instant && (
          <motion.circle
            cx={960}
            cy={600}
            r={8}
            fill="none"
            stroke="var(--color-wine)"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            style={{ transformOrigin: '960px 600px' }}
          />
        )}
      </svg>

      <div className="absolute inset-x-[140px] top-[150px]">
        <motion.div initial={false} animate={{ opacity: step === 0 ? 1 : 0 }} transition={{ duration: 0.6 }} className="absolute">
          <RevealText as="h2" text={c.before} className="font-serif text-[84px] font-light text-ink" />
        </motion.div>
        <motion.div initial={false} animate={{ opacity: step === 1 || step === 2 ? 1 : 0 }} transition={{ duration: 0.6 }} className="absolute">
          <RevealText
            as="h2"
            text={c.question.toUpperCase()}
            show={step >= 1}
            className="font-serif text-[150px] font-light leading-none tracking-[0.02em] text-wine"
            delay={0.8}
            duration={1.2}
          />
          <motion.p
            className="mt-10 max-w-[1100px] font-serif text-[48px] font-light italic text-stone-4"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 12 }}
            transition={{ duration: 0.8, ease: ease.out }}
          >
            {c.insight}
          </motion.p>
        </motion.div>
        <motion.div initial={false} animate={{ opacity: here ? 1 : 0 }} transition={{ duration: 0.8, delay: here ? 1 : 0 }} className="absolute">
          <h2 className="font-serif text-[72px] font-light text-ink">{c.next}</h2>
        </motion.div>
      </div>
      <motion.p
        className="kicker absolute left-[960px] top-[790px] -translate-x-1/2 text-wine"
        initial={false}
        animate={{ opacity: here ? 1 : 0 }}
        transition={{ duration: 0.8, delay: here ? 1.6 : 0 }}
      >
        {c.here}
      </motion.p>
    </div>
  )
}
