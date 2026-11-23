import { useEffect, useRef, useState, type ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

/**
 * Lienzo lógico 16:9 de 1920×1080 escalado al contenedor.
 * Garantiza que la composición sea idéntica en laptop, monitor o proyector.
 */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 0, w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      setBox({ scale: Math.min(width / STAGE_W, height / STAGE_H), w: width, h: height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      {box.scale > 0 && (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translate(${(box.w - STAGE_W * box.scale) / 2}px, ${(box.h - STAGE_H * box.scale) / 2}px) scale(${box.scale})`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
