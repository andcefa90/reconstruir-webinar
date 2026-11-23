import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { ease } from '../../animations/motion'
import { presentation } from '../../data/presentation'
import { useSlide } from '../../hooks/useSlide'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

/** Placeholder tipográfico del logo. Sustituir con presentation.logoSrc. */
export function Logo({ size = 'sm', tone = 'ink' }: { size?: 'sm' | 'lg'; tone?: 'ink' | 'ivory' }) {
  const color = tone === 'ink' ? 'text-ink' : 'text-ivory'
  if (presentation.logoSrc)
    return <img src={presentation.logoSrc} alt={presentation.brand} className={size === 'lg' ? 'h-24' : 'h-8'} />
  return (
    <span
      aria-label={`${presentation.brand} (logo)`}
      className={cx(
        'inline-flex items-center gap-3 font-sans font-medium uppercase',
        color,
        size === 'lg' ? 'text-[22px] tracking-[0.42em]' : 'text-[13px] tracking-[0.36em] opacity-70',
      )}
    >
      <span className={cx('inline-block rounded-full bg-wine', size === 'lg' ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5')} />
      {presentation.brand}
    </span>
  )
}

export function Kicker({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { instant } = useSlide()
  return (
    <motion.p
      className={cx('kicker text-stone-3', className)}
      initial={instant ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: ease.out, delay }}
    >
      {children}
    </motion.p>
  )
}

/**
 * Revela texto palabra por palabra, cada una saliendo de una máscara.
 * Lento para momentos emocionales, rápido para UI.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  show = true,
  as = 'span',
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  show?: boolean
  as?: 'span' | 'h1' | 'h2' | 'p'
}) {
  const { instant } = useSlide()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={instant ? false : { y: '110%' }}
            animate={{ y: show ? '0%' : '110%' }}
            transition={{ duration, ease: ease.emotional, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Aparece cuando `show`; respeta instant/reduced. */
export function Appear({
  show = true,
  delay = 0,
  y = 20,
  duration = 0.7,
  className,
  children,
  ...rest
}: { show?: boolean; delay?: number; y?: number; duration?: number } & HTMLMotionProps<'div'>) {
  const { instant } = useSlide()
  return (
    <motion.div
      className={className}
      initial={instant ? false : { opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={instant ? { duration: 0 } : { duration, ease: ease.out, delay: show ? delay : 0 }}
      aria-hidden={!show}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Botón editorial: texto en mayúsculas espaciadas con línea que crece. */
export function TextButton({
  children,
  onClick,
  className,
  tone = 'wine',
  icon,
  ...rest
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  tone?: 'wine' | 'ink' | 'ivory'
  icon?: ReactNode
} & Omit<HTMLMotionProps<'button'>, 'children'>) {
  const color = tone === 'wine' ? 'text-wine' : tone === 'ink' ? 'text-ink' : 'text-ivory'
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cx(
        'group relative inline-flex cursor-pointer items-center gap-3 py-2 text-[15px] font-medium uppercase tracking-[0.22em]',
        color,
        className,
      )}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.25] bg-current transition-transform duration-300 ease-[var(--ease-soft)] group-hover:scale-x-100" />
    </motion.button>
  )
}

/** Botón sólido vinotinto, para acciones principales de ejercicios. */
export function SolidButton({
  children,
  onClick,
  className,
  ...rest
}: { children: ReactNode; onClick?: () => void; className?: string } & Omit<HTMLMotionProps<'button'>, 'children'>) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cx(
        'inline-flex cursor-pointer items-center gap-3 rounded-full bg-wine px-9 py-4 text-[15px] font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-wine-deep disabled:cursor-default disabled:opacity-40',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
