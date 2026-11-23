import { presentation } from '../data/presentation'
import { useSlide } from '../hooks/useSlide'
import { Kicker, RevealText } from '../components/ui/primitives'

/** Slide de apoyo: solo la pregunta. La respuesta la desarrolla quien presenta. */
export default function SupportFAQ() {
  const { id } = useSlide()
  const i = Number(id.replace('faq-', ''))
  return (
    <div className="flex h-full flex-col justify-center px-[180px]">
      <Kicker>Pregunta frecuente · {String(i + 1).padStart(2, '0')}</Kicker>
      <RevealText
        as="h2"
        text={`“${presentation.faq[i]}”`}
        className="mt-10 max-w-[1400px] font-serif text-[104px] font-light leading-[1.05] text-ink"
        stagger={0.06}
      />
    </div>
  )
}
