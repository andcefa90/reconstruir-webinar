import { ChevronLeft, ChevronRight, MessageSquareQuote, Pause, Play, RotateCcw, Timer, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { presentation } from '../../data/presentation'
import { slides, supportSlides, totalMinutes } from '../../data/slides'
import { faqNotes, speakerNotes, vivenciaQuestions, vivenciaStructure } from '../../data/speakerNotes'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { usePresentation } from '../../hooks/usePresentation'
import { formatTime, useClock, useTimer } from '../../hooks/useTimer'
import { Stage } from '../presentation/Stage'
import { SlideView, themeBg } from '../presentation/SlideView'
import { TimerRing } from '../timers/TimerRing'

/** Miniatura estática de una slide en un build concreto. */
function SlidePreview({ id, step, theme }: { id: string; step: number; theme: 'light' | 'dark' }) {
  return (
    <div className="pointer-events-none aspect-video w-full overflow-hidden rounded-md ring-1 ring-white/10" style={{ backgroundColor: themeBg[theme] }}>
      <Stage>
        <div className={`absolute inset-0 ${theme === 'dark' ? 'text-ivory' : 'text-ink'}`} style={{ backgroundColor: themeBg[theme] }}>
          <SlideView id={id} step={step} preview />
        </div>
      </Stage>
    </div>
  )
}

function Panel({ title, children, className = '' }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-white/8 bg-white/[0.03] p-5 ${className}`}>
      <h3 className="kicker mb-4 flex items-center gap-2 text-[11px] text-ivory/45">{title}</h3>
      {children}
    </section>
  )
}

function Btn({ children, onClick, label, active }: { children: ReactNode; onClick: () => void; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-10 min-w-10 cursor-pointer place-items-center rounded-full px-3 transition-colors hover:bg-white/10 ${active ? 'bg-wine text-ivory hover:bg-wine-soft' : 'text-ivory/80'}`}
    >
      {children}
    </button>
  )
}

