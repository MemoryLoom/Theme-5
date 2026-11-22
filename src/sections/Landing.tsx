import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Deepastambham, MayilpeeliFlute } from '../components/decor/Kerala'
import { WaxSeal } from '../components/decor/WaxSeal'
import { useCouple, useSite } from '../context/SiteContext'
import { dateParts } from '../lib/date'
import { MediaImg } from '../components/ui/MediaImg'
import floralCorner from '../assets/photos/floral-corner.webp'
import bottomFlower from '../assets/photos/temple-bottom-flower.webp'

const IO = [0.65, 0, 0.35, 1] as const
const OUT = [0.22, 0.8, 0.24, 1] as const

const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const ang = (i / 16) * Math.PI * 2
  const r = 85 + (i % 3) * 28
  return { dx: Math.round(Math.cos(ang) * r), dy: Math.round(Math.sin(ang) * r) }
})

/** Opening screen: Guruvayoor temple deepastambham stage with floral garlands, sparkle burst & kasavu envelope. */
export function Landing({ onOpen, onDone }: { onOpen: () => void; onDone: () => void }) {
  const { ready, guestName, config } = useSite()
  const { first, second, mono } = useCouple()
  const reduce = useReducedMotion()
  const [opening, setOpening] = useState(false)
  const dp = dateParts(config.wedding.start)

  const open = () => {
    if (!ready || opening) return
    setOpening(true)
    onOpen() // starts music inside the user gesture and reveals the page underneath
    setTimeout(onDone, reduce ? 300 : 2100)
  }

  return (
    <motion.div className="landing flex flex-col items-center justify-between px-4 py-6 sm:py-9" role="button" tabIndex={0} aria-label="Tap to open the Guruvayoor wedding invitation"
      onClick={open} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.9, ease: IO } }}>
      {config.backdrops.landing && (
        <motion.div className="landing-bg" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: opening && !reduce ? 1.14 : 1, opacity: 1 }} transition={{ duration: opening ? 2.1 : 2.3, ease: OUT }} aria-hidden="true">
          <MediaImg src={config.backdrops.landing} alt="" loading="eager" />
        </motion.div>
      )}

      {/* Swaying temple floral garlands in top corners */}
      <span className="sway-corner sway-corner--tl z-[2] !w-[clamp(64px,15vw,175px)] opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" />
      </span>
      <span className="sway-corner sway-corner--tr z-[2] !w-[clamp(64px,15vw,175px)] opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} />
      </span>

      {/* Flanking Guruvayoor East Nada Deepastambham lamp pillars */}
      <motion.div className="pointer-events-none absolute bottom-[14vh] left-[4vw] hidden text-kasavu/65 sm:block md:left-[8vw]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: opening ? 0 : 0.85, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>
        <Deepastambham className="h-[210px] w-[96px] md:h-[250px] md:w-[112px]" />
      </motion.div>
      <motion.div className="pointer-events-none absolute bottom-[14vh] right-[4vw] hidden text-kasavu/65 sm:block md:right-[8vw]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: opening ? 0 : 0.85, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>
        <Deepastambham className="h-[210px] w-[96px] md:h-[250px] md:w-[112px]" />
      </motion.div>

      {/* Top blessing block in flex flow so it never overlaps the envelope or corners */}
      <motion.div className="relative z-[3] mx-auto max-w-[540px] px-10 pt-1 text-center sm:px-16" initial={{ opacity: 0, y: -10 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: 0.8, ease: OUT, delay: opening ? 0 : 0.15 }}>
        <MayilpeeliFlute className="mx-auto mb-1 h-9 w-24 sm:h-11 sm:w-28" />
        <div className="ml-blessing !text-[clamp(13px,2.2vw,16px)] !text-kasavu">{config.hero.blessingMl}</div>
        <div className="mt-1.5 text-[10px] uppercase tracking-[.32em] text-[#E8D9BD]/90">Sree Guruvayurappan Temple · East Nada</div>
        <div className="serif mt-1 text-[clamp(24px,5.4vw,34px)] font-light leading-tight text-[#FFF8E8]">{first.name} <span className="italic text-kasavu">&amp;</span> {second.name}</div>
      </motion.div>

      {/* Center envelope */}
      <motion.div className="envelope z-[3] my-auto" initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={opening && !reduce ? { opacity: 1, y: 44, scale: 1.03 } : { opacity: 1, y: 0, scale: 1 }}
        transition={opening ? { duration: 1.4, ease: IO, delay: 0.4 } : { duration: 1.1, ease: OUT, delay: 0.1 }}>
        <div className="env-back" />
        {/* the invitation card that rises out of the envelope only when opening */}
        <motion.div className="env-card px-3" style={{ zIndex: opening ? 2 : 1 }}
          animate={opening && !reduce ? { y: '-48%', opacity: 1 } : { y: '10%', opacity: opening ? 1 : 0 }} transition={{ duration: 1.15, ease: IO, delay: 0.65 }}>
          <div className="ml text-[10.5px] text-maroon">{config.wedding.auspiciousMl}</div>
          <div className="serif mt-1 text-[clamp(22px,5.6vw,29px)] font-normal leading-tight text-maroon">{first.name} <i className="text-[#A98243]">&amp;</i> {second.name}</div>
          <div className="mt-1 text-[10px] tracking-[.24em] text-[#6B5545]">{dp.d} · {dp.m} · 20{dp.y} · GURUVAYOOR</div>
        </motion.div>
        {/* front pocket of the envelope */}
        <svg className="env-front" viewBox="0 0 142 100" preserveAspectRatio="none" style={{ zIndex: 2 }} aria-hidden="true">
          <defs><linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ead0" /><stop offset="1" stopColor="#e4d0a6" /></linearGradient></defs>
          <path d="M0 0 L71 56 L142 0 V100 H0 Z" fill="url(#pk)" />
          <path d="M0 100 L62 50 M142 100 L80 50" fill="none" stroke="#bfa676" strokeWidth=".6" vectorEffect="non-scaling-stroke" opacity=".7" />
          <path d="M0 0 L71 56 L142 0" fill="none" stroke="#c9b283" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="env-kasavu" aria-hidden="true" />
        <motion.div className="env-flap" animate={opening && !reduce ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.85, ease: IO, delay: 0.25 }}
          style={{ zIndex: opening ? 0 : 3, transformPerspective: 900 }}>
          <div className="face" />
        </motion.div>
        <div className="seal-wrap">
          {!opening ? (
            <motion.div className="absolute inset-0" animate={reduce ? {} : { scale: [1, 1.05, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
              <WaxSeal letters={mono} />
            </motion.div>
          ) : (
            <>
              {!reduce && SPARKS.map((sp, idx) => (
                <motion.span
                  key={idx}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4d58a] shadow-[0_0_8px_#f4d58a]"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: sp.dx, y: sp.dy, scale: 0.2, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              ))}
              <motion.div className="absolute inset-0" animate={{ x: '-60%', y: '40%', rotate: -30, opacity: 0 }} transition={{ duration: 0.75, ease: IO }}><WaxSeal letters={mono} half="left" /></motion.div>
              <motion.div className="absolute inset-0" animate={{ x: '60%', y: '40%', rotate: 30, opacity: 0 }} transition={{ duration: 0.75, ease: IO }}><WaxSeal letters={mono} half="right" /></motion.div>
            </>
          )}
        </div>
      </motion.div>

      <img src={bottomFlower} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] max-h-[120px] w-full object-cover object-bottom opacity-55" />

      {/* Bottom tap prompt in flex flow */}
      <motion.div className="relative z-[4] pb-[env(safe-area-inset-bottom)] text-center text-[10.5px] uppercase tracking-[.32em] text-kasavu" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.35 }}>
        {guestName && <motion.div className="landing-guest !mb-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>Dear {guestName}</motion.div>}
        {ready ? (
          <motion.span className="inline-block rounded-full border border-kasavu/45 bg-[#2B1B12]/85 px-5 py-2 backdrop-blur-sm" initial={{ opacity: 0 }} animate={reduce ? { opacity: 1 } : { opacity: [0.65, 1, 0.65] }} transition={reduce ? { duration: 0.5 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
            Tap the seal to enter Guruvayoor Sannidhi
          </motion.span>
        ) : (
          <span className="loader-dots" aria-label="Loading"><span /><span /><span /></span>
        )}
      </motion.div>
    </motion.div>
  )
}
