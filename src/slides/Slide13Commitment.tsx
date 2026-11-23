import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ease } from '../animations/motion'
import { WHEEL_DEFAULT, wheelExtremes } from '../components/interactions/LifeWheel'
import { ExerciseTimer } from '../components/timers/ExerciseTimer'
import { Kicker, SolidButton, TextButton } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useInteraction, usePresentation } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.commitment
const TICKS = 24

export default function Slide13Commitment() {
  const { preview } = useSlide()
  const { sound } = usePresentation()
  const [wheel] = useInteraction<number[]>('wheel', WHEEL_DEFAULT)
  const { low } = wheelExtremes(wheel)
  const suggested = low !== null ? presentation.wheel.areas[low] : ''
  const [fields, setFields] = useInteraction<string[] | null>('commitment:fields', null)
  const [done, setDone] = useInteraction('commitment:done', false)
  const values = fields ?? [suggested, '', '']

  return (
    <div className="grid h-full grid-cols-[1fr_620px] gap-[100px] px-[140px] pt-[140px]">
      <div>
        <Kicker>Compromiso de 24 horas</Kicker>
        <h2 className="mt-6 font-serif text-[84px] font-light uppercase leading-none tracking-[0.02em] text-ink">{c.title}</h2>
        <div className="mt-16 space-y-12">
          {c.fields.map((label, i) => (
            <label key={label} className="block">
              <span className="block text-[22px] text-stone-4">{label}</span>
              <input
                value={values[i]}
                readOnly={preview || done}
                onChange={(e) => setFields(values.map((v, j) => (j === i ? e.target.value : v)))}
                className="field-line mt-3 w-full pb-2 font-serif text-[40px] font-light text-ink"
                aria-label={label}
              />
            </label>
          ))}
        </div>
        <div className="mt-14 flex items-center gap-10">
          {!done ? (
            <SolidButton
              onClick={() => {
                setDone(true)
                sound('complete')
              }}
            >
              {c.button}
            </SolidButton>
          ) : (
            <TextButton tone="ink" className="opacity-50 hover:opacity-100" onClick={() => setDone(false)}>
              Editar
            </TextButton>
          )}
          <ExerciseTimer size={110} />
        </div>
      </div>

      {/* 24 horas: un reloj simbólico */}
      <div className="flex flex-col items-center pt-[40px]">
        <div className="relative h-[520px] w-[520px]">
          <svg width={520} height={520} viewBox="0 0 520 520" aria-hidden>
            {Array.from({ length: TICKS }, (_, i) => {
              const a = ((i / TICKS) * 360 - 90) * (Math.PI / 180)
              const r1 = 220
              const r2 = i % 6 === 0 ? 250 : 240
              return (
                <motion.line
                  key={i}
                  x1={260 + Math.cos(a) * r1}
                  y1={260 + Math.sin(a) * r1}
                  x2={260 + Math.cos(a) * r2}
                  y2={260 + Math.sin(a) * r2}
                  strokeWidth={i % 6 === 0 ? 2 : 1.25}
                  strokeLinecap="round"
                  initial={false}
                  animate={{ stroke: done ? '#6e1f2f' : '#bdb2a5' }}
                  transition={{ duration: 0.25, delay: done ? i * 0.04 : 0 }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="ok"
                  className="grid h-[150px] w-[150px] place-items-center rounded-full bg-wine text-ivory"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.7 }}
                >
                  <Check size={64} strokeWidth={1.25} />
                </motion.div>
              ) : (
                <motion.div key="24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <p className="font-serif text-[150px] font-light leading-none text-ink">24</p>
                  <p className="kicker mt-2 text-stone-3">{c.counter}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-6 h-[100px]">
          <AnimatePresence>
            {done && (
              <motion.p
                className="text-center font-serif text-[36px] font-light italic leading-snug text-wine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: 1.4, ease: ease.out }}
              >
                {c.done}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
