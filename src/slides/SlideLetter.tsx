import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ease } from '../animations/motion'
import { ExerciseTimer } from '../components/timers/ExerciseTimer'
import { TextButton } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.letter
const KEY = 'reconstruir:carta'

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const v = raw ? JSON.parse(raw) : null
    if (Array.isArray(v) && v.length === c.prompts.length) return v.map(String)
  } catch {
    /* sin storage */
  }
  return c.prompts.map(() => '')
}

/** Carta de despedida. Todo es local: nada se envía. */
export default function SlideLetter() {
  const { instant, preview } = useSlide()
  const [text, setText] = useState<string[]>(load)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2400)
    return () => clearTimeout(t)
  }, [saved])

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(text))
      setSaved(true)
    } catch {
      /* sin storage */
    }
  }
  const clear = () => {
    setText(c.prompts.map(() => ''))
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* sin storage */
    }
  }

  return (
    <div className="flex h-full items-start justify-center gap-[90px] pt-[110px]">
      <motion.div
        className="relative w-[1060px] bg-paper px-[96px] pb-[60px] pt-[72px] shadow-[0_40px_90px_-50px_rgba(29,26,24,0.35)]"
        initial={instant ? false : { opacity: 0, y: 40, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.2, ease: ease.emotional }}
      >
        <h2 className="font-serif text-[52px] font-light italic leading-tight text-wine">{c.title}</h2>
        <div className="mt-10 space-y-7">
          {c.prompts.map((prompt, i) => (
            <motion.label
              key={prompt}
              className="block"
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
            >
              <span className="block font-serif text-[24px] text-stone-4">{prompt}</span>
              <textarea
                rows={2}
                value={text[i]}
                readOnly={preview}
                onChange={(e) => setText(text.map((t, j) => (j === i ? e.target.value : t)))}
                className="field-line mt-1 w-full resize-none font-serif text-[26px] italic leading-[1.5] text-ink"
                aria-label={prompt}
              />
            </motion.label>
          ))}
        </div>
      </motion.div>

      <div className="flex w-[330px] flex-col gap-10 pt-6">
        <ExerciseTimer size={160} />
        <div className="flex flex-col items-start gap-2">
          <TextButton onClick={save}>{c.save}</TextButton>
          <TextButton tone="ink" className="opacity-50 hover:opacity-100" onClick={clear}>
            {c.clear}
          </TextButton>
          <div className="h-8">
            <AnimatePresence>
              {saved && (
                <motion.p className="kicker text-[12px] text-wine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {c.saved}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="font-serif text-[22px] italic leading-snug text-stone-3">{c.privacy}</p>
      </div>
    </div>
  )
}