export default function PresenterView() {
  const p = usePresentation()
  const { state, slide, notes } = p
  useKeyboardNavigation()
  const clock = useClock(state.clock)
  const timer = useTimer(state.timer)

  // siguiente vista: siguiente build o siguiente slide
  const nextInSlide = state.step < slide.steps - 1
  const nextSlide = slides[state.index + 1]
  const nextId = nextInSlide ? slide.id : nextSlide?.id
  const nextStep = nextInSlide ? state.step + 1 : nextSlide ? nextSlide.steps - 1 : 0
  const nextTheme = nextInSlide ? slide.theme : (nextSlide?.theme ?? 'light')

  // ritmo: minutos planificados hasta el final de esta slide vs reloj
  const plannedUntil = slides.slice(0, state.index + 1).reduce((a, s) => a + s.minutes, 0)
  const plannedStart = plannedUntil - slide.minutes
  const elapsedMin = clock.seconds / 60
  const drift = elapsedMin - plannedUntil
  const pace = clock.seconds === 0 ? 'Reloj detenido' : elapsedMin < plannedStart ? 'Adelantado' : drift > 0.5 ? `+${Math.round(drift)} min` : 'En tiempo'

  const supportId = state.support
  const faqIndex = supportId ? Number(supportId.replace('faq-', '')) : null

  return (
    <div className="min-h-full bg-night px-6 py-5 font-sans text-ivory">
      {/* cabecera */}
      <header className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-white/10 pb-4">
        <div>
          <p className="kicker text-[11px] text-ivory/45">Modo presentador · {presentation.title}</p>
          <p className="mt-1 text-[20px]">
            <span className="tabular-nums text-ivory/50">{String(state.index + 1).padStart(2, '0')}/{slides.length}</span>{' '}
            {slide.title}
            <span className="ml-3 text-[14px] text-wine-soft">· {presentation.chapters[slide.chapter]}</span>
            {slide.steps > 1 && (
              <span className="ml-3 text-[14px] text-ivory/45">
                build {state.step + 1}/{slide.steps}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-right">
            <p className="kicker text-[10px] text-ivory/45">Transcurrido</p>
            <p className="font-serif text-[34px] font-light tabular-nums leading-none">{formatTime(clock.seconds)}</p>
          </div>
          <div className="text-right">
            <p className="kicker text-[10px] text-ivory/45">Recomendado</p>
            <p className="font-serif text-[22px] font-light tabular-nums leading-none text-ivory/80">
              {slide.minutes} min <span className="text-ivory/40">· {plannedUntil}/{totalMinutes}</span>
            </p>
          </div>
          <p className={`kicker text-[11px] ${drift > 0.5 ? 'text-signal-amber' : 'text-ivory/60'}`}>{pace}</p>
          <div className="flex">
            <Btn label={clock.running ? 'Pausar reloj' : 'Iniciar reloj'} onClick={p.toggleClock} active={clock.running}>
              {clock.running ? <Pause size={16} /> : <Play size={16} />}
            </Btn>
            <Btn label="Reiniciar reloj" onClick={p.resetClock}>
              <RotateCcw size={16} />
            </Btn>
          </div>
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* izquierda: actual */}
        <div>
          <p className="kicker mb-2 text-[11px] text-ivory/45">{supportId ? 'Slide de apoyo (en pantalla)' : 'Slide actual'}</p>
          <SlidePreview id={supportId ?? slide.id} step={supportId ? 0 : state.step} theme={supportId ? 'light' : slide.theme} />
          <div className="mt-3 flex items-center gap-2">
            <Btn label="Anterior" onClick={p.prev}>
              <ChevronLeft size={20} />
            </Btn>
            <Btn label="Siguiente" onClick={p.next}>
              <ChevronRight size={20} />
            </Btn>
            <div className="ml-2 flex gap-1.5" aria-label="Builds">
              {Array.from({ length: slide.steps }, (_, i) => (
                <span key={i} className={`h-1.5 w-6 rounded-full ${i <= state.step ? 'bg-wine-soft' : 'bg-white/15'}`} />
              ))}
            </div>
            {supportId && (
              <button type="button" onClick={() => p.openSupport(null)} className="kicker ml-auto flex cursor-pointer items-center gap-2 text-[11px] text-wine-soft">
                <X size={14} /> Volver a la presentación
              </button>
            )}
          </div>
        </div>

        {/* derecha: siguiente + timer + puente */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="kicker mb-2 text-[11px] text-ivory/45">
              {nextInSlide ? 'Siguiente build' : nextSlide ? `Siguiente · ${nextSlide.title}` : 'Fin'}
            </p>
            {nextId ? <SlidePreview id={nextId} step={nextStep} theme={nextTheme} /> : <div className="aspect-video rounded-md bg-white/5" />}
          </div>

          <Panel title={<><Timer size={13} /> Timer del ejercicio</>}>
            {state.timer.key ? (
              <div className="flex items-center gap-6">
                <TimerRing size={120} tone="dark" />
                <div>
                  <p className="text-[18px]">{state.timer.label}</p>
                  <p className="text-[14px] text-ivory/50">{timer.done ? 'Terminado' : timer.running ? 'En curso' : 'En pausa'}</p>
                </div>
              </div>
            ) : slide.timer ? (
              <button
                type="button"
                onClick={() => p.startTimer(slide.id, slide.timer!.label, slide.timer!.seconds)}
                className="cursor-pointer rounded-full bg-wine px-5 py-2.5 text-[14px] uppercase tracking-[0.18em] hover:bg-wine-soft"
              >
                Iniciar {slide.timer.label} · {formatTime(slide.timer.seconds)}
              </button>
            ) : (
              <p className="text-[15px] text-ivory/40">Esta slide no tiene ejercicio.</p>
            )}
          </Panel>

          {notes.bridge && (
            <Panel title={<><MessageSquareQuote size={13} /> Frase puente</>}>
              <p className="font-serif text-[22px] font-light italic leading-snug text-ivory/90">“{notes.bridge}”</p>
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Panel title="Notas del presentador">
          {faqIndex !== null ? (
            <>
              <p className="font-serif text-[22px] italic">“{presentation.faq[faqIndex]}”</p>
              <p className="mt-3 text-[17px] text-ivory/70">{faqNotes}</p>
            </>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-[18px] leading-relaxed text-ivory/85">
              {notes.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          {notes.cta && !supportId && (
            <p className="mt-5 border-t border-white/10 pt-4 text-[16px]">
              <span className="kicker mr-3 text-[11px] text-wine-soft">CTA</span>
              {notes.cta}
            </p>
          )}
        </Panel>

        {notes.vivencia && !supportId ? (
          <Panel title={<span className="text-wine-soft">[ Tu vivencia ]</span>} className="border-wine/40 bg-wine/10">
            <ul className="space-y-1.5 text-[18px] italic text-ivory/90">
              {notes.vivencia.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <ul className="mt-4 grid grid-cols-2 gap-1 text-[15px] text-ivory/60">
              {vivenciaQuestions.map((q) => (
                <li key={q}>· {q}</li>
              ))}
            </ul>
            <p className="kicker mt-4 text-[10px] text-ivory/50">{vivenciaStructure.join(' → ')}</p>
          </Panel>
        ) : (
          <div />
        )}
      </div>

      {/* navegación completa + apoyo */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Panel title="Recorrido">
          <div className="flex flex-wrap gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => p.goto(i)}
                title={s.title}
                className={`cursor-pointer rounded px-2.5 py-1.5 text-[13px] transition-colors ${
                  i === state.index && !supportId ? 'bg-wine text-ivory' : 'bg-white/5 text-ivory/65 hover:bg-white/10'
                }`}
              >
                <span className="tabular-nums text-ivory/40">{String(i + 1).padStart(2, '0')}</span> {s.title}
                {speakerNotes[s.id]?.vivencia && <span className="ml-1 text-wine-soft">●</span>}
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Slides de apoyo · FAQ">
          <div className="flex flex-col gap-1">
            {supportSlides.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => p.openSupport(supportId === s.id ? null : s.id)}
                className={`cursor-pointer rounded px-3 py-2 text-left text-[15px] transition-colors ${
                  supportId === s.id ? 'bg-wine text-ivory' : 'text-ivory/75 hover:bg-white/5'
                }`}
              >
                {presentation.faq[s.index]}
              </button>
            ))}
          </div>
        </Panel>
      </div>
      <p className="mt-5 text-[12px] text-ivory/35">
        ← → / Espacio: navegar · Inicio / Fin · Esc: cerrar interacción o slide de apoyo · F: pantalla completa. La ventana pública se sincroniza automáticamente.
      </p>
    </div>
  )
}
