import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { memo, useEffect, useState } from 'react'
import { Backdrop, Parallax, Reveal, RevealItem, Seam, TextReveal } from '../components/ui/Reveal'
import { Deepastambham, Nilavilakku, VilakkumadamRow } from '../components/decor/Kerala'
import { useSite } from '../context/SiteContext'
import { dateParts, diffParts, longDate, tzOf } from '../lib/date'
import templeBorder from '../assets/photos/temple-zari-border.webp'

/** One animated number: digits slide when they change. */
const Digit = memo(function Digit({ value }: { value: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="cd-digit" aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={value} initial={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.8, 0.24, 1] }} style={{ display: 'inline-block' }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
})

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    let t: number
    const tick = () => { setNow(Date.now()); t = window.setTimeout(tick, interval - (Date.now() % interval)) }
    t = window.setTimeout(tick, interval - (Date.now() % interval))
    return () => clearTimeout(t)
  }, [interval])
  return now
}

// Floating & swaying hanging temple lamps placed on left & right sides so center headings are completely clear
const FLOATING_LAMPS = [
  { left: '6%', k: 0.82, amp: '3.0deg', dur: '4.8s', delay: '-1.2s' },
  { left: '17%', k: 0.66, amp: '2.4deg', dur: '5.5s', delay: '-3.1s' },
  { left: '83%', k: 0.68, amp: '2.8deg', dur: '5.2s', delay: '-2.4s' },
  { left: '94%', k: 0.84, amp: '3.2deg', dur: '4.6s', delay: '-4.0s' },
]

export function DateCountdown() {
  const { config } = useSite()
  const w = config.wedding
  const target = new Date(w.start).getTime()
  const now = useNow()
  const tz = tzOf(w.start)
  const dayKey = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: tz })
  const isToday = dayKey(now) === dayKey(target)
  const before = now < target
  const after = !before && !isToday
  const parts = diffParts(Math.abs(target - now))
  const dp = dateParts(w.start)
  const cells: [string, number][] = [['Days', parts.days], ['Hours', parts.hours], ['Minutes', parts.mins], ['Seconds', parts.secs]]
  const fmt = (n: number) => String(n).padStart(2, '0')
  const month = new Date(w.start).toLocaleDateString('en-GB', { month: 'long', timeZone: tz })

  return (
    <section id="date" className="section tone-maroon overflow-hidden" aria-label="Wedding date and countdown">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Backdrop src={config.backdrops.countdown} distance={70} opacity={0.48} />
      <Seam />

      {/* Side-framing floating & gently swaying Guruvayoor temple lamps */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-0 hidden h-44 overflow-hidden sm:block" aria-hidden="true">
        {FLOATING_LAMPS.map((l, i) => (
          <div
            key={i}
            className="floating-lamp"
            style={{ '--l': l.left, '--k': l.k, '--amp': l.amp, '--d': l.dur, '--delay': l.delay } as React.CSSProperties}
          >
            <span className="floating-lamp__glow" />
            <div className="mx-auto h-10 w-[1.5px] bg-kasavu/60" />
            <Nilavilakku className="h-16 w-10 text-kasavu" flames={3} />
          </div>
        ))}
      </div>

      {/* Sacred Sudarshana / Lotus Mandala rings behind the Muhurtham date */}
      <Parallax className="pointer-events-none absolute left-1/2 top-[8%] -z-10 -translate-x-1/2" distance={60}>
        <svg width="560" height="560" viewBox="0 0 560 560" fill="none" className="h-[min(560px,120vw)] w-[min(560px,120vw)] text-gold" aria-hidden="true">
          <circle cx="280" cy="280" r="276" stroke="currentColor" strokeOpacity=".15" />
          <circle cx="280" cy="280" r="220" stroke="currentColor" strokeOpacity=".12" strokeDasharray="3 8" />
          <circle cx="280" cy="280" r="160" stroke="currentColor" strokeOpacity=".08" />
        </svg>
      </Parallax>

      {/* Flanking Guruvayoor Deepastambham lamp towers */}
      <div className="pointer-events-none absolute bottom-12 left-[5vw] hidden text-kasavu/50 lg:block" aria-hidden="true">
        <Deepastambham className="h-[220px] w-[100px]" />
      </div>
      <div className="pointer-events-none absolute bottom-12 right-[5vw] hidden text-kasavu/50 lg:block" aria-hidden="true">
        <Deepastambham className="h-[220px] w-[100px]" />
      </div>

      <div className="section-inner relative z-10 max-w-[860px]">
        <TextReveal as="p" text={w.auspiciousMl} className="ml mb-3 text-[clamp(21px,4vw,33px)] !font-semibold text-kasavu" />
        <Reveal distance={12}><div className="eyebrow">{w.dateBarText}</div></Reveal>
        <div className="mt-2 flex items-end justify-center gap-[clamp(14px,4vw,36px)]" aria-label={longDate(w.start)}>
          <Reveal dir="up" delay={0.04}><span className="serif block text-[clamp(80px,19vw,172px)] font-light leading-[.85] text-ivory">{dp.d}</span></Reveal>
          <Reveal dir="down" delay={0.12} className="pb-[clamp(8px,2vw,22px)] text-left">
            <span className="serif block text-[clamp(28px,6vw,52px)] italic leading-none text-gold2">{month}</span>
            <span className="mt-2 block text-[clamp(12px,1.8vw,15px)] font-normal tracking-[.45em] text-champagne">20{dp.y} · 1202 DHANU 5</span>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mt-6">
          <p className="ml text-[clamp(14px,2.3vw,16px)] text-kasavu/95">മുഹൂർത്തം: രാവിലെ 10:45 – 11:30 · കിഴക്കേ നട കല്യാണമണ്ഡപം, ഗുരുവായൂർ</p>
          <VilakkumadamRow className="mx-auto mt-3 h-6 w-[260px] opacity-85 sm:w-[280px]" />
        </Reveal>

        <div className="mx-auto mt-11 max-w-[640px]">
          {isToday ? (
            <Reveal className="serif py-4 text-[clamp(32px,6vw,48px)] font-light italic text-gold2" scale={0.92}>
              <motion.div animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 3, repeat: Infinity }}>{w.todayMessage}</motion.div>
            </Reveal>
          ) : (
            <Reveal stagger={0.07}>
              <RevealItem className="label mb-5">{before ? w.countdownHeading : w.afterHeading}</RevealItem>
              <div className="flex items-stretch gap-[clamp(8px,2vw,16px)]" role="timer" aria-live="off"
                aria-label={`${parts.days} days ${parts.hours} hours ${parts.mins} minutes ${before ? 'to go' : 'together'}`}>
                {cells.map(([l, v]) => (
                  <RevealItem key={l} className="cd-box">
                    <span className="cd-num">{fmt(v).split('').map((ch, i) => <Digit key={i} value={ch} />)}</span>
                    <div className="cd-lbl">{l}</div>
                  </RevealItem>
                ))}
              </div>
            </Reveal>
          )}
          {after && (
            <Reveal className="mt-8" delay={0.2}>
              <span className="serif text-[clamp(26px,4vw,34px)] italic text-gold2">{w.justMarried}</span>
              <span className="ml-3 text-[12px] tracking-[.3em] text-muted">{dp.d}.{dp.m}.20{dp.y}</span>
            </Reveal>
          )}
        </div>
      </div>
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
