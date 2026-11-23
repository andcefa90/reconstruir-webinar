import { motion, type SVGMotionProps } from 'framer-motion'
import { ease, svgAnim } from '../../animations/motion'
import { useSlide } from '../../hooks/useSlide'

/** Trazo SVG que se dibuja (pathLength 0 → 1). */
export function DrawPath({
  d,
  show = true,
  delay = 0,
  duration = 1.4,
  ...rest
}: { d: string; show?: boolean; delay?: number; duration?: number } & SVGMotionProps<SVGPathElement>) {
  const { instant } = useSlide()
  return (
    <motion.path
      d={d}
      fill="none"
      initial={instant ? false : svgAnim({ pathLength: 0, opacity: 0 })}
      animate={svgAnim(show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 })}
      transition={
        instant
          ? { duration: 0 }
          : { pathLength: { duration, ease: ease.inOut, delay }, opacity: { duration: 0.2, delay } }
      }
      {...rest}
    />
  )
}

/** Curva suave (Catmull-Rom → Bézier) que pasa por todos los puntos. */
export function smoothPath(points: [number, number][], closed = false, tension = 0.5) {
  const p = points
  const n = p.length
  if (n < 2) return ''
  const get = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1)
    const p1 = get(i)
    const p2 = get(i + 1)
    const p3 = get(i + 2)
    const t = tension / 3
    const c1x = p1[0] + (p2[0] - p0[0]) * t
    const c1y = p1[1] + (p2[1] - p0[1]) * t
    const c2x = p2[0] - (p3[0] - p1[0]) * t
    const c2y = p2[1] - (p3[1] - p1[1]) * t
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return closed ? d + ' Z' : d
}
