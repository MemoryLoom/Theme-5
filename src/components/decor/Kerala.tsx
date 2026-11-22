import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { memo } from 'react'

/**
 * Original Guruvayoor Sri Krishna Temple decorative elements (hand-built SVG):
 * - Nilavilakku (standing brass lamp)
 * - Deepastambham (multi-tiered Guruvayoor East Nada lamp tower)
 * - MayilpeeliFlute (Lord Guruvayurappan's sacred peacock feather, golden flute & thulasi)
 * - TempleBell (hanging brass ambalamani)
 * - VilakkumadamRow (Chuttuvilakku glowing temple wall lamps)
 * - TempleFrame (Guruvayoor two-tier Sreekovil / Gopuram entrance with kalashams & bells)
 * - JasmineStrand (mullappoo & thulasi garland)
 * - MuralCorner (Kerala temple mural corner flourish)
 * - SadyaLeaf (illustrated sadya on banana leaf)
 */

/** Brass nilavilakku — compact line-and-fill lamp with flickering flames. */
export const Nilavilakku = memo(function Nilavilakku({ className = '', flames = 3 }: { className?: string; flames?: 1 | 3 | 5 }) {
  const xs = flames === 1 ? [0] : flames === 3 ? [-9, 0, 9] : [-14, -7, 0, 7, 14]
  return (
    <svg viewBox="-24 -60 48 100" className={className} aria-hidden="true" fill="currentColor">
      {xs.map((x, i) => (
        <g key={x} className="flicker" style={{ animationDelay: `${i * 0.27}s` }}>
          <path d={`M${x} -21 C${x - 2.6} -24 ${x - 3} -28 ${x} -35 C${x + 3} -28 ${x + 2.6} -24 ${x} -21Z`} fill="#FFD166" opacity=".95" />
          <path d={`M${x} -22 C${x - 1.2} -24 ${x - 1.4} -27 ${x} -31 C${x + 1.4} -27 ${x + 1.2} -24 ${x} -22Z`} fill="#FFF8E8" />
        </g>
      ))}
      <path d="M-18 -21 H18 C16 -15 9 -13 0 -13 C-9 -13 -16 -15 -18 -21Z" />
      <rect x="-1.6" y="-13" width="3.2" height="40" />
      <ellipse cy="-2" rx="5" ry="1.8" /><ellipse cy="10" rx="4" ry="1.6" /><ellipse cy="20" rx="5.5" ry="1.8" />
      <path d="M-14 38 C-13 31 -6 29 -4 26 H4 C6 29 13 31 14 38Z" />
    </svg>
  )
})

/** Guruvayoor East Nada Deepastambham — multi-tiered sacred brass lamp tower with glowing wicks. */
export const Deepastambham = memo(function Deepastambham({ className = '' }: { className?: string }) {
  const tiers: [number, number, number[]][] = [
    [-42, 12, [-10, -4, 4, 10]],
    [-20, 17, [-15, -8, 0, 8, 15]],
    [4, 22, [-20, -12, -5, 5, 12, 20]],
    [28, 27, [-25, -16, -8, 0, 8, 16, 25]],
  ]
  return (
    <svg viewBox="-36 -74 72 154" className={className} aria-hidden="true" fill="currentColor">
      {/* Top Kalasham flame */}
      <g className="flicker">
        <path d="M0 -55 C-3.2 -59 -3.6 -65 0 -73 C3.6 -65 3.2 -59 0 -55Z" fill="#FFD166" />
        <path d="M0 -56 C-1.5 -59 -1.7 -63 0 -68 C1.7 -63 1.5 -59 0 -56Z" fill="#FFF8E8" />
      </g>
      <path d="M-6 -55 H6 C5 -50 2.5 -49 0 -49 C-2.5 -49 -5 -50 -6 -55Z" />
      {/* Central brass shaft */}
      <rect x="-2.4" y="-50" width="4.8" height="106" rx="1" />
      {/* Lamp tiers */}
      {tiers.map(([y, w, xs], ti) => (
        <g key={y}>
          {xs.map((x, fi) => (
            <g key={x} className="flicker" style={{ animationDelay: `${((ti * 3 + fi) % 6) * 0.22}s` }}>
              <path d={`M${x} ${y - 2} C${x - 2} ${y - 5} ${x - 2.2} ${y - 9} ${x} ${y - 14} C${x + 2.2} ${y - 9} ${x + 2} ${y - 5} ${x} ${y - 2}Z`} fill="#FFD166" />
              <circle cx={x} cy={y - 5} r="1.1" fill="#FFF8E8" />
            </g>
          ))}
          <path d={`M${-w} ${y - 2} H${w} C${w - 2.5} ${y + 3.5} ${w * 0.5} ${y + 5} 0 ${y + 5} C${-w * 0.5} ${y + 5} ${-w + 2.5} ${y + 3.5} ${-w} ${y - 2}Z`} />
          <ellipse cy={y + 8} rx={w * 0.28} ry="2" opacity=".85" />
        </g>
      ))}
      {/* Stepped temple stone & brass base */}
      <ellipse cy="44" rx="8" ry="2.4" />
      <path d="M-16 58 C-14 51 -7 49 -4 46 H4 C7 49 14 51 16 58Z" />
      <rect x="-21" y="58" width="42" height="5" rx="1.5" />
      <rect x="-26" y="63" width="52" height="6" rx="1.5" opacity=".85" />
    </svg>
  )
})

