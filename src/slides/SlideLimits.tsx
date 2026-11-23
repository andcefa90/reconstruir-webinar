import { Appear, Kicker } from '../components/ui/primitives'
import { presentation } from '../data/presentation'

const c = presentation.limits

/** Sobria, sin alarmismo. */
export default function SlideLimits() {
  return (
    <div className="flex h-full flex-col justify-center px-[180px] pb-[60px]">
      <Kicker>{c.kicker}</Kicker>
      <Appear delay={0.2}>
        <p className="mt-10 max-w-[1400px] font-serif text-[58px] font-light leading-[1.2] text-ink">{c.main}</p>
      </Appear>
      <Appear delay={0.6} className="mt-16 grid max-w-[1400px] grid-cols-2 gap-20 border-t border-stone-1 pt-10">
        <p className="text-[26px] leading-relaxed text-stone-4">{c.tools}</p>
        <p className="text-[26px] leading-relaxed text-stone-4">{c.safety}</p>
      </Appear>
    </div>
  )
}
