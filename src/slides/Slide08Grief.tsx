import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ease } from '../animations/motion'
import { DrawPath, smoothPath } from '../components/animations/DrawPath'
import { Kicker, RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.grief

// Onda del duelo: verde ↓ rojo ↓ verde ↓ rojo ↓ verde. Nunca una línea recta.
const X0 = 140
const X1 = 1780
const MID = 650
// picos (verde, arriba) y valles (rojo, abajo); la amplitud se suaviza con el tiempo
const extremes = [
  { x: X0, y: MID - 40, g: true },
  { x: 420, y: MID + 190, g: false },
  { x: 760, y: MID - 150, g: true },
  { x: 1040, y: MID + 150, g: false },
  { x: 1340, y: MID - 130, g: true },
  { x: 1560, y: MID + 70, g: false },
  { x: X1, y: MID - 120, g: true },
]
const d = smoothPath(
  extremes.map((p) => [p.x, p.y] as [number, number]),
  false,
  0.95,
)

export default function Slide08Grief() {
  const { step, instant } = useSlide()
  const probe = useRef<SVGPathElement>(null)
  const [track, setTrack] = useState<{ x: number[]; y: number[] } | null>(null)

  // muestrea la onda para que un punto la recorra
  useEffect(() => {
    const el = probe.current
    if (!el) return
    const len = el.getTotalLength()
    const pts = Array.from({ length: 80 }, (_, i) => el.getPointAtLength((len * i) / 79))
    setTrack({ x: pts.map((p) => p.x), y: pts.map((p) => p.y) })
  }, [])

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[140px] top-[140px]">
        <Kicker>{c.kicker}</Kicker>
        <RevealText as="h2" text={c.line1} className="mt-6 max-w-[1300px] font-serif text-[60px] font-light leading-[1.15] text-ink" stagger={0.05} delay={0.3} />
        <RevealText
          as="p"
          text={c.line2}
          show={step >= 1}
          className="mt-4 font-serif text-[60px] font-light italic text-wine"
          stagger={0.08}
        />
      </div>

      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        <defs>
          <linearGradient id="grief" gradientUnits="userSpaceOnUse" x1={X0} x2={X1} y1={0} y2={0}>
            {extremes.map((p, i) => (
              <stop
                key={i}
                offset={(p.x - X0) / (X1 - X0)}
                stopColor={p.g ? '#6a9064' : '#b4503f'}
              />
            ))}
          </linearGradient>
        </defs>
        <line x1={X0} x2={X1} y1={MID} y2={MID} stroke="var(--color-stone-1)" strokeDasharray="2 10" />
        <DrawPath d={d} stroke="url(#grief)" strokeWidth={4} strokeLinecap="round" duration={4} delay={0.6} />
        {extremes.map((p, i) => (
          <motion.g
            key={i}
            initial={instant ? false : { opacity: 0, y: p.g ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: instant ? 0 : 0.6 + (4 * (p.x - X0)) / (X1 - X0) }}
          >
            <circle cx={p.x} cy={p.y} r={5} fill={p.g ? 'var(--color-signal-green)' : 'var(--color-signal-red)'} />
            <text
              x={p.x}
              y={p.g ? p.y - 26 : p.y + 42}
              textAnchor={i === 0 ? 'start' : i === extremes.length - 1 ? 'end' : 'middle'}
              fontSize={17}
              letterSpacing="0.28em"
              fontFamily="var(--font-sans)"
              fontWeight={500}
              fill={p.g ? 'var(--color-signal-green)' : 'var(--color-signal-red)'}
            >
              {(p.g ? c.green : c.red).toUpperCase()}
            </text>
          </motion.g>
        ))}
        <path ref={probe} d={d} fill="none" stroke="none" />
        {/* quien recorre la onda */}
        {track && (
          <motion.circle
            r={9}
            fill="var(--color-ivory)"
            stroke="var(--color-ink)"
            strokeWidth={2}
            initial={instant ? false : { cx: track.x[0], cy: track.y[0], opacity: 0 }}
            animate={{ cx: instant ? track.x.at(-1) : track.x, cy: instant ? track.y.at(-1) : track.y, opacity: 1 }}
            transition={instant ? { duration: 0 } : { duration: 4, delay: 0.6, ease: ease.inOut, opacity: { duration: 0.3, delay: 0.6 } }}
          />
        )}
      </svg>
    </div>
  )
}
