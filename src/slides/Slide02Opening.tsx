import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../animations/motion'
import { presentation } from '../data/presentation'
import { useSequence, useSlide } from '../hooks/useSlide'

const c = presentation.opening

export default function Slide02Opening() {
  const { step, instant } = useSlide()
  const scene = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        className="absolute inset-0"
        initial={instant ? false : { opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        {step === 0 && <Quote />}
        {step === 1 && <Words />}
      </motion.div>
    </AnimatePresence>
  )
  return <div className="relative h-full w-full">{scene}</div>
}

function Quote() {
  const { instant } = useSlide()
  let w = 0
  return (
    <div className="flex h-full items-center px-[180px]">
      <p className="max-w-[1480px] font-serif text-[76px] font-light leading-[1.14] text-ink" aria-label={c.quote.map((q) => q.t).join('')}>
        <span aria-hidden className="absolute -ml-[64px] -mt-[20px] font-serif text-[160px] leading-none text-wine/15">
          “
        </span>
        {c.quote.flatMap((part, pi) =>
          part.t.split(/(\s+)/).map((tok, ti) => {
            if (/^\s+$/.test(tok) || !tok) return tok
            const i = w++
            return (
              <motion.span
                key={`${pi}-${ti}`}
                aria-hidden
                className={part.em ? 'italic text-wine' : ''}
                initial={instant ? false : { opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: ease.out, delay: 0.3 + i * 0.07 }}
              >
                {tok}
              </motion.span>
            )
          }),
        )}
      </p>
    </div>
  )
}

function Words() {
  const n = useSequence(4, 850, true, 250)
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex items-center gap-10">
        {c.words.map((word, i) => (
          <div key={word} className="flex items-center gap-10">
            <motion.span
              className="font-serif text-[64px] font-light italic"
              initial={false}
              animate={{
                opacity: n > i ? 1 : 0,
                y: n > i ? 0 : 16,
                color: n > i + 1 ? 'var(--color-stone-3)' : 'var(--color-ink)',
              }}
              transition={{ duration: 0.9, ease: ease.emotional }}
            >
              {word}
            </motion.span>
            {i < c.words.length - 1 && (
              <motion.span
                className="block h-px w-24 origin-left bg-stone-2"
                initial={false}
                animate={{ scaleX: n > i + 1 ? 1 : 0 }}
                transition={{ duration: 0.8, ease: ease.inOut }}
              />
            )}
          </div>
        ))}
      </div>
      <motion.div
        className="mt-6 h-24 w-px origin-top bg-stone-2"
        initial={false}
        animate={{ scaleY: n >= 4 ? 1 : 0 }}
        transition={{ duration: 0.7, ease: ease.inOut }}
      />
      <div className="mt-8 overflow-hidden">
        <motion.h2
          className="font-serif text-[200px] font-light leading-none tracking-[0.02em] text-wine"
          initial={false}
          animate={{ y: n >= 4 ? '0%' : '105%' }}
          transition={{ duration: 1.3, ease: ease.emotional, delay: 0.3 }}
        >
          {c.finalWord.toUpperCase()}
        </motion.h2>
      </div>
    </div>
  )
}
