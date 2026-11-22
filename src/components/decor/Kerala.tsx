import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { memo } from 'react'

/**
 * Original Kerala decorative elements (hand-built SVG, no third-party art):
 * nilavilakku, temple gable frame, jasmine strand, mural-style corner and a sadya banana-leaf illustration.
 */

/** Brass nilavilakku — compact line-and-fill lamp with flickering flames. */
export const Nilavilakku = memo(function Nilavilakku({ className = '', flames = 3 }: { className?: string; flames?: 1 | 3 | 5 }) {
  const xs = flames === 1 ? [0] : flames === 3 ? [-9, 0, 9] : [-14, -7, 0, 7, 14]
  return (
    <svg viewBox="-24 -60 48 100" className={className} aria-hidden="true" fill="currentColor">
      {xs.map((x, i) => (
        <g key={x} className="flicker" style={{ animationDelay: `${i * 0.27}s` }}>
          <path d={`M${x} -21 C${x - 2.6} -24 ${x - 3} -28 ${x} -35 C${x + 3} -28 ${x + 2.6} -24 ${x} -21Z`} opacity=".95" />
        </g>
      ))}
      <path d="M-18 -21 H18 C16 -15 9 -13 0 -13 C-9 -13 -16 -15 -18 -21Z" />
      <rect x="-1.6" y="-13" width="3.2" height="40" />
      <ellipse cy="-2" rx="5" ry="1.8" /><ellipse cy="10" rx="4" ry="1.6" /><ellipse cy="20" rx="5.5" ry="1.8" />
      <path d="M-14 38 C-13 31 -6 29 -4 26 H4 C6 29 13 31 14 38Z" />
    </svg>
  )
})

