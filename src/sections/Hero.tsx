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
  const k = reduce ? 0 : small ? 0.45 : 1
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90 * k])
  const contentO = useTransform(scrollYProgress, [0, 0.82], [1, reduce ? 1 : 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 130 * k])
  const glowS = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.2 * k])
  const dp = dateParts(config.wedding.start)
  const fade = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: opened ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, ease: EASE, delay: d } })

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
      <motion.div className="hero-glow" style={{ y: glowY, scale: glowS }} initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ duration: 1.8 }} />
      {config.hero.image && (
        <motion.div className="hero-photo" style={{ y: glowY }} initial={{ opacity: 0, scale: 1.1 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 2.4, ease: EASE }} aria-hidden="true">
          <MediaImg src={config.hero.image} alt="" loading="eager" className="h-full w-full object-cover" />
        </motion.div>
      )}
      <div className="hero-shade" aria-hidden="true" />
      <TempleFrame play={opened} />

      {/* Swaying temple floral garlands in top corners */}
      <span className="sway-corner sway-corner--tl opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" />
      </span>
      <span className="sway-corner sway-corner--tr opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} />
      </span>

      {/* Flanking East Nada Deepastambham brass lamp towers inside the temple courtyard */}
      <motion.div className="pointer-events-none absolute bottom-16 left-[4vw] hidden text-kasavu/60 xl:block"
        initial={{ opacity: 0, y: 20 }} animate={opened ? { opacity: 0.8, y: 0 } : {}} transition={{ duration: 1.3, ease: EASE, delay: 0.9 }}>
        <Deepastambham className="h-[230px] w-[104px]" />
      </motion.div>
      <motion.div className="pointer-events-none absolute bottom-16 right-[4vw] hidden text-kasavu/60 xl:block"
        initial={{ opacity: 0, y: 20 }} animate={opened ? { opacity: 0.8, y: 0 } : {}} transition={{ duration: 1.3, ease: EASE, delay: 0.9 }}>
        <Deepastambham className="h-[230px] w-[104px]" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentO }} className="relative z-10 mx-auto max-w-[680px] px-4">
        {guestName && <motion.p {...fade(0.1)} className="serif mb-3 text-[20px] italic text-champagne">Dear {guestName},</motion.p>}
        <motion.div {...fade(0.15)}>
          <MayilpeeliFlute className="mx-auto mb-1.5 h-11 w-28" />
        </motion.div>
        <motion.p {...fade(0.2)} className="ml-blessing mb-2.5 !text-kasavu">{config.hero.blessingMl}</motion.p>
        <motion.div {...fade(0.3)} className="eyebrow">{config.hero.eyebrow}</motion.div>

        {/* Couple names with lovewed doorsOpen clip-path + scale + blur reveal */}
        <h1 className="hero-names">
          <span className={`block ${opened ? 'hero-doors-open' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
            {first.name}
          </span>
          <motion.span className="hero-amp" initial={{ opacity: 0, scale: 0.6 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.95, ease: EASE, delay: 0.55 }}>
            &amp;
          </motion.span>
          <span className={`block ${opened ? 'hero-doors-open' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
            {second.name}
          </span>
        </h1>

        {(first.nameMl || second.nameMl) && (
          <motion.p {...fade(0.85)} className="ml mt-3.5 text-[clamp(16px,2.5vw,20px)] text-[#E8D9BD]">{first.nameMl} <span className="text-kasavu">&amp;</span> {second.nameMl}</motion.p>
        )}
        <motion.div {...fade(0.95)} className="mx-auto mt-6 flex max-w-[380px] items-center justify-center gap-4">
          <motion.span className="h-px flex-1 origin-right bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.0, ease: EASE, delay: 1.0 }} />
          <span className="hero-date">{dp.d}<span className="mx-2 text-gold">·</span>{dp.m}<span className="mx-2 text-gold">·</span>20{dp.y}</span>
          <motion.span className="h-px flex-1 origin-left bg-gold/50" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.0, ease: EASE, delay: 1.0 }} />
        </motion.div>
        <motion.p {...fade(1.05)} className="mt-4 text-[11px] font-normal uppercase tracking-[.28em] text-kasavu">{config.hero.venueLine}</motion.p>
        <motion.p {...fade(1.12)} className="ml mt-1 text-[13.5px] text-[#E8D9BD]/90">കിഴക്കേ നട കല്യാണമണ്ഡപം · ഗുരുവായൂർ ശ്രീകൃഷ്ണ ക്ഷേത്രം</motion.p>
        <motion.p {...fade(1.2)} className="serif mx-auto mt-4 max-w-[34ch] text-[clamp(17.5px,2.3vw,22px)] italic text-champagne/90">{config.hero.tagline}</motion.p>
        <motion.div {...fade(1.3)} className="mt-4">
          <VilakkumadamRow className="mx-auto h-6 w-[250px] opacity-85 sm:w-[300px]" />
        </motion.div>
      </motion.div>

      {/* Subtle scroll-reactive foreground temple floral arch at the bottom of the hero */}
      <img src={bottomFlower} alt="" aria-hidden="true" className="hero-bottom-garland" decoding="async" />

      <motion.div className="kasavu-band absolute inset-x-0 bottom-0 z-10 origin-center" aria-hidden="true" initial={{ scaleX: 0 }} animate={opened ? { scaleX: 1 } : {}} transition={{ duration: 1.3, ease: EASE, delay: 0.8 }} />
      <motion.a href="#invitation" className="scroll-cue z-10" aria-label="Scroll to the invitation" initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ delay: 1.4, duration: 0.8 }}>
        Darshan<i />
      </motion.a>
    </header>
  )
}
