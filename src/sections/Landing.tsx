import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Deepastambham, MayilpeeliFlute } from '../components/decor/Kerala'
import { WaxSeal } from '../components/decor/WaxSeal'
import { useCouple, useSite } from '../context/SiteContext'
import { dateParts } from '../lib/date'
import { MediaImg } from '../components/ui/MediaImg'

const IO = [0.65, 0, 0.35, 1] as const
const OUT = [0.22, 0.8, 0.24, 1] as const

/** Opening screen: Guruvayoor temple deepastambham stage with a kasavu-bordered ivory envelope. */
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
    setTimeout(onDone, reduce ? 300 : 2300)
  }

  return (
    <motion.div className="landing" role="button" tabIndex={0} aria-label="Tap to open the Guruvayoor wedding invitation"
      onClick={open} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      exit={{ opacity: 0, transition: { duration: 1, ease: IO } }}>
      {config.backdrops.landing && (
        <motion.div className="landing-bg" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: opening && !reduce ? 1.15 : 1, opacity: 1 }} transition={{ duration: opening ? 2.4 : 2.6, ease: OUT }} aria-hidden="true">
          <MediaImg src={config.backdrops.landing} alt="" loading="eager" />
        </motion.div>
      )}

      {/* Flanking Guruvayoor East Nada Deepastambham lamp pillars */}
      <motion.div className="pointer-events-none absolute bottom-[12vh] left-[4vw] hidden text-kasavu/55 sm:block md:left-[8vw]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: opening ? 0 : 0.75, y: 0 }} transition={{ duration: 1.4, delay: 0.3 }}>
        <Deepastambham className="h-[220px] w-[100px] md:h-[270px] md:w-[120px]" />
      </motion.div>
      <motion.div className="pointer-events-none absolute bottom-[12vh] right-[4vw] hidden text-kasavu/55 sm:block md:right-[8vw]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: opening ? 0 : 0.75, y: 0 }} transition={{ duration: 1.4, delay: 0.3 }}>
        <Deepastambham className="h-[220px] w-[100px] md:h-[270px] md:w-[120px]" />
      </motion.div>

      <motion.div className="absolute left-0 right-0 top-[7vh] px-4 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: 1.1, ease: OUT, delay: opening ? 0 : 0.3 }}>
        <MayilpeeliFlute className="mx-auto mb-1 h-11 w-28" />
        <div className="ml-blessing !text-kasavu">{config.hero.blessingMl}</div>
        <div className="mt-2.5 text-[10.5px] uppercase tracking-[.38em] text-[#E8D9BD]/85">Sree Guruvayurappan Temple · East Nada</div>
        <div className="serif mt-1.5 text-[clamp(26px,6vw,36px)] font-light text-[#FFF8E8]">{first.name} <span className="italic text-kasavu">&amp;</span> {second.name}</div>
      </motion.div>

      <motion.div className="envelope" initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={opening && !reduce ? { opacity: 1, y: 60, scale: 1.04 } : { opacity: 1, y: 0, scale: 1 }}
        transition={opening ? { duration: 1.6, ease: IO, delay: 0.5 } : { duration: 1.3, ease: OUT, delay: 0.15 }}>
        <div className="env-back" />
        {/* the invitation card that rises out of the envelope */}
        <motion.div className="env-card" style={{ zIndex: opening ? 2 : 1 }}
          animate={opening && !reduce ? { y: '-58%' } : { y: '0%' }} transition={{ duration: 1.25, ease: IO, delay: 0.75 }}>
          <div className="ml text-[11px] text-maroon">{config.wedding.auspiciousMl}</div>
          <div className="serif mt-1 text-[clamp(22px,6vw,30px)] font-normal leading-tight text-maroon">{first.name} <i className="text-[#A98243]">&amp;</i> {second.name}</div>
          <div className="mt-1 text-[10.5px] tracking-[.28em] text-[#6B5545]">{dp.d} · {dp.m} · 20{dp.y} · GURUVAYOOR</div>
        </motion.div>
        {/* front pocket of the envelope */}
        <svg className="env-front" viewBox="0 0 142 100" preserveAspectRatio="none" style={{ zIndex: 2 }} aria-hidden="true">
          <defs><linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ead0" /><stop offset="1" stopColor="#e4d0a6" /></linearGradient></defs>
          <path d="M0 0 L71 56 L142 0 V100 H0 Z" fill="url(#pk)" />
          <path d="M0 100 L62 50 M142 100 L80 50" fill="none" stroke="#bfa676" strokeWidth=".6" vectorEffect="non-scaling-stroke" opacity=".7" />
          <path d="M0 0 L71 56 L142 0" fill="none" stroke="#c9b283" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="env-kasavu" aria-hidden="true" />
        <motion.div className="env-flap" animate={opening && !reduce ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.95, ease: IO, delay: 0.3 }}
          style={{ zIndex: opening ? 0 : 3, transformPerspective: 900 }}>
          <div className="face" />
        </motion.div>
        <div className="seal-wrap">
          {!opening ? (
            <motion.div className="absolute inset-0" animate={reduce ? {} : { scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <WaxSeal letters={mono} />
            </motion.div>
          ) : (
            <>
              <motion.div className="absolute inset-0" animate={{ x: '-60%', y: '40%', rotate: -30, opacity: 0 }} transition={{ duration: 0.8, ease: IO }}><WaxSeal letters={mono} half="left" /></motion.div>
              <motion.div className="absolute inset-0" animate={{ x: '60%', y: '40%', rotate: 30, opacity: 0 }} transition={{ duration: 0.8, ease: IO }}><WaxSeal letters={mono} half="right" /></motion.div>
            </>
          )}
        </div>
      </motion.div>

      <motion.div className="tap-hint" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.4 }}>
        {guestName && <motion.div className="landing-guest" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.9 }}>Dear {guestName}</motion.div>}
        {ready ? (
          <motion.span initial={{ opacity: 0 }} animate={reduce ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }} transition={reduce ? { duration: 0.6 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
            Tap to enter Sree Guruvayurappan Sannidhi
          </motion.span>
        ) : (
          <span className="loader-dots" aria-label="Loading"><span /><span /><span /></span>
        )}
      </motion.div>
    </motion.div>
  )
}
