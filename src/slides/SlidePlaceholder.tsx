import { slides } from '../data/slides'
import { useSlide } from '../hooks/useSlide'

export default function SlidePlaceholder() {
  const { id } = useSlide()
  const meta = slides.find((s) => s.id === id)
  return (
    <div className="flex h-full items-center justify-center">
      <p className="font-serif text-[72px] font-light text-stone-2">{meta?.title}</p>
    </div>
  )
}