/**
 * Lord Guruvayurappan's emblem: Golden Odakkuzhal (divine flute) with Mayilpeeli (peacock feather)
 * and sacred Thulasi leaves in traditional Kerala mural colours.
 */
export const MayilpeeliFlute = memo(function MayilpeeliFlute({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 84" className={className} aria-hidden="true" fill="none">
      {/* Soft golden aura behind the crest */}
      <ellipse cx="110" cy="42" rx="68" ry="28" fill="var(--p-gold)" opacity=".08" />

      {/* Peacock feather (Mayilpeeli) arching behind the flute */}
      <g transform="translate(110 42) rotate(-24)">
        {/* Feather barbs */}
        <path d="M-4 18 C-18 -6 -16 -34 10 -44 C34 -34 36 -6 16 18" stroke="var(--p-green)" strokeWidth="1.4" opacity=".85" />
        <path d="M-8 12 C-24 -8 -20 -36 10 -48 C38 -36 42 -8 20 14" stroke="var(--p-gold)" strokeWidth=".9" strokeDasharray="2 3" opacity=".8" />
        {/* Feather eye (outer gold, emerald, deep blue, maroon heart) */}
        <ellipse cx="9" cy="-19" rx="16" ry="20" fill="#254B36" stroke="var(--p-gold)" strokeWidth="1.2" />
        <ellipse cx="9" cy="-18" rx="11.5" ry="14.5" fill="#C6A15B" />
        <ellipse cx="9" cy="-17" rx="8.5" ry="11" fill="#1D4E5F" />
        <ellipse cx="9" cy="-15.5" rx="5.2" ry="6.8" fill="#581F27" />
        <circle cx="7.5" cy="-17.5" r="1.6" fill="#FFF8E8" opacity=".9" />
        {/* Quill stem */}
        <path d="M9 28 Q8 4 9 -36" stroke="var(--p-gold)" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Sacred Thulasi leaves on left & right */}
      <g fill="var(--p-green)" stroke="var(--p-gold)" strokeWidth=".7" opacity=".92">
        <path d="M68 49 C56 42 52 52 64 56 C58 62 66 67 74 55Z" />
        <path d="M152 35 C164 28 168 38 156 42 C162 48 154 53 146 41Z" />
      </g>

      {/* Golden Odakkuzhal (Flute) */}
      <g transform="rotate(-7 110 46)">
        <rect x="26" y="42" width="168" height="8" rx="4" fill="var(--p-brown)" stroke="var(--p-gold)" strokeWidth="1.5" />
        <line x1="32" y1="44.5" x2="188" y2="44.5" stroke="var(--p-gold)" strokeWidth=".7" opacity=".65" />
        {/* Ornamental gold bands on the flute */}
        {[40, 44, 174, 178].map((x) => (
          <line key={x} x1={x} y1="42" x2={x} y2="50" stroke="var(--p-gold)" strokeWidth="1.4" />
        ))}
        {/* Flute finger holes */}
        {[76, 92, 108, 124, 140, 154].map((x) => (
          <circle key={x} cx={x} cy="46" r="1.9" fill="var(--p-gold)" />
        ))}
        {/* Hanging golden tassels from the flute end */}
        <path d="M42 50 Q39 61 36 67 M45 50 Q44 62 42 69" stroke="var(--p-gold)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="36" cy="68" r="1.8" fill="var(--p-gold)" />
        <circle cx="42" cy="70" r="1.8" fill="var(--p-gold)" />
      </g>
    </svg>
  )
})

/** Hanging brass Kerala temple bell (Ambalamani). */
export const TempleBell = memo(function TempleBell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-20 0 40 90" className={className} aria-hidden="true" fill="currentColor">
      {/* Chain links */}
      <line x1="0" y1="0" x2="0" y2="42" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 2" />
      <circle cx="0" cy="44" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {/* Bell crown & body */}
      <path d="M-5 47 H5 L7 52 H-7 Z" />
      <path d="M-7 52 C-9 60 -11 69 -15 74 H15 C11 69 9 60 7 52 Z" />
      <rect x="-16" y="74" width="32" height="3" rx="1.5" />
      {/* Clapper */}
      <circle cx="0" cy="80" r="3.2" />
    </svg>
  )
})

