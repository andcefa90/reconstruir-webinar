import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { LifeWheel, WHEEL_DEFAULT, wheelExtremes } from '../components/interactions/LifeWheel'
import { ExerciseTimer } from '../components/timers/ExerciseTimer'
import { Kicker, TextButton } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useInteraction } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.wheel

export default function Slide06LifeWheel() {
  const { step, preview } = useSlide()
  const [values, setValues] = useInteraction<number[]>('wheel', WHEEL_DEFAULT)
  const { low, high } = wheelExtremes(values)
  const reflect = step >= 1
  const total = values.reduce((a, b) => a + b, 0)

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute top-[110px]"
        initial={false}
        animate={{ left: reflect ? 100 : 160 }}
        transition={{ duration: 0.9, ease: ease.emotional }}
      >
        <LifeWheel areas={c.areas} values={values} onChange={setValues} interactive={!preview} />
      </motion.div>

      <div className="absolute left-[1120px] right-[140px] top-[150px]">
        <AnimatePresence mode="wait" initial={false}>
          {!reflect ? (
            <motion.div key="score" exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
              <Kicker>{c.kicker}</Kicker>
              <h2 className="mt-5 font-serif text-[64px] font-light leading-none text-ink">{c.title}</h2>
              <ul className="mt-10 space-y-1">
                {c.areas.map((a, i) => (
                  <li key={a} className="grid grid-cols-[250px_1fr_36px] items-center gap-5">
                    <label htmlFor={`area-${i}`} className={`text-[21px] ${i === low ? 'text-wine' : 'text-stone-4'}`}>
                      {a}
                    </label>
                    <input
                      id={`area-${i}`}
                      type="range"
                      min={1}
                      max={10}
                      value={values[i]}
                      onChange={(e) => setValues(values.map((v, j) => (j === i ? Number(e.target.value) : v)))}
                      className="range w-full"
                      aria-valuetext={`${a}: ${values[i]} de 10`}
                    />
                    <span className="text-right font-serif text-[22px] tabular-nums text-ink">{values[i]}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center justify-between">
                <ExerciseTimer size={150} />
                <TextButton tone="ink" className="opacity-50 hover:opacity-100" onClick={() => setValues(WHEEL_DEFAULT)}>
                  Reiniciar
                </TextButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reflect"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: ease.out }}
              className="-ml-[120px]"
            >
              <h2 className="font-serif text-[60px] font-light leading-[1.1] text-ink">{c.question}</h2>
              <div className="mt-14 grid grid-cols-2 gap-14 border-t border-stone-1 pt-10">
                <Extreme label={c.lowLabel} area={low !== null ? c.areas[low] : '—'} value={low !== null ? values[low] : null} accent />
                <Extreme label={c.highLabel} area={high !== null ? c.areas[high] : '—'} value={high !== null ? values[high] : null} />
              </div>
              <motion.p
                className="mt-16 font-serif text-[40px] font-light italic leading-snug text-wine"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8, ease: ease.out }}
              >
                {c.bridge}
              </motion.p>
              <p className="kicker mt-12 text-stone-3">Total · {total} / 80</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Extreme({ label, area, value, accent }: { label: string; area: string; value: number | null; accent?: boolean }) {
  return (
    <div>
      <p className="kicker text-stone-3">{label}</p>
      <p className={`mt-4 font-serif text-[44px] font-light leading-tight ${accent ? 'text-wine' : 'text-ink'}`}>{area}</p>
      {value !== null && <p className="mt-2 font-serif text-[28px] text-stone-3">{value} / 10</p>}
    </div>
  )
}
