import { motion } from 'framer-motion'
import { useState } from 'react'
import { ease } from '../animations/motion'
import { RevealText } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useEscape } from '../hooks/usePresentation'
import { useSlide } from '../hooks/useSlide'

const c = presentation.tools

/** Índice editorial: números grandes, nombres, una línea fina. Nada de cards. */
export default function Slide03Tools() {
  const { step, instant } = useSlide()
  const [open, setOpen] = useState<number | null>(null)
  useEscape(() => setOpen(null))
  const listed = step >= 1

  return (
    <div className="grid h-full grid-cols-[640px_1fr] gap-[120px] px-[140px] pt-[200px]">
      <div>
        <RevealText as="h2" text={c.title} className="font-serif text-[88px] font-light leading-[1.04] text-ink" stagger={0.06} />
        <RevealText
          as="p"
          text={c.subtitle}
          className="mt-8 font-serif text-[88px] font-light italic leading-[1.05] text-wine"
          delay={0.6}
          stagger={0.08}
        />
      </div>

      <ol className="mt-2">
        {c.items.map((item, i) => {
          const isOpen = open === i
          const dim = open !== null && !isOpen
          return (
            <motion.li
              key={item.name}
              className="border-t border-stone-1 last:border-b"
              initial={instant ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: listed ? (dim ? 0.35 : 1) : 0, x: listed ? 0 : 40 }}
              transition={{ duration: 0.8, ease: ease.out, delay: listed && !instant && open === null ? 0.15 * i : 0 }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
                className="group flex w-full cursor-pointer items-baseline gap-10 py-7 text-left"
                tabIndex={listed ? 0 : -1}
              >
                <span className="w-16 font-serif text-[28px] font-light tabular-nums text-stone-2 transition-colors group-hover:text-wine">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <motion.span
                    className="block origin-left font-sans text-[52px] font-light tracking-[-0.01em] text-ink"
                    animate={{ scale: isOpen ? 1.04 : 1, x: isOpen ? 8 : 0 }}
                    transition={{ duration: 0.3, ease: ease.out }}
                  >
                    {item.name}
                  </motion.span>
                  <motion.span
                    className="block overflow-hidden font-serif text-[26px] italic text-stone-4"
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: ease.out }}
                  >
                    <span className="block pb-1 pl-2 pt-3">{item.hint}</span>
                  </motion.span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
