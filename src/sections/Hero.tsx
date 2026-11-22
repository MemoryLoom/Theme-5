import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TextReveal, useIsSmall } from '../components/ui/Reveal'
import { MediaImg } from '../components/ui/MediaImg'
import { Deepastambham, MayilpeeliFlute, TempleFrame, VilakkumadamRow } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import { dateParts } from '../lib/date'

const EASE = [0.22, 0.8, 0.24, 1] as const

export function Hero({ opened }: { opened: boolean }) {
  const { config, guestName } = useSite()
  const { first, second } = useCouple()
  const reduce = useReducedMotion()
  const small = useIsSmall()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const k = reduce ? 0 : small ? 0.5 : 1
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120 * k])
  const contentO = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 160 * k])
  const glowS = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.25 * k])
  const dp = dateParts(config.wedding.start)
  const fade = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: opened ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.3, ease: EASE, delay: d } })

  return (
    <header ref={ref} className="hero tone-dark" id="top">
      <motion.div className="hero-glow" style={{ y: glowY, scale: glowS }} initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ duration: 2.4 }} />
      {config.hero.image && (
        <motion.div className="hero-photo" style={{ y: glowY }} initial={{ opacity: 0, scale: 1.14 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 3.2, ease: EASE }} aria-hidden="true">
          <MediaImg src={config.hero.image} alt="" loading="eager" className="h-full w-full object-cover" />
        </motion.div>
      )}
      <div className="hero-shade" aria-hidden="true" />
      <TempleFrame play={opened} />

      {/* Flanking East Nada Deepastambham brass lamp towers inside the temple courtyard */}
      <motion.div className="pointer-events-none absolute bottom-12 left-[6vw] hidden text-kasavu/65 lg:block"
        initial={{ opacity: 0, y: 24 }} animate={opened ? { opacity: 0.85, y: 0 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.6 }}>
        <Deepastambham className="h-[240px] w-[108px]" />
      </motion.div>
      <motion.div className="pointer-events-none absolute bottom-12 right-[6vw] hidden text-kasavu/65 lg:block"
        initial={{ opacity: 0, y: 24 }} animate={opened ? { opacity: 0.85, y: 0 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.6 }}>
        <Deepastambham className="h-[240px] w-[108px]" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentO }} className="relative">
        {guestName && <motion.p {...fade(0.25)} className="serif mb-4 text-[20px] italic text-champagne">Dear {guestName},</motion.p>}
        <motion.div {...fade(0.3)}>
          <MayilpeeliFlute className="mx-auto mb-2 h-12 w-32" />
        </motion.div>
        <motion.p {...fade(0.35)} className="ml-blessing mb-3 !text-kasavu">{config.hero.blessingMl}</motion.p>
        <motion.div {...fade(0.5)} className="eyebrow">{config.hero.eyebrow}</motion.div>
        <h1 className="hero-names">
          <TextReveal as="span" text={first.name} immediate play={opened} delay={0.6} className="block" />
          <motion.span className="hero-amp" initial={{ opacity: 0, scale: 0.6 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.0 }}>&amp;</motion.span>
          <TextReveal as="span" text={second.name} immediate play={opened} delay={1.1} className="block" />
        </h1>
        {(first.nameMl || second.nameMl) && (
          <motion.p {...fade(1.35)} className="ml mt-4 text-[clamp(16px,2.6vw,20px)] text-[#E8D9BD]">{first.nameMl} <span className="text-kasavu">&amp;</span> {second.nameMl}</motion.p>
        )}
        <motion.div {...fade(1.5)} className="mx-auto mt-7 flex max-w-[420px] items-center justify-center gap-5">
          <motion.span className="h-px flex-1 origin-right bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.7 }} />
          <span className="hero-date">{dp.d}<span className="mx-2 text-gold">·</span>{dp.m}<span className="mx-2 text-gold">·</span>20{dp.y}</span>
          <motion.span className="h-px flex-1 origin-left bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.7 }} />
        </motion.div>
        <motion.p {...fade(1.8)} className="mt-4 text-[11.5px] font-normal uppercase tracking-[.32em] text-kasavu">{config.hero.venueLine}</motion.p>
        <motion.p {...fade(1.9)} className="ml mt-1 text-[13.5px] text-[#E8D9BD]/85">കിഴക്കേ നട കല്യാണമണ്ഡപം · ഗുരുവായൂർ ശ്രീകൃഷ്ണ ക്ഷേത്രം</motion.p>
        <motion.p {...fade(2.05)} className="serif mx-auto mt-6 max-w-[34ch] text-[clamp(18px,2.4vw,23px)] italic text-champagne/90">{config.hero.tagline}</motion.p>
        <motion.div {...fade(2.2)} className="mt-6">
          <VilakkumadamRow className="mx-auto h-6 w-[260px] opacity-85 sm:w-[320px]" />
        </motion.div>
      </motion.div>

      <motion.div className="kasavu-band absolute inset-x-0 bottom-0 origin-center" aria-hidden="true" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.2 }} />
      <motion.a href="#invitation" className="scroll-cue" aria-label="Scroll to the invitation" initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ delay: 2.6, duration: 1 }}>
        Darshan<i />
      </motion.a>
    </header>
  )
}
