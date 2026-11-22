import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Nilavilakku } from '../decor/Kerala'
import { MediaImg } from './MediaImg'

/**
 * Scroll animation primitives. Everything triggers once when it enters the viewport
 * (viewport.once) so nothing replays while scrolling back and forth. Only transform,
 * opacity and clip-path are animated — cheap on mobile GPUs.
 */
export const EASE = [0.22, 0.8, 0.24, 1] as const
const VIEW = { once: true, amount: 0.2 } as const

export function useIsSmall() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 640px)'); const on = () => setSmall(m.matches)
    m.addEventListener('change', on); return () => m.removeEventListener('change', on)
  }, [])
  return small
}

type Dir = 'up' | 'down' | 'none'
const offset = (dir: Dir, d: number) => (dir === 'up' ? d : dir === 'down' ? -d : 0)

/** Fade + slide. `stagger` sequences direct <RevealItem> children. */
export function Reveal({ children, className, delay = 0, dir = 'up', distance = 34, scale, as = 'div', stagger, amount = 0.2 }: {
  children: ReactNode; className?: string; delay?: number; dir?: Dir; distance?: number; scale?: number; as?: 'div' | 'section' | 'li' | 'ul' | 'p'; stagger?: number; amount?: number
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: offset(dir, distance), ...(scale ? { scale } : {}) },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0.4 : 1.1, ease: EASE, delay, ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}) } },
  }
  return <M className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ ...VIEW, amount }}>{children}</M>
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
}
export function RevealItem({ children, className, dir = 'up' }: { children: ReactNode; className?: string; dir?: Dir }) {
  const v: Variants = dir === 'up' ? itemVariants : { hidden: { opacity: 0, y: offset(dir, 26) }, show: itemVariants.show }
  return <motion.div className={className} variants={v}>{children}</motion.div>
}

/**
 * Masked word-by-word heading reveal. Wrap words in *asterisks* to set them in gold italic.
 * Renders real text (screen readers get the full sentence via aria-label).
 */
export function TextReveal({ text, as = 'h2', className, delay = 0, stagger = 0.07, immediate, play = true }: {
  text: string; as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'; className?: string; delay?: number; stagger?: number; immediate?: boolean; play?: boolean
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.h2
  const words = text.split(/(\s+)/).filter((w) => w.trim())
  let on = false
  const flags = words.map((w) => { if (w.startsWith('*')) on = true; const f = on; if (/\*[.,!?]*$/.test(w)) on = false; return f })
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } } }
  const word: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: '108%', rotate: 2 },
    show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: reduce ? 0.4 : 1.15, ease: EASE } },
  }
  const trigger = immediate ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: VIEW }
  return (
    <M className={className} aria-label={text.replace(/\*/g, '')} variants={container} initial="hidden" {...trigger}>
      {words.map((w, i) => {
        const accent = flags[i]
        const clean = w.replace(/\*/g, '')
        return (
          <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '.08em', marginBottom: '-.08em' }}>
            <motion.span variants={word} style={{ display: 'inline-block', transformOrigin: '0 100%' }} className={accent ? 'serif-italic' : undefined}>
              {clean}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        )
      })}
    </M>
  )
}

/**
 * Clip-path curtain reveal with a gentle inner zoom-out. The viewport trigger lives on an
 * unclipped outer wrapper: a fully clipped element can report no intersection in some browsers.
 */
export function ImageReveal({ children, className = '', from = 'bottom', delay = 0 }: { children: ReactNode; className?: string; from?: 'bottom' | 'top' | 'left' | 'right'; delay?: number }) {
  const reduce = useReducedMotion()
  const start = { bottom: 'inset(100% 0% 0% 0%)', top: 'inset(0% 0% 100% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' }[from]
  const clip: Variants = {
    hidden: reduce ? { opacity: 0 } : { clipPath: start },
    show: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, transition: { duration: reduce ? 0.4 : 1.35, ease: [0.77, 0, 0.18, 1], delay } },
  }
  const inner: Variants = { hidden: reduce ? {} : { scale: 1.22 }, show: { scale: 1, transition: { duration: 1.9, ease: EASE, delay } } }
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={`reveal-img ${className}`} style={{ background: 'transparent' }}>
      <motion.div className="h-full w-full overflow-hidden rounded-[inherit] bg-bg3" variants={clip}>
        <motion.div className="h-full w-full" variants={inner}>{children}</motion.div>
      </motion.div>
    </motion.div>
  )
}

/** Subtle scroll-linked drift. Distance is halved on phones and disabled for reduced motion. */
export function Parallax({ children, className, distance = 60 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const small = useIsSmall()
  const d = reduce ? 0 : small ? distance * 0.45 : distance
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [d, -d])
  return <motion.div ref={ref} className={className} style={{ y }}>{children}</motion.div>
}

/** Hairline + diamond that draws itself at the top edge of a section. */
export function Seam() {
  return <motion.div className="seam" aria-hidden="true" initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={VIEW} transition={{ duration: 1.6, ease: EASE }} />
}

/** Temple-style divider: gold hairlines either side of a small lit nilavilakku. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <motion.div className={`ornament ${className}`} aria-hidden="true" initial={{ opacity: 0, scaleX: 0.3 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={VIEW} transition={{ duration: 1.2, ease: EASE }}>
      <span /><Nilavilakku /><span />
    </motion.div>
  )
}

/**
 * Full-bleed section photograph under a tone-coloured veil. Fades/zooms in once, then drifts
 * slowly with scroll (parallax halved on phones, off for reduced motion).
 */
export function Backdrop({ src, sepia, distance = 70, opacity = 1 }: { src?: string; sepia?: boolean; distance?: number; opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const small = useIsSmall()
  const d = reduce ? 0 : small ? distance * 0.5 : distance
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-d, d])
  if (!src) return null
  return (
    <>
      <div ref={ref} className={`backdrop ${sepia ? 'sepia' : ''}`} aria-hidden="true">
        <motion.div style={{ y }} initial={{ opacity: 0, scale: 1.12 }} whileInView={{ opacity, scale: 1 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 2.2, ease: EASE }}>
          <MediaImg src={src} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </div>
      <div className="veil" aria-hidden="true" />
    </>
  )
}

export function SectionHeading({ eyebrow, title, lede, className = '' }: { eyebrow?: string; title?: string; lede?: string; className?: string }) {
  return (
    <div className={`section-head ${className}`}>
      {eyebrow && <Reveal distance={14}><div className="eyebrow">{eyebrow}</div></Reveal>}
      {title && <TextReveal text={title} className="title" delay={0.1} />}
      {lede && <Reveal delay={0.35} distance={18}><p className="lede">{lede}</p></Reveal>}
    </div>
  )
}