/** Kerala temple entrance: two-tier sloped roof with gable (line art that draws itself) above pillars that grow down. */
export function TempleFrame({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const draw: Variants = {
    hidden: reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
    show: (i: number) => ({ pathLength: 1, opacity: 1, transition: { pathLength: { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 + i * 0.2 }, opacity: { duration: 0.5, delay: 0.2 + i * 0.2 } } }),
  }
  const P = (i: number, d: string, w = 1, o = 1) => <motion.path custom={i} variants={draw} d={d} stroke="currentColor" strokeWidth={w} opacity={o} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
  return (
    <>
      <motion.svg className="hero-roof" viewBox="0 0 400 272" fill="none" aria-hidden="true" initial="hidden" animate={play ? 'show' : 'hidden'}>
        {P(0, 'M200 8 V22 M193 34 Q200 24 207 34 V40 H193 Z M196 22 Q200 16 204 22')}
        {P(1, 'M200 40 L120 126 Q112 136 94 140 H306 Q288 136 280 126 Z', 1.2)}
        {P(2, 'M200 60 L146 120 H254 Z M200 60 V120 M173 90 H227 M160 106 H240', 0.7, 0.8)}
        {P(3, 'M150 140 L70 218 Q60 230 36 236 H364 Q340 230 330 218 L250 140', 1.2)}
        {P(4, 'M58 250 H342 M58 260 H342', 0.8, 0.8)}
        {P(5, 'M120 260 V268 M280 260 V268', 0.8)}
      </motion.svg>
      <motion.div className="hero-pillars" aria-hidden="true" initial={{ scaleY: 0 }} animate={play ? { scaleY: 1 } : {}} transition={{ duration: 2, ease: [0.65, 0, 0.35, 1], delay: 1.3 }} />
    </>
  )
}

/** A strand of jasmine buds (mullappoo) along a gentle curve. */
export const JasmineStrand = memo(function JasmineStrand({ className = '' }: { className?: string }) {
  const buds = Array.from({ length: 23 }, (_, i) => {
    const t = i / 22, x = 6 + t * 228, y = 6 + Math.sin(t * Math.PI) * 12
    return (
      <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(t - 0.5) * 40})`}>
        <ellipse rx="4.2" ry="2.6" fill="#FFFDF6" stroke="#d9ccb0" strokeWidth=".5" />
        {i % 3 === 1 && <circle cx="-4.5" cy="0" r="1.1" fill="#4e7a3a" />}
      </g>
    )
  })
  return <svg viewBox="0 0 240 26" className={className} aria-hidden="true">{buds}</svg>
})

/** Kerala mural–inspired corner flourish (curling vine with lotus bud) in palette colours. */
export const MuralCorner = memo(function MuralCorner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" fill="none" strokeLinecap="round">
      <path d="M4 76 V30 Q4 4 30 4 H76" stroke="var(--p-gold)" strokeWidth="1.2" />
      <path d="M12 76 V34 Q12 12 34 12 H76" stroke="var(--p-gold)" strokeWidth=".6" opacity=".7" />
      <path d="M22 40 Q22 22 40 22 Q52 22 52 32 Q52 40 44 40 Q38 40 38 34" stroke="var(--p-maroon)" strokeWidth="1.1" />
      <path d="M30 52 Q24 46 30 40 Q36 46 30 52Z" fill="var(--p-green)" opacity=".85" />
      <path d="M52 30 Q46 24 52 18 Q58 24 52 30Z" fill="var(--p-green)" opacity=".85" />
      <path d="M40 22 Q37 14 40 8 Q43 14 40 22Z" fill="var(--p-maroon)" opacity=".9" />
      <circle cx="38" cy="34" r="1.6" fill="var(--p-gold)" />
    </svg>
  )
})

/** Illustrated sadya on a banana leaf (used for the feast card). */
export const SadyaLeaf = memo(function SadyaLeaf({ className = '' }: { className?: string }) {
  const dishes: [number, number, number, string][] = [
    [300, 205, 26, '#F2E3B3'], [360, 190, 22, '#E7A23A'], [418, 185, 20, '#5E8B3A'], [475, 188, 22, '#C9472D'],
    [530, 196, 20, '#E9C46A'], [585, 210, 24, '#B5651D'], [640, 228, 20, '#F6EFD9'], [690, 250, 22, '#8C2F39'],
  ]
  return (
    <svg viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="sl-bg" cx=".5" cy=".4" r=".9"><stop offset="0" stopColor="#4a2d20" /><stop offset="1" stopColor="#1e140e" /></radialGradient>
        <linearGradient id="sl-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2f6a2c" /><stop offset=".55" stopColor="#4f8f36" /><stop offset="1" stopColor="#7fb04c" /></linearGradient>
        <radialGradient id="sl-rice" cx=".4" cy=".35"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e8e1cf" /></radialGradient>
      </defs>
      <rect width="960" height="600" fill="url(#sl-bg)" />
      <g transform="rotate(-8 480 330)">
        <path d="M120 300 C220 150 560 110 860 210 C900 230 905 280 870 300 C620 420 300 470 140 400 C100 380 100 330 120 300Z" fill="url(#sl-leaf)" />
        <path d="M130 352 C360 300 620 250 880 252" stroke="#c9dc8a" strokeWidth="6" fill="none" opacity=".9" />
        {Array.from({ length: 22 }, (_, i) => {
          const x = 170 + i * 32
          return <path key={i} d={`M${x} ${352 - i * 4.6} q 30 -70 60 -120 M${x} ${352 - i * 4.6} q 26 50 48 90`} stroke="#285b25" strokeWidth="1.2" opacity=".35" fill="none" />
        })}
        {/* rice, payasam and dishes */}
        <ellipse cx="420" cy="320" rx="96" ry="52" fill="url(#sl-rice)" />
        <ellipse cx="430" cy="300" rx="40" ry="16" fill="#ffffff" opacity=".7" />
        {dishes.map(([x, y, r, c], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill={c} /><ellipse cx={x - r * 0.25} cy={y - r * 0.2} rx={r * 0.35} ry={r * 0.18} fill="#fff" opacity=".25" /></g>)}
        <circle cx="610" cy="320" r="46" fill="#F3DFA8" stroke="#d9be7a" strokeWidth="2" />
        <circle cx="610" cy="320" r="46" fill="none" stroke="#c4a35e" strokeDasharray="2 6" opacity=".8" />
        <path d="M230 360 C250 330 300 318 330 330 C300 345 262 362 236 372Z" fill="#F2C94C" />
        <path d="M236 372 C258 366 300 350 330 330" stroke="#9a7b2a" strokeWidth="2" fill="none" />
      </g>
      <g fill="#E8D9BD" opacity=".14">{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 137) % 960} cy={(i * 251) % 600} r="1.6" />)}</g>
    </svg>
  )
})
