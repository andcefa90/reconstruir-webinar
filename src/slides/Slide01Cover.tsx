import { motion } from 'framer-motion'
import { ease, svgAnim } from '../animations/motion'
import { Logo } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide, useTimeline } from '../hooks/useSlide'

const Y = 790
// Fases: 1 la línea avanza · 2 se rompe · 3 pausa y continuación · 4 título · 5 amanecer crema
const TIMELINE = [300, 2100, 3300, 4200, 5500]

export default function Slide01Cover() {
  const { instant } = useSlide()
  const phase = useTimeline(TIMELINE)
  const p = (n: number) => phase >= n
  const lit = p(5)
  const lineColor = lit ? '#6e1f2f' : '#f6f1e9'
  const t = (d: number) => (instant ? { duration: 0 } : { duration: d, ease: ease.emotional })

  return (
    <div className="relative h-full w-full">
      {/* amanecer: de noche a marfil */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ backgroundColor: lit ? 'var(--color-ivory)' : 'var(--color-night)' }}
        transition={t(1.6)}
      />

      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        {/* el camino recorrido */}
        <motion.path
          d={`M-20,${Y} L930,${Y}`}
          fill="none"
          strokeWidth={1.5}
          initial={instant ? false : svgAnim({ pathLength: 0 })}
          animate={svgAnim({ pathLength: p(1) ? 1 : 0, stroke: lineColor })}
          transition={instant ? { duration: 0 } : { pathLength: { duration: 1.6, ease: ease.inOut }, stroke: { duration: 1.6 } }}
        />
        {/* el fragmento que se rompe */}
        <motion.path
          d={`M930,${Y} L1010,${Y}`}
          fill="none"
          strokeWidth={1.5}
          style={{ transformOrigin: '930px 790px', transformBox: 'view-box' }}
          initial={instant ? false : svgAnim({ pathLength: 0, opacity: 1 })}
          animate={svgAnim({
            pathLength: p(1) ? 1 : 0,
            rotate: p(2) ? 9 : 0,
            y: p(2) ? 26 : 0,
            x: p(2) ? 14 : 0,
            opacity: p(2) ? 0.28 : 1,
            stroke: lineColor,
          })}
          transition={
            instant
              ? { duration: 0 }
              : {
                  pathLength: { duration: 1.6, ease: ease.inOut },
                  default: { duration: 0.5, ease: [0.5, 0, 0.75, 0] },
                  stroke: { duration: 1.6 },
                }
          }
        />
        {/* la continuación: más corta al principio, luego alcanza el borde */}
        <motion.path
          d={`M1070,${Y} C1260,${Y} 1420,${Y - 10} 1960,${Y - 70}`}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={instant ? false : svgAnim({ pathLength: 0 })}
          animate={svgAnim({ pathLength: p(5) ? 1 : p(3) ? 0.16 : 0, stroke: lineColor })}
          transition={instant ? { duration: 0 } : { pathLength: { duration: p(5) ? 2.4 : 1.1, ease: ease.inOut }, stroke: { duration: 1.6 } }}
        />
        <motion.circle
          cx={1070}
          cy={Y}
          r={4}
          initial={false}
          animate={{ opacity: p(3) ? 1 : 0, fill: lineColor }}
          transition={t(0.6)}
        />
      </svg>

      <motion.div
        className="absolute left-0 right-0 top-[110px] flex justify-center"
        initial={false}
        animate={{ opacity: p(5) ? 1 : 0 }}
        transition={t(1.2)}
      >
        <Logo size="lg" />
      </motion.div>

      <div className="absolute inset-x-0 top-[330px] flex flex-col items-center">
        <h1 className="overflow-hidden" aria-label={presentation.title}>
          <motion.span
            className="block font-serif font-light leading-none tracking-[0.04em]"
            style={{ fontSize: 232 }}
            initial={instant ? false : { y: '105%', opacity: 0 }}
            animate={{
              y: p(4) ? '0%' : '105%',
              opacity: p(4) ? 1 : 0,
              color: lit ? 'var(--color-ink)' : 'var(--color-ivory)',
            }}
            transition={instant ? { duration: 0 } : { y: { duration: 1.4, ease: ease.emotional }, opacity: { duration: 0.8 }, color: { duration: 1.6 } }}
          >
            {presentation.title}
          </motion.span>
        </h1>
        <motion.p
          className="mt-8 font-serif text-[54px] font-light italic text-stone-4"
          initial={false}
          animate={{ opacity: p(5) ? 1 : 0, y: p(5) ? 0 : 14 }}
          transition={instant ? { duration: 0 } : { duration: 1.2, ease: ease.out, delay: 0.5 }}
        >
          {presentation.subtitle}
        </motion.p>
      </div>

      <motion.p
        className="kicker absolute bottom-[96px] left-[140px] text-stone-3"
        initial={false}
        animate={{ opacity: p(5) ? 1 : 0 }}
        transition={instant ? { duration: 0 } : { duration: 1, delay: 1.2 }}
      >
        {presentation.presenterName}
      </motion.p>
    </div>
  )
}
