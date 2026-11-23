import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '../../animations/motion'
import { smoothPath } from '../animations/DrawPath'

export const WHEEL_DEFAULT = [5, 5, 5, 5, 5, 5, 5, 5]

const SIZE = 860
const C = SIZE / 2
const R = 300
const MIN = 0.1

const angle = (i: number, n: number) => ((-90 + (360 / n) * i) * Math.PI) / 180
const radius = (v: number) => R * (MIN + (1 - MIN) * (v / 10))

export function wheelExtremes(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return { low: null, high: null }
  return { low: values.indexOf(min), high: values.indexOf(max) }
}

/**
 * Rueda orgánica: una forma suave que respira con los valores.
 * Se puede puntuar arrastrando directamente sobre la rueda.
 */
export function LifeWheel({
  areas,
  values,
  onChange,
  interactive = true,
  scale = 1,
}: {
  areas: string[]
  values: number[]
  onChange: (v: number[]) => void
  interactive?: boolean
  scale?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const n = areas.length
  const pts = values.map((v, i) => [C + Math.cos(angle(i, n)) * radius(v), C + Math.sin(angle(i, n)) * radius(v)] as [number, number])
  const d = smoothPath(pts, true, 0.85)
  const { low, high } = wheelExtremes(values)

  const setFromPointer = (e: React.PointerEvent) => {
    const svg = ref.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const k = SIZE / rect.width
    const x = (e.clientX - rect.left) * k - C
    const y = (e.clientY - rect.top) * k - C
    const dist = Math.hypot(x, y)
    if (dist > R * 1.15) return
    let a = (Math.atan2(y, x) * 180) / Math.PI + 90
    if (a < 0) a += 360
    const i = Math.round(a / (360 / n)) % n
    const v = Math.max(1, Math.min(10, Math.round(((dist / R - MIN) / (1 - MIN)) * 10)))
    if (values[i] !== v) onChange(values.map((old, j) => (j === i ? v : old)))
  }

  return (
    <motion.svg
      ref={ref}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`overflow-visible ${interactive ? 'cursor-crosshair touch-none select-none' : ''}`}
      animate={{ scale }}
      transition={{ duration: 0.9, ease: ease.emotional }}
      onPointerDown={(e) => {
        if (!interactive) return
        dragging.current = true
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        setFromPointer(e)
      }}
      onPointerMove={(e) => dragging.current && setFromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      role="img"
      aria-label={`Rueda de la Vida: ${areas.map((a, i) => `${a} ${values[i]}`).join(', ')}`}
    >
      {[2, 4, 6, 8, 10].map((v) => (
        <circle key={v} cx={C} cy={C} r={radius(v)} fill="none" stroke="var(--color-stone-1)" strokeWidth={v === 10 ? 1.25 : 0.75} />
      ))}
      {areas.map((_, i) => (
        <line
          key={i}
          x1={C}
          y1={C}
          x2={C + Math.cos(angle(i, n)) * R}
          y2={C + Math.sin(angle(i, n)) * R}
          stroke="var(--color-stone-1)"
          strokeWidth={0.75}
        />
      ))}

      <motion.path
        initial={false}
        animate={{ d }}
        transition={{ duration: 0.45, ease: ease.out }}
        fill="var(--color-wine)"
        fillOpacity={0.1}
        stroke="var(--color-wine)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          initial={false}
          animate={{ cx: x, cy: y, r: i === low ? 9 : i === high ? 8 : 5 }}
          transition={{ duration: 0.45, ease: ease.out }}
          fill={i === low ? 'var(--color-wine)' : i === high ? 'var(--color-ink)' : 'var(--color-ivory)'}
          stroke={i === high ? 'var(--color-ink)' : 'var(--color-wine)'}
          strokeWidth={2}
        />
      ))}

      {areas.map((a, i) => {
        const ax = Math.cos(angle(i, n))
        const ay = Math.sin(angle(i, n))
        const x = C + ax * (R + 44)
        const y = C + ay * (R + 44)
        const anchor = Math.abs(ax) < 0.2 ? 'middle' : ax > 0 ? 'start' : 'end'
        const emphasis = i === low || i === high
        return (
          <g key={a}>
            <text
              x={x}
              y={y + (ay > 0.5 ? 14 : ay < -0.5 ? -8 : 6)}
              textAnchor={anchor}
              fontSize={22}
              fontFamily="var(--font-sans)"
              fontWeight={emphasis ? 600 : 400}
              fill={i === low ? 'var(--color-wine)' : emphasis ? 'var(--color-ink)' : 'var(--color-stone-4)'}
              letterSpacing="0.02em"
            >
              {a}
            </text>
            <text
              x={x}
              y={y + (ay > 0.5 ? 38 : ay < -0.5 ? 16 : 30)}
              textAnchor={anchor}
              fontSize={19}
              fontFamily="var(--font-serif)"
              fill="var(--color-stone-3)"
            >
              {values[i]}
            </text>
          </g>
        )
      })}
    </motion.svg>
  )
}
