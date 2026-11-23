import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { usePresentation } from '../../hooks/usePresentation'
import { formatTime, useTimer } from '../../hooks/useTimer'
import { cx } from '../ui/primitives'

/**
 * Temporizador circular elegante. Sin estética deportiva:
 * una línea fina que avanza; en los últimos 10 s el tono cambia a vinotinto.
 */
export function TimerRing({
  size = 220,
  tone = 'light',
  controls = true,
  idleSeconds,
}: {
  size?: number
  tone?: 'light' | 'dark'
  controls?: boolean
  /** Valor a mostrar mientras no hay temporizador activo. */
  idleSeconds?: number
}) {
  const { state, toggleTimer, resetTimer, closeTimer } = usePresentation()
  const live = useTimer(state.timer)
  const t = !live.active && idleSeconds ? { ...live, remaining: idleSeconds, progress: 0 } : live
  const r = size / 2 - 6
  const c = 2 * Math.PI * r
  const ink = tone === 'light' ? 'text-ink' : 'text-ivory'
  const track = tone === 'light' ? 'var(--color-stone-1)' : 'rgba(246,241,233,.14)'
  const accent = t.final || t.done ? 'var(--color-wine-soft)' : tone === 'light' ? 'var(--color-wine)' : 'var(--color-ivory)'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }} role="timer" aria-live="off" aria-label={`Tiempo restante ${formatTime(t.remaining)}`}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={1.5} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth={t.final ? 3 : 2}
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: c * t.progress }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </svg>
        <motion.div
          className={cx('absolute inset-0 flex flex-col items-center justify-center', ink)}
          animate={t.final ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={t.final ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        >
          <span className="font-serif font-light tabular-nums" style={{ fontSize: size * 0.26, lineHeight: 1 }}>
            {formatTime(t.remaining)}
          </span>
          {t.done && <span className="kicker mt-3 text-[11px] text-wine-soft">Tiempo</span>}
        </motion.div>
      </div>
      {controls && t.active && (
        <div className={cx('flex items-center gap-1', ink)}>
          <IconBtn label={t.running ? 'Pausar' : 'Reanudar'} onClick={toggleTimer}>
            {t.running ? <Pause size={16} /> : <Play size={16} />}
          </IconBtn>
          <IconBtn label="Reiniciar" onClick={resetTimer}>
            <RotateCcw size={16} />
          </IconBtn>
          <IconBtn label="Cerrar temporizador" onClick={closeTimer}>
            <X size={16} />
          </IconBtn>
        </div>
      )}
    </div>
  )
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full opacity-60 transition hover:bg-current/10 hover:opacity-100"
    >
      {children}
    </button>
  )
}

/** Suena una vez al terminar (si SOUND ON). */
export function useTimerChime() {
  const { state, sound } = usePresentation()
  const t = useTimer(state.timer)
  const fired = useRef<string | null>(null)
  useEffect(() => {
    const k = `${state.timer.key}-${state.timer.startedAt ?? state.timer.elapsed}`
    if (t.done && fired.current !== k) {
      fired.current = k
      sound('timer')
    }
  }, [t.done, state.timer, sound])
}
