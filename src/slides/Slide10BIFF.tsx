import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ease } from '../animations/motion'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.biff

/** Texto que se escribe carácter a carácter, como un mensaje entrante. */
function Typed({ text, start, speed = 28 }: { text: string; start: boolean; speed?: number }) {
  const { instant } = useSlide()
  const [n, setN] = useState(instant ? text.length : 0)
  useEffect(() => {
    if (instant) return setN(text.length)
    if (!start) return setN(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [start, text, speed, instant])
  return (
    <span aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {n < text.length && start && <span aria-hidden className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse bg-current" />}
    </span>
  )
}

function Chat({ label, text, tone, start }: { label: string; text: string; tone: 'before' | 'after'; start: boolean }) {
  const before = tone === 'before'
  return (
    <div className={`flex h-full flex-col justify-center px-[110px] ${before ? 'bg-cream' : 'bg-ivory'}`}>
      <p className={`kicker ${before ? 'text-signal-red' : 'text-wine'}`}>{label}</p>
      <div className="mt-12 flex items-center gap-3 text-[15px] text-stone-3">
        <span className="h-2 w-2 rounded-full bg-stone-2" /> Mensaje · 18:42
      </div>
      <motion.div
        className={`mt-4 max-w-[680px] rounded-[28px] rounded-tl-md px-10 py-8 font-sans text-[38px] leading-snug ${
          before ? 'bg-paper text-ink shadow-[inset_3px_0_0_var(--color-signal-red)]' : 'border border-wine/25 bg-paper text-ink'
        }`}
        initial={false}
        animate={{ opacity: start ? 1 : 0.0, y: start ? 0 : 20 }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <Typed text={text} start={start} speed={before ? 26 : 32} />
      </motion.div>
    </div>
  )
}

export default function Slide10BIFF() {
  const { step, instant } = useSlide()
  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait" initial={false}>
        {step < 2 ? (
          <motion.div key="split" className="grid h-full grid-cols-2" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Chat label={c.beforeLabel} text={c.before} tone="before" start />
            <motion.div
              className="h-full"
              initial={false}
              animate={{ opacity: step >= 1 ? 1 : 0.35 }}
              transition={{ duration: 0.6 }}
            >
              <Chat label={c.afterLabel} text={c.after} tone="after" start={step >= 1} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letters"
            className="flex h-full items-center justify-center gap-[90px] pb-[60px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {c.letters.map((l, i) => (
              <div key={i} className="flex w-[300px] flex-col items-center">
                <div className="overflow-hidden">
                  <motion.span
                    className="block font-serif text-[280px] font-light leading-[0.9] text-wine"
                    initial={instant ? false : { y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1, ease: ease.emotional, delay: instant ? 0 : i * 0.35 }}
                  >
                    {l.l}
                  </motion.span>
                </div>
                <motion.span
                  className="mt-8 block h-px w-24 origin-left bg-wine/50"
                  initial={instant ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: ease.inOut, delay: instant ? 0 : 0.5 + i * 0.35 }}
                />
                <motion.span
                  className="kicker mt-8 text-center text-[17px] text-ink"
                  initial={instant ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: instant ? 0 : 0.7 + i * 0.35 }}
                >
                  {l.word}
                </motion.span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
