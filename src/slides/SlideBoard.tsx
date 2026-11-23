import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, HeartPulse, Scale, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { ease } from '../animations/motion'
import { Kicker } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useInteraction } from '../hooks/usePresentation'

const c = presentation.board
const icons = { calendar: CalendarDays, money: Wallet, health: HeartPulse, rules: Scale }
// Todo son ejemplos: sin datos reales.
const P = '[ definir ]'

export default function SlideBoard() {
  const [active, setActive] = useInteraction('board', 'calendar')
  const section = c.sections.find((s) => s.id === active)!

  return (
    <div className="grid h-full grid-cols-[440px_1fr] gap-[100px] px-[140px] pt-[140px]">
      <div>
        <Kicker>{c.kicker}</Kicker>
        <div className="mt-14 flex flex-col" role="tablist" aria-orientation="vertical">
          {c.sections.map((s) => {
            const Icon = icons[s.id as keyof typeof icons]
            const on = s.id === active
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(s.id)}
                className="group relative flex cursor-pointer items-center gap-6 border-t border-stone-1 py-7 text-left last:border-b"
              >
                {on && <motion.span layoutId="board-mark" className="absolute -left-6 top-1/2 h-10 w-[3px] -translate-y-1/2 bg-wine" transition={{ duration: 0.35, ease: ease.out }} />}
                <Icon size={26} strokeWidth={1.25} className={on ? 'text-wine' : 'text-stone-3'} />
                <span className={`text-[34px] font-light transition-colors ${on ? 'text-ink' : 'text-stone-3 group-hover:text-ink'}`}>{s.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative pt-[70px]" role="tabpanel" aria-label={section.name}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: ease.out }}
          >
            <h2 className="font-serif text-[64px] font-light text-ink">{section.name}</h2>
            <div className="mt-10">{panels[active as keyof typeof panels]}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Row({ label, a, b }: { label: string; a?: ReactNode; b?: ReactNode }) {
  return (
    <div className="grid grid-cols-[300px_1fr_1fr] items-baseline border-b border-stone-1 py-5 text-[24px]">
      <span className="text-ink">{label}</span>
      <span className="font-serif italic text-stone-3">{a ?? P}</span>
      <span className="font-serif italic text-stone-3">{b ?? P}</span>
    </div>
  )
}

function Head({ cols }: { cols: string[] }) {
  return (
    <div className="kicker grid grid-cols-[300px_1fr_1fr] pb-3 text-[12px] text-stone-3">
      {cols.map((x) => (
        <span key={x}>{x}</span>
      ))}
    </div>
  )
}

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const panels = {
  calendar: (
    <div>
      <div className="grid w-fit grid-cols-7 gap-2">
        {days.map((d) => (
          <span key={d} className="kicker w-[86px] pb-2 text-center text-[12px] text-stone-3">
            {d}
          </span>
        ))}
        {Array.from({ length: 14 }, (_, i) => {
          // patrón ilustrativo, no una recomendación
          const a = Math.floor(i / 7) === 0 ? i % 7 < 3 || i % 7 > 4 : i % 7 >= 3 && i % 7 <= 4
          return (
            <motion.span
              key={i}
              className={`grid h-[64px] w-[86px] place-items-center text-[18px] ${a ? 'bg-wine/15 text-wine' : 'bg-stone-1 text-stone-4'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              {a ? 'A' : 'B'}
            </motion.span>
          )
        })}
      </div>
      <p className="mt-4 text-[16px] text-stone-3">Patrón de ejemplo · Hogar A / Hogar B</p>
      <div className="mt-8">
        <Head cols={['', 'Hogar A', 'Hogar B']} />
        <Row label="Festivos" />
        <Row label="Vacaciones" />
      </div>
    </div>
  ),
  money: (
    <div>
      <Head cols={['Gasto', 'Quién paga', 'Cómo se reporta']} />
      <Row label="[ gasto 1 ]" />
      <Row label="[ gasto 2 ]" />
      <Row label="[ gasto 3 ]" />
    </div>
  ),
  health: (
    <div>
      <Head cols={['', 'Responsable', 'Cómo se informa']} />
      <Row label="Citas" />
      <Row label="Reuniones" />
      <Row label="Información" />
    </div>
  ),
  rules: (
    <div>
      <Head cols={['', 'Hogar A', 'Hogar B']} />
      <Row label="Sueño" />
      <Row label="Pantallas" />
      <Row label="Comida" />
    </div>
  ),
}
