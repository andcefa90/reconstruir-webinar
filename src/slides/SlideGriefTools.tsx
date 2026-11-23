import { motion } from 'framer-motion'
import { useState } from 'react'
import { ease, svgAnim } from '../animations/motion'
import { Kicker } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useEscape, usePresentation } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.griefTools

/** Glifos con animación propia para cada herramienta. */
function Glyph({ i, active }: { i: number; active: boolean }) {
  const { instant } = useSlide()
  const t = (d: number, delay = 0) => (instant ? { duration: 0 } : { duration: d, ease: ease.inOut, delay })
  const stroke = active ? 'var(--color-wine)' : 'var(--color-stone-3)'
  return (
    <svg width={160} height={120} viewBox="0 0 160 120" aria-hidden className="overflow-visible">
      {i === 0 && (
        // dos presencias que se separan; el hilo entre ellas se apaga
        <>
          <motion.circle cy={60} r={16} fill="none" stroke={stroke} strokeWidth={1.5} animate={{ cx: active ? 28 : 58 }} transition={t(1.2)} />
          <motion.circle cy={60} r={16} fill="none" stroke={stroke} strokeWidth={1.5} animate={{ cx: active ? 132 : 102 }} transition={t(1.2)} />
          <motion.line y1={60} y2={60} stroke={stroke} strokeWidth={1} strokeDasharray="3 5" animate={{ x1: active ? 46 : 74, x2: active ? 114 : 86, opacity: active ? 0.15 : 0.8 }} transition={t(1.2)} />
        </>
      )}
      {i === 1 && (
        // un círculo que se cierra
        <motion.circle
          cx={80}
          cy={60}
          r={42}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ rotate: -90, transformOrigin: '80px 60px' }}
          initial={false}
          animate={svgAnim({ pathLength: active ? 1 : 0.82 })}
          transition={t(1.4)}
        />
      )}
      {i === 2 &&
        // líneas que se escriben
        [0, 1, 2, 3].map((k) => (
          <motion.line
            key={k}
            x1={24}
            y1={26 + k * 22}
            x2={k === 3 ? 96 : 136}
            y2={26 + k * 22}
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={false}
            animate={svgAnim({ pathLength: active ? 1 : 0.35 })}
            transition={t(0.6, active ? k * 0.25 : 0)}
          />
        ))}
    </svg>
  )
}

export default function SlideGriefTools() {
  const { instant } = useSlide()
  const { next } = usePresentation()
  const [open, setOpen] = useState<number | null>(null)
  useEscape(() => setOpen(null))

  return (
    <div className="flex h-full flex-col px-[140px] pt-[140px]">
      <Kicker>{c.kicker}</Kicker>
      <div className="mt-16 flex flex-1 pb-[150px]">
        {c.items.map((item, i) => {
          const active = open === i
          return (
            <motion.button
              key={item.name}
              type="button"
              aria-expanded={active}
              onClick={() => setOpen(active ? null : i)}
              className="group relative flex cursor-pointer flex-col border-l border-stone-1 px-12 pt-6 text-left first:border-l-0 first:pl-0"
              initial={instant ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: open !== null && !active ? 0.4 : 1, y: 0, flexGrow: active ? 1.8 : 1 }}
              transition={{ duration: 0.7, ease: ease.out, delay: open === null && !instant ? 0.2 + i * 0.15 : 0 }}
              style={{ flexBasis: 0 }}
            >
              <span className="font-serif text-[30px] font-light text-stone-2 transition-colors group-hover:text-wine">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mt-10">
                <Glyph i={i} active={active} />
              </div>
              <span className="mt-12 font-sans text-[46px] font-light uppercase leading-[1.05] tracking-[0.02em] text-ink">{item.name}</span>
              <motion.span
                className="mt-6 block max-w-[560px] overflow-hidden font-serif text-[32px] font-light italic leading-snug text-stone-4"
                initial={false}
                animate={{ opacity: active ? 1 : 0, height: active ? 'auto' : 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
              >
                {item.hint}
                {i === 2 && (
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    className="kicker mt-6 block text-[14px] not-italic text-wine underline-offset-8 hover:underline"
                  >
                    Escribir la carta →
                  </span>
                )}
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
