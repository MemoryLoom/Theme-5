import { useEffect, useRef, type ReactNode } from 'react'
import rollerCrimson from '../../assets/photos/scroll-roller.webp'
import paperCrimson from '../../assets/photos/scroll-paper.webp'
import rollerGold from '../../assets/photos/scroll-roller-gold.webp'
import paperIvory from '../../assets/photos/scroll-paper-ivory.webp'
import flowerMarigold from '../../assets/photos/flower-marigold.webp'
import flowerJasmine from '../../assets/photos/flower-jasmine.webp'

/**
 * Scroll-driven unrolling royal temple scroll (adapted from lovewed.in/aaravwedsaadhya RollingScroll).
 * As the section enters the viewport, the top and bottom ornate temple rollers smoothly unroll the
 * sacred parchment using requestAnimationFrame interpolation (`o += (target - o) * 0.18`).
 */
export function RollingScroll({
  children,
  variant = 'ivory',
  startAt = 0.88,
  distance = 0.62,
  className = '',
}: {
  children: ReactNode
  variant?: 'ivory' | 'crimson'
  startAt?: number
  distance?: number
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  const rollerSrc = variant === 'crimson' ? rollerCrimson : rollerGold
  const paperSrc = variant === 'crimson' ? paperCrimson : paperIvory

  useEffect(() => {
    const root = rootRef.current
    const clip = clipRef.current
    const paper = paperRef.current
    if (!root || !clip || !paper) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId = 0
    let fullHeight = paper.offsetHeight
    let currentP = 0

    const calcTarget = () => {
      const vh = window.innerHeight
      const span = Math.min(vh * distance, Math.max(260, 0.65 * fullHeight))
      const raw = (vh * startAt - root.getBoundingClientRect().top) / span
      return Math.min(Math.max(raw, 0.08), 1)
    }

    const apply = () => {
      root.style.setProperty('--p', currentP.toFixed(4))
      clip.style.height = currentP >= 0.998 ? 'auto' : `${Math.round(fullHeight * currentP)}px`
    }

    const tick = () => {
      rafId = 0
      const target = calcTarget()
      currentP += (target - currentP) * 0.2
      if (Math.abs(target - currentP) < 0.0015) currentP = target
      apply()
      if (currentP !== target) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    if (reduce) {
      currentP = 1
      apply()
      return
    }

    currentP = calcTarget()
    apply()

    const ro = new ResizeObserver(() => {
      fullHeight = paper.offsetHeight
      schedule()
    })
    ro.observe(paper)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [startAt, distance])

  return (
    <div
      ref={rootRef}
      className={`rolling-scroll ${variant === 'crimson' ? 'rolling-scroll--crimson' : 'rolling-scroll--ivory'} ${className}`}
      style={{ '--paper-img': `url(${paperSrc})`, '--p': 0 } as React.CSSProperties}
    >
      <div className="rolling-scroll__body">
        <div ref={clipRef} className="rolling-scroll__clip">
          <div ref={paperRef} className="rolling-scroll__paper">
            <div className="rolling-scroll__content">{children}</div>
          </div>
        </div>
        <img className="rolling-scroll__roller rolling-scroll__roller--top" src={rollerSrc} alt="" decoding="async" />
        <img className="rolling-scroll__roller rolling-scroll__roller--bottom" src={rollerSrc} alt="" decoding="async" />
      </div>
    </div>
  )
}

/**
 * Deterministic PRNG for falling temple marigold & jasmine flowers so SSR/hydration and re-renders remain stable.
 */
function makeDrops(count: number, seed = 7) {
  let s = seed
  const rand = () => {
    let t = Math.imul((s = (s + 0x6d2b79f5) | 0) ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
  const sources = [flowerMarigold, flowerJasmine]
  return Array.from({ length: count }, (_, idx) => ({
    src: sources[idx % sources.length],
    left: 3 + rand() * 92,
    size: 18 + rand() * 16,
    dur: 9 + rand() * 8,
    delay: -(rand() * 16),
    dx: (rand() - 0.5) * 22,
    rot: (rand() < 0.5 ? -1 : 1) * (180 + rand() * 520),
  }))
}

const DROPS = makeDrops(14)

/**
 * Falling temple flowers (marigold & crimson lotus/dahlia) inside a section's sticky viewport box.
 * Automatically pauses when the section is offscreen and reduces count on mobile screens.
 */
export function SectionFlowerRain({ paused = false }: { paused?: boolean }) {
  return (
    <div className={`temple-flower-rain ${paused ? 'is-paused' : ''}`} aria-hidden="true">
      {DROPS.map((f, i) => (
        <img
          key={i}
          src={f.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="temple-flower-rain__drop"
          style={
            {
              '--l': `${f.left.toFixed(1)}%`,
              '--s': `${f.size.toFixed(0)}px`,
              '--d': `${f.dur.toFixed(1)}s`,
              '--delay': `${f.delay.toFixed(1)}s`,
              '--dx': `${f.dx.toFixed(1)}vw`,
              '--rot': `${f.rot.toFixed(0)}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