/** Vilakkumadam / Chuttuvilakku — row of tiny glowing oil lamps along the Guruvayoor temple wall. */
export const VilakkumadamRow = memo(function VilakkumadamRow({ className = '', count = 11 }: { className?: string; count?: number }) {
  const lamps = Array.from({ length: count }, (_, i) => {
    const x = 20 + (i / Math.max(1, count - 1)) * 320
    return (
      <g key={i} transform={`translate(${x.toFixed(1)} 16)`}>
        <g className="flicker" style={{ animationDelay: `${(i % 5) * 0.25}s` }}>
          <path d="M0 -3 C-1.8 -5.5 -2 -9 0 -13 C2 -9 1.8 -5.5 0 -3Z" fill="#FFD166" />
          <circle cx="0" cy="-5.5" r="1" fill="#FFF8E8" />
        </g>
        <path d="M-5 -3 H5 C4 0 2 1.5 0 1.5 C-2 1.5 -4 0 -5 -3Z" fill="var(--p-gold)" />
        <line x1="0" y1="1.5" x2="0" y2="6" stroke="var(--p-gold)" strokeWidth="1.1" />
        <line x1="-3.5" y1="6" x2="3.5" y2="6" stroke="var(--p-gold)" strokeWidth="1.1" />
      </g>
    )
  })
  return (
    <svg viewBox="0 0 360 26" className={className} aria-hidden="true">
      <line x1="8" y1="22" x2="352" y2="22" stroke="var(--p-gold)" strokeWidth=".7" opacity=".45" />
      {lamps}
    </svg>
  )
})

/**
 * Guruvayoor Sri Krishna Temple East Nada Gopuram & Sreekovil entrance:
 * two-tier copper-and-gold sloped roof with sacred Kalasham finials, hanging temple bells,
 * and Chuttuvilakku pillars.
 */
export function TempleFrame({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const draw: Variants = {
    hidden: reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
    show: (i: number) => ({ pathLength: 1, opacity: 1, transition: { pathLength: { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 + i * 0.18 }, opacity: { duration: 0.5, delay: 0.2 + i * 0.18 } } }),
  }
  const P = (i: number, d: string, w = 1, o = 1) => <motion.path custom={i} variants={draw} d={d} stroke="currentColor" strokeWidth={w} opacity={o} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
  return (
    <>
      <motion.svg className="hero-roof" viewBox="0 0 400 282" fill="none" aria-hidden="true" initial="hidden" animate={play ? 'show' : 'hidden'}>
        {/* Top Golden Kalasham (Thazhikakudam) */}
        {P(0, 'M200 4 V18 M192 32 Q200 20 208 32 V38 H192 Z M195 18 Q200 12 205 18 M188 38 H212', 1.2)}
        {/* Upper Tier Sreekovil Roof */}
        {P(1, 'M200 38 L114 126 Q104 136 84 140 H316 Q296 136 286 126 Z', 1.3)}
        {/* Mukhappu (Central Gable with Guruvayoor Sun/Lotus Arch & Lattice) */}
        {P(2, 'M200 56 L142 122 H258 Z M200 56 V122 M170 90 H230 M156 107 H244', 0.85, 0.85)}
        {P(2, 'M186 122 A14 14 0 0 1 214 122', 1.1, 0.95)}
        {/* Lower Tier Gopuram Roof with curved Kerala eaves */}
        {P(3, 'M144 140 L64 218 Q52 230 28 236 H372 Q348 230 336 218 L256 140', 1.35)}
        {/* Copper roof ribs & decorative eaves border */}
        {P(4, 'M200 140 V236 M168 140 L122 236 M232 140 L278 236 M136 140 L74 236 M264 140 L326 236', 0.55, 0.45)}
        {P(4, 'M48 248 H352 M48 258 H352', 0.9, 0.85)}
        {/* Hanging temple bells (Ambalamani) under the eaves */}
        {P(5, 'M82 258 V273 M77 273 H87 L85 267 H79 Z M318 258 V273 M313 273 H323 L321 267 H315 Z', 1, 0.9)}
        {P(5, 'M120 258 V270 M280 258 V270', 0.9)}
      </motion.svg>
      <motion.div className="hero-pillars" aria-hidden="true" initial={{ scaleY: 0 }} animate={play ? { scaleY: 1 } : {}} transition={{ duration: 2, ease: [0.65, 0, 0.35, 1], delay: 1.3 }} />
    </>
  )
}

/** A strand of jasmine buds (mullappoo) & green thulasi leaves along a gentle curve. */
export const JasmineStrand = memo(function JasmineStrand({ className = '' }: { className?: string }) {
  const buds = Array.from({ length: 23 }, (_, i) => {
    const t = i / 22, x = 6 + t * 228, y = 6 + Math.sin(t * Math.PI) * 12
    return (
      <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(t - 0.5) * 40})`}>
        <ellipse rx="4.2" ry="2.6" fill="#FFFDF6" stroke="#d9ccb0" strokeWidth=".5" />
        {i % 2 === 1 && <ellipse cx="-4.6" cy="0" rx="2.1" ry="1.2" fill="#2f663e" />}
      </g>
    )
  })
  return <svg viewBox="0 0 240 26" className={className} aria-hidden="true">{buds}</svg>
})

/** Kerala temple mural–inspired corner flourish (curling vine with lotus bud) in palette colours. */
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

/** Illustrated sadya on a banana leaf. */
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
