import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ease } from '../animations/motion'
import { Logo } from '../components/ui/primitives'
import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'

/** Dos caminos para seguir. */
export default function SlideCTA() {
  const { instant } = useSlide()
  return (
    <div className="flex h-full flex-col px-[140px] pt-[110px]">
      <Logo />
      <div className="mt-auto mb-[200px] grid grid-cols-2 gap-[120px]">
        {presentation.cta.map((item, i) => (
          <motion.div
            key={item.n}
            className="group border-t border-ink/80 pt-10"
            initial={instant ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.emotional, delay: instant ? 0 : 0.3 + i * 0.25 }}
          >
            <span className="font-serif text-[36px] font-light text-wine">{item.n}</span>
            <p className="mt-10 flex items-start justify-between gap-8 font-serif text-[88px] font-light uppercase leading-[1.02] text-ink">
              {item.label}
              <ArrowUpRight size={64} strokeWidth={1} className="mt-4 shrink-0 text-wine transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
