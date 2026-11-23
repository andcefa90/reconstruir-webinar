import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { ease } from '../animations/motion'
import { ExerciseTimer } from '../components/timers/ExerciseTimer'
import { Kicker, SolidButton, TextButton } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useEscape, usePresentation } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'
import { localBiff, type BiffResult, type BiffTransformer } from '../utils/biff'

const c = presentation.biff
// Punto de integración: sustituir por un transformador basado en LLM.
const transformer: BiffTransformer = localBiff

export default function SlideBIFFTool() {
  const { preview } = useSlide()
  const { sound } = usePresentation()
  const [input, setInput] = useState('')
  const [result, setResult] = useState<BiffResult | null>(null)
  const [phase, setPhase] = useState(0) // letras BIFF iluminadas
  useEscape(() => {
    setResult(null)
    setPhase(0)
  })

  const run = async () => {
    if (!input.trim()) return
    setResult(null)
    setPhase(0)
    const r = await transformer.transform(input)
    for (let i = 1; i <= 4; i++) setTimeout(() => setPhase(i), i * 380)
    setTimeout(() => {
      setResult(r)
      sound('complete')
    }, 4 * 380 + 250)
  }

  return (
    <div className="grid h-full grid-cols-[1fr_1fr] gap-[100px] px-[140px] pt-[140px]">
      <div className="flex flex-col">
        <Kicker>BIFF · en vivo</Kicker>
        <p className="kicker mt-14 text-[12px] text-stone-3">Mensaje original</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={c.toolPlaceholder}
          rows={4}
          readOnly={preview}
          className="field-line mt-4 w-full resize-none font-sans text-[34px] font-light leading-snug text-ink"
          aria-label="Mensaje original"
        />
        <div className="mt-8 flex items-center gap-8">
          <SolidButton onClick={run} disabled={!input.trim()}>
            {c.toolButton}
          </SolidButton>
          <TextButton tone="ink" className="opacity-50 hover:opacity-100" onClick={() => setInput(c.before)}>
            Usar ejemplo
          </TextButton>
        </div>
        <div className="mt-auto pb-[150px]">
          <ExerciseTimer size={120} />
          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-stone-3">{c.disclaimer}</p>
        </div>
      </div>

      <div className="flex flex-col pt-[64px]">
        <div className="flex items-center gap-6">
          {c.letters.map((l, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              animate={{ opacity: phase > i ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="font-serif text-[88px] font-light leading-none text-wine"
                animate={{ scale: phase === i + 1 ? 1.15 : 1 }}
                transition={{ duration: 0.3, ease: ease.out }}
              >
                {l.l}
              </motion.span>
            </motion.div>
          ))}
          <ArrowDown className="ml-4 text-stone-2" size={28} strokeWidth={1} />
        </div>

        <div className="mt-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="r" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
                <p className="kicker text-[12px] text-wine">Mensaje reescrito</p>
                <p className="mt-4 rounded-[28px] rounded-tl-md border border-wine/25 bg-paper px-9 py-7 text-[32px] leading-snug text-ink">
                  {result.rewritten}
                </p>
                <ul className="mt-8 space-y-3">
                  {result.changes.map((ch, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-5 text-[19px] text-stone-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="w-5 font-serif text-[22px] text-wine">{ch.letter === 'A' ? 'F' : ch.letter}</span>
                      {ch.note}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.p key="e" className="font-serif text-[30px] italic text-stone-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                El mensaje reescrito aparecerá aquí.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
