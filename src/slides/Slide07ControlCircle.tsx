import { motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { ExerciseTimer } from '../components/timers/ExerciseTimer'
import { Kicker, RevealText, TextButton } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useEscape, useInteraction } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.control
const CX = 960
const CY = 580
// Elipses: la visualización radial se abre a lo ancho de la pantalla 16:9.
const ring = { in: { rx: 270, ry: 165 }, mid: { rx: 470, ry: 270 }, out: { rx: 700, ry: 385 } }

type Item = { text: string; kind: 'in' | 'out'; k: number }
const items: Item[] = c.outside.flatMap((o, i) => [
  { text: o, kind: 'out' as const, k: i },
  { text: c.inside[i], kind: 'in' as const, k: i },
])

const pos = (r: { rx: number; ry: number }, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: CX + Math.cos(a) * r.rx, y: CY + Math.sin(a) * r.ry }
}

export default function Slide07ControlCircle() {
  const { step } = useSlide()
  const [placed, setPlaced] = useInteraction<string[]>('control', [])
  useEscape(() => setPlaced([]))
  const final = step >= 1
  const all = items.map((i) => i.text)
  const isPlaced = (t: string) => final || placed.includes(t)

  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden>
        <ellipse cx={CX} cy={CY} {...ring.out} fill="none" stroke="var(--color-stone-2)" strokeDasharray="3 9" strokeWidth={1} />
        <ellipse cx={CX} cy={CY} {...ring.in} fill="var(--color-wine)" fillOpacity={0.04} stroke="var(--color-wine)" strokeOpacity={0.3} />
      </svg>

      <div className="absolute left-[140px] top-[130px] z-10">
        <motion.div initial={false} animate={{ opacity: final ? 0 : 1 }}>
          <Kicker>{c.kicker}</Kicker>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 top-[100px] z-10 text-center">
        <RevealText as="h2" text={c.message} show={final} className="font-serif text-[76px] font-light italic text-wine" />
      </div>

      <p className="kicker absolute text-[13px] text-wine" style={{ left: CX, top: CY - ring.in.ry - 34, translate: '-50% 0' }}>
        {c.inLabel}
      </p>
      <p className="kicker absolute text-[13px] text-stone-3" style={{ left: CX - ring.out.rx + 60, top: CY - ring.out.ry + 40 }}>
        {c.outLabel}
      </p>

      {/* centro */}
      <motion.div
        className="absolute grid h-[132px] w-[132px] place-items-center rounded-full bg-wine font-serif text-[44px] font-light text-ivory"
        style={{ left: CX - 66, top: CY - 66 }}
        animate={{ scale: final ? 1.08 : 1 }}
        transition={{ duration: 1, ease: ease.emotional }}
      >
        {c.center}
      </motion.div>

      {items.map((item, idx) => {
        const done = isPlaced(item.text)
        const mixedDeg = -90 + idx * 36 + 18
        const placedDeg = item.kind === 'in' ? -90 + item.k * 72 + 36 : -90 + item.k * 72
        const p = done ? pos(ring[item.kind], placedDeg) : pos(ring.mid, mixedDeg)
        const out = item.kind === 'out'
        return (
          <motion.button
            key={item.text}
            type="button"
            onClick={() => setPlaced(done ? placed.filter((t) => t !== item.text) : [...placed, item.text])}
            aria-pressed={done}
            aria-label={`${item.text}: ${out ? 'no lo controlo' : 'sí lo controlo'}`}
            className="absolute cursor-pointer whitespace-nowrap px-3 py-2 text-center"
            style={{ translate: '-50% -50%' }}
            initial={false}
            animate={{
              left: p.x,
              top: p.y,
              opacity: done && out ? (final ? 0.28 : 0.45) : 1,
              scale: done ? (out ? 0.9 : 1.04) : 1,
            }}
            whileHover={{ scale: done ? (out ? 0.94 : 1.08) : 1.06 }}
            transition={{ duration: 0.9, ease: ease.emotional }}
          >
            <span
              className={`flex items-center gap-3 text-[27px] ${
                done ? (out ? 'font-light text-stone-3' : 'font-normal text-ink') : 'font-light text-stone-4'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${done ? (out ? 'bg-stone-2' : 'bg-wine') : 'bg-stone-3'}`} />
              {item.text}
            </span>
          </motion.button>
        )
      })}

      <motion.div
        className="absolute bottom-[110px] left-[140px] flex items-end gap-8"
        initial={false}
        animate={{ opacity: final ? 0 : 1 }}
      >
        <ExerciseTimer size={130} />
      </motion.div>
      <motion.div className="absolute bottom-[110px] right-[140px] flex gap-8" initial={false} animate={{ opacity: final ? 0 : 1 }}>
        <TextButton onClick={() => setPlaced(all)}>Ordenar todo</TextButton>
        <TextButton tone="ink" className="opacity-50 hover:opacity-100" onClick={() => setPlaced([])}>
          Reiniciar
        </TextButton>
      </motion.div>
    </div>
  )
}
