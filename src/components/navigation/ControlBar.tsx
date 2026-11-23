import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  MonitorSpeaker,
  Pause,
  Play,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ease } from '../../animations/motion'
import { slides } from '../../data/slides'
import { usePresentation } from '../../hooks/usePresentation'
import { formatTime, useClock } from '../../hooks/useTimer'
import { isFullscreen, openPresenter, toggleFullscreen } from '../../utils/fullscreen'

/** Barra discreta: aparece al mover el ratón y se oculta sola. */
export function ControlBar() {
  const p = usePresentation()
  const { state, slide } = p
  const clock = useClock(state.clock)
  const [visible, setVisible] = useState(false)
  const [fs, setFs] = useState(isFullscreen())
  const hovering = useRef(false)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const show = () => {
      setVisible(true)
      clearTimeout(t)
      t = setTimeout(() => !hovering.current && setVisible(false), 2600)
    }
    const onFs = () => setFs(isFullscreen())
    window.addEventListener('mousemove', show)
    document.addEventListener('fullscreenchange', onFs)
    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', show)
      document.removeEventListener('fullscreenchange', onFs)
    }
  }, [])

  const timerCfg = slide.timer
  const timerMine = state.timer.key === slide.id

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="toolbar"
          aria-label="Controles de presentación"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          className="fixed bottom-14 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-stone-1/70 bg-paper/85 px-2 py-1.5 text-ink shadow-[0_12px_40px_-20px_rgba(29,26,24,0.35)] backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: ease.out }}
        >
          <Btn label="Anterior (←)" onClick={p.prev}>
            <ChevronLeft size={18} />
          </Btn>
          <span className="min-w-[64px] text-center text-[12px] tabular-nums tracking-wider text-stone-4">
            {String(state.index + 1).padStart(2, '0')} / {slides.length}
          </span>
          <Btn label="Siguiente (→)" onClick={p.next}>
            <ChevronRight size={18} />
          </Btn>
          <Sep />
          <Btn label={clock.running ? 'Pausar reloj' : 'Iniciar reloj'} onClick={p.toggleClock}>
            {clock.running ? <Pause size={16} /> : <Play size={16} />}
          </Btn>
          <span className="w-[52px] text-[12px] tabular-nums text-stone-4">{formatTime(clock.seconds)}</span>
          {timerCfg && (
            <Btn
              label={timerMine ? 'Pausar / reanudar ejercicio' : `Iniciar ejercicio (${formatTime(timerCfg.seconds)})`}
              onClick={() => (timerMine ? p.toggleTimer() : p.startTimer(slide.id, timerCfg.label, timerCfg.seconds))}
              active={timerMine}
            >
              <Timer size={16} />
            </Btn>
          )}
          <Sep />
          <Btn label="Modo presentador" onClick={openPresenter}>
            <MonitorSpeaker size={16} />
          </Btn>
          <Btn label={state.sound ? 'Sonido: activado' : 'Sonido: desactivado'} onClick={p.toggleSound} active={state.sound}>
            {state.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Btn>
          <Btn label={fs ? 'Salir de pantalla completa' : 'Pantalla completa (F)'} onClick={toggleFullscreen}>
            {fs ? <Minimize size={16} /> : <Maximize size={16} />}
          </Btn>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Btn({ children, label, onClick, active }: { children: ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-cream ${active ? 'text-wine' : ''}`}
    >
      {children}
    </button>
  )
}

const Sep = () => <span className="mx-1 h-4 w-px bg-stone-1" />
