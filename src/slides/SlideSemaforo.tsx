import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { Appear, Kicker, RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useEscape, useInteraction } from '../hooks/usePresentation'

const c = presentation.semaforo

export default function SlideSemaforo() {
  const [chosen, setChosen] = useInteraction<string | null>('semaforo', null)
  useEscape(() => setChosen(null))
  const state = c.states.find((s) => s.id === chosen)

  return (
    <div className="relative h-full w-full">
      {/* el fondo se tiñe muy levemente con el color elegido */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: state
            ? `radial-gradient(1100px 700px at 50% 52%, ${state.tint}22, transparent 70%)`
            : 'radial-gradient(1100px 700px at 50% 52%, #00000000, transparent 70%)',
        }}
        transition={{ duration: 0.9, ease: ease.out }}
      />

      <div className="relative flex h-full flex-col items-center pt-[150px]">
        <Kicker>{c.kicker}</Kicker>
        <RevealText as="h2" text={c.question} className="mt-6 font-serif text-[80px] font-light text-ink" delay={0.2} />

        <div className="mt-[70px] flex h-[340px] items-center gap-[110px]" role="radiogroup" aria-label={c.question}>
          {c.states.map((s, i) => {
            const selected = chosen === s.id
            const other = chosen !== null && !selected
            return (
              <motion.button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={s.label}
                onClick={() => setChosen(selected ? null : s.id)}
                className="group flex cursor-pointer flex-col items-center gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: other ? 0.35 : 1, y: 0 }}
                transition={{ duration: 0.7, ease: ease.out, delay: chosen === null ? 0.4 + i * 0.12 : 0 }}
              >
                <motion.span
                  className="block rounded-full"
                  style={{ width: 210, height: 210, backgroundColor: s.color }}
                  animate={{
                    scale: selected ? 1.3 : other ? 0.78 : 1,
                    boxShadow: selected ? `0 0 0 18px ${s.tint}22, 0 30px 80px -30px ${s.tint}` : `0 0 0 0px ${s.tint}00, 0 0 0 0 #0000`,
                  }}
                  whileHover={{ scale: selected ? 1.32 : other ? 0.82 : 1.05 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                />
                <motion.span
                  className="kicker text-[16px]"
                  animate={{ color: selected ? 'var(--color-ink)' : 'var(--color-stone-3)', y: selected ? 34 : 0 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  {s.label}
                </motion.span>
              </motion.button>
            )
          })}
        </div>

        <div className="relative mt-[70px] h-[90px] w-full text-center">
          <AnimatePresence mode="wait">
            {state ? (
              <motion.p
                key={state.id}
                className="absolute inset-x-0 font-serif text-[44px] font-light italic text-ink"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: ease.out }}
              >
                {state.validation}
              </motion.p>
            ) : (
              <motion.p key="none" className="absolute inset-x-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            )}
          </AnimatePresence>
        </div>
        <Appear delay={1} className="kicker text-stone-3">
          {c.always}
        </Appear>
      </div>
    </div>
  )
}
