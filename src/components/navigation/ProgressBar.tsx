import { motion } from 'framer-motion'
import { ease } from '../../animations/motion'
import { presentation } from '../../data/presentation'
import { slides } from '../../data/slides'
import { usePresentation } from '../../hooks/usePresentation'

const X0 = 140
const X1 = 1780
const Y = 1022
const chapters = presentation.chapters
const step = (X1 - X0) / (chapters.length - 1)

/**
 * Barra de progreso narrativa: RUPTURA ──●── RECONSTRUIR.
 * La línea empieza rota junto a "Ruptura" y se cierra al llegar a "Claridad".
 */
export function ProgressBar() {
  const { slide, state, goto } = usePresentation()
  const dark = slide.theme === 'dark'
  const inChapter = slides.filter((s) => s.chapter === slide.chapter)
  const pos = inChapter.findIndex((s) => s.id === slide.id)
  const frac = slide.chapter === chapters.length - 1 ? pos / Math.max(1, inChapter.length - 1) : pos / inChapter.length
  const x = X0 + step * (slide.chapter + (slide.chapter === chapters.length - 1 ? 0 : frac))
  const healed = slide.chapter >= 2
  const gapX = X0 + step * 0.55
  const base = dark ? 'rgba(246,241,233,0.16)' : 'var(--color-stone-1)'
  const travelled = dark ? 'rgba(246,241,233,0.7)' : 'var(--color-wine)'

  return (
    <nav aria-label="Progreso narrativo" className="pointer-events-none absolute inset-0 z-20">
      <svg width={1920} height={1080} className="absolute inset-0" aria-hidden>
        {/* línea base (con ruptura al inicio) */}
        <motion.line x1={X0} x2={gapX - 10} y1={Y} y2={Y} stroke={base} strokeWidth={1} />
        <motion.line
          y1={Y}
          y2={Y}
          stroke={base}
          strokeWidth={1}
          initial={false}
          animate={{ x1: healed ? gapX - 10 : gapX + 10, x2: X1, y1: healed ? Y : Y + 4, y2: Y }}
          transition={{ duration: 1.2, ease: ease.emotional }}
        />
        {/* recorrido */}
        <motion.line
          x1={X0}
          y1={Y}
          y2={Y}
          stroke={travelled}
          strokeWidth={1.25}
          strokeOpacity={0.55}
          initial={false}
          animate={{ x2: x }}
          transition={{ duration: 0.9, ease: ease.out }}
        />
        {chapters.map((_, i) => (
          <circle key={i} cx={X0 + step * i} cy={Y} r={2} fill={i <= slide.chapter ? travelled : base} />
        ))}
        <motion.circle
          cy={Y}
          r={5}
          fill={dark ? 'var(--color-ivory)' : 'var(--color-wine)'}
          initial={false}
          animate={{ cx: x }}
          transition={{ duration: 0.9, ease: ease.out }}
        />
      </svg>
      {chapters.map((c, i) => {
        const current = i === slide.chapter
        const first = slides.findIndex((s) => s.chapter === i)
        return (
          <button
            key={c}
            type="button"
            onClick={() => goto(first)}
            aria-current={current ? 'step' : undefined}
            className="kicker pointer-events-auto absolute -translate-x-1/2 cursor-pointer whitespace-nowrap text-[11px] transition-opacity duration-500 hover:opacity-100"
            style={{
              left: X0 + step * i,
              top: Y + 16,
              opacity: current ? 1 : i === 0 || i === chapters.length - 1 ? 0.55 : 0.32,
              color: current ? (dark ? 'var(--color-ivory)' : 'var(--color-wine)') : dark ? 'var(--color-ivory)' : 'var(--color-stone-4)',
              letterSpacing: '0.3em',
            }}
            tabIndex={-1}
          >
            {c}
          </button>
        )
      })}
      <span className="sr-only">
        Capítulo {slide.chapter + 1} de {chapters.length}: {chapters[slide.chapter]}. Slide {state.index + 1} de {slides.length}.
      </span>
    </nav>
  )
}
