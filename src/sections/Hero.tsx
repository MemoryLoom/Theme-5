import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useIsSmall } from '../components/ui/Reveal'
import { MediaImg } from '../components/ui/MediaImg'
import { Deepastambham, MayilpeeliFlute, TempleFrame, VilakkumadamRow } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import { dateParts } from '../lib/date'
import floralCorner from '../assets/photos/floral-corner.webp'
import bottomFlower from '../assets/photos/temple-bottom-flower.webp'

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
  const contentO = useTransform(scrollYProgress, [0, 0.78], [1, reduce ? 1 : 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 160 * k])
  const glowS = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.25 * k])
  const dp = dateParts(config.wedding.start)
  const fade = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: opened ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.3, ease: EASE, delay: d } })

  // Drive --o and --t scroll variables for the foreground floral garland parallax (matching lovewed HeroSection)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const o = Math.min(Math.max(el.getBoundingClientRect().bottom - vh, 0), vh)
      const top = -el.getBoundingClientRect().top
      const t = Math.min(Math.max((top - 0.1 * vh) / (0.3 * vh), 0), 1)
      el.style.setProperty('--o', String(o))
      el.style.setProperty('--t', String(t))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

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

      {/* Swaying temple floral garlands in top corners */}
      <span className="sway-corner sway-corner--tl opacity-90" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" />
      </span>
      <span className="sway-corner sway-corner--tr opacity-90" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} />
      </span>

      {/* Flanking East Nada Deepastambham brass lamp towers inside the temple courtyard */}
      <motion.div className="pointer-events-none absolute bottom-16 left-[5vw] hidden text-kasavu/65 lg:block"
        initial={{ opacity: 0, y: 24 }} animate={opened ? { opacity: 0.85, y: 0 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.6 }}>
        <Deepastambham className="h-[240px] w-[108px]" />
      </motion.div>
      <motion.div className="pointer-events-none absolute bottom-16 right-[5vw] hidden text-kasavu/65 lg:block"
        initial={{ opacity: 0, y: 24 }} animate={opened ? { opacity: 0.85, y: 0 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.6 }}>
        <Deepastambham className="h-[240px] w-[108px]" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentO }} className="relative z-10 px-2">
        {guestName && <motion.p {...fade(0.25)} className="serif mb-4 text-[20px] italic text-champagne">Dear {guestName},</motion.p>}
        <motion.div {...fade(0.3)}>
          <MayilpeeliFlute className="mx-auto mb-2 h-12 w-32" />
        </motion.div>
        <motion.p {...fade(0.35)} className="ml-blessing mb-3 !text-kasavu">{config.hero.blessingMl}</motion.p>
        <motion.div {...fade(0.5)} className="eyebrow">{config.hero.eyebrow}</motion.div>

        {/* Couple names with lovewed doorsOpen clip-path + scale + blur reveal */}
        <h1 className="hero-names">
          <span className={`block ${opened ? 'hero-doors-open' : 'opacity-0'}`} style={{ animationDelay: '0.45s' }}>
            {first.name}
          </span>
          <motion.span className="hero-amp" initial={{ opacity: 0, scale: 0.6 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.05 }}>
            &amp;
          </motion.span>
          <span className={`block ${opened ? 'hero-doors-open' : 'opacity-0'}`} style={{ animationDelay: '1.25s' }}>
            {second.name}
          </span>
        </h1>

        {(first.nameMl || second.nameMl) && (
          <motion.p {...fade(1.45)} className="ml mt-4 text-[clamp(16px,2.6vw,20px)] text-[#E8D9BD]">{first.nameMl} <span className="text-kasavu">&amp;</span> {second.nameMl}</motion.p>
        )}
        <motion.div {...fade(1.6)} className="mx-auto mt-7 flex max-w-[420px] items-center justify-center gap-5">
          <motion.span className="h-px flex-1 origin-right bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.75 }} />
          <span className="hero-date">{dp.d}<span className="mx-2 text-gold">·</span>{dp.m}<span className="mx-2 text-gold">·</span>20{dp.y}</span>
          <motion.span className="h-px flex-1 origin-left bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 1.75 }} />
        </motion.div>
        <motion.p {...fade(1.85)} className="mt-4 text-[11.5px] font-normal uppercase tracking-[.32em] text-kasavu">{config.hero.venueLine}</motion.p>
        <motion.p {...fade(1.95)} className="ml mt-1 text-[13.5px] text-[#E8D9BD]/85">കിഴക്കേ നട കല്യാണമണ്ഡപം · ഗുരുവായൂർ ശ്രീകൃഷ്ണ ക്ഷേത്രം</motion.p>
        <motion.p {...fade(2.1)} className="serif mx-auto mt-5 max-w-[34ch] text-[clamp(18px,2.4vw,23px)] italic text-champagne/90">{config.hero.tagline}</motion.p>
        <motion.div {...fade(2.25)} className="mt-5">
          <VilakkumadamRow className="mx-auto h-6 w-[260px] opacity-85 sm:w-[320px]" />
        </motion.div>
      </motion.div>

      {/* Scroll-reactive foreground temple floral arch at the bottom of the hero */}
      <img src={bottomFlower} alt="" aria-hidden="true" className="hero-bottom-garland" decoding="async" />

      <motion.div className="kasavu-band absolute inset-x-0 bottom-0 z-10 origin-center" aria-hidden="true" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 1.2 }} />
      <motion.a href="#invitation" className="scroll-cue z-10" aria-label="Scroll to the invitation" initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ delay: 2.6, duration: 1 }}>
        Darshan<i />
      </motion.a>
    </header>
  )
}
