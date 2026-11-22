import { memo, useId } from 'react'

/** Deterministic irregular wax-blob outline. */
function blobPath(cx: number, cy: number, r: number, n = 46) {
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const k = 1 + 0.035 * Math.sin(i * 2.7) + 0.025 * Math.sin(i * 5.3 + 1) + 0.045 * Math.max(0, Math.sin(i * 0.9 + 2)) ** 6
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k])
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p1 = pts[(i + 1) % n], p2 = pts[(i + 2) % n]
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2
    d += ` Q${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  return d + 'Z'
}
const BLOB = blobPath(150, 150, 132)

/** Original embossed wax seal with the couple's monogram. */
function WaxSealSvg({ letters, className = '', half }: { letters: string; className?: string; half?: 'left' | 'right' }) {
  const id = useId().replace(/:/g, '')
  const [a, b] = [letters[0] || '', letters[1] || '']
  const clip = half ? `url(#c${id})` : undefined
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`w${id}`} cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor="#E2C98F" /><stop offset=".45" stopColor="#C6A15B" /><stop offset=".82" stopColor="#8f6d33" /><stop offset="1" stopColor="#6b5022" />
        </radialGradient>
        <radialGradient id={`i${id}`} cx=".6" cy=".7" r=".8">
          <stop offset="0" stopColor="#d9bd84" /><stop offset=".6" stopColor="#b8924f" /><stop offset="1" stopColor="#866631" />
        </radialGradient>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF9EF" /><stop offset=".5" stopColor="#E2C98F" /><stop offset="1" stopColor="#a8864a" />
        </linearGradient>
        <filter id={`s${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#4a3210" floodOpacity=".35" />
        </filter>
        <filter id={`n${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.08  0 0 0 .22 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        {half && (
          <clipPath id={`c${id}`}>
            <path d={half === 'left' ? 'M0 0 H156 L140 70 L162 130 L138 190 L158 250 L146 300 H0Z' : 'M300 0 H156 L140 70 L162 130 L138 190 L158 250 L146 300 H300Z'} />
          </clipPath>
        )}
      </defs>
      <g clipPath={clip}>
        <g filter={`url(#s${id})`}>
          <path d={BLOB} fill={`url(#w${id})`} />
        </g>
        <path d={BLOB} fill="#000" filter={`url(#n${id})`} />
        {/* raised rim */}
        <circle cx="150" cy="150" r="104" fill="none" stroke="#7d561b" strokeWidth="9" opacity=".55" />
        <circle cx="150" cy="150" r="104" fill="none" stroke="#F1E5CC" strokeWidth="3" opacity=".7" transform="translate(-1.5 -1.5)" />
        <circle cx="150" cy="150" r="99" fill={`url(#i${id})`} />
        {/* rope / bead ring */}
        {Array.from({ length: 48 }, (_, i) => {
          const ang = (i / 48) * Math.PI * 2
          return <circle key={i} cx={150 + Math.cos(ang) * 90} cy={150 + Math.sin(ang) * 90} r="2.3" fill="#F1E5CC" opacity=".55" />
        })}
        <circle cx="150" cy="150" r="82" fill="none" stroke="#8e6420" strokeWidth="1.2" opacity=".5" />
        {/* monogram: shadow, highlight, face */}
        <g fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontWeight="500" fontSize="112" textAnchor="middle">
          <text x="124" y="170" fill="#6b4712" opacity=".55" transform="translate(2.5 3)">{a}</text>
          <text x="176" y="198" fill="#6b4712" opacity=".55" transform="translate(2.5 3)">{b}</text>
          <text x="124" y="170" fill="#fff1c7" opacity=".7" transform="translate(-1.2 -1.2)">{a}</text>
          <text x="176" y="198" fill="#fff1c7" opacity=".7" transform="translate(-1.2 -1.2)">{b}</text>
          <text x="124" y="170" fill={`url(#t${id})`}>{a}</text>
          <text x="176" y="198" fill={`url(#t${id})`}>{b}</text>
        </g>
        {/* gloss */}
        <ellipse cx="108" cy="86" rx="46" ry="18" fill="#fff8de" opacity=".18" transform="rotate(-28 108 86)" />
      </g>
    </svg>
  )
}
export const WaxSeal = memo(WaxSealSvg)
