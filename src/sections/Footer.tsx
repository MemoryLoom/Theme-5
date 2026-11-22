import { motion } from 'framer-motion'
import { Backdrop, Ornament, Reveal } from '../components/ui/Reveal'
import { RollingScroll } from '../components/ui/RollingScroll'
import { Deepastambham, MayilpeeliFlute, VilakkumadamRow } from '../components/decor/Kerala'
import { IFacebook, IGlobe, IInstagram, IPause, IPlay, IWhatsapp, IYoutube } from '../components/ui/Icons'
import { useCouple, useSite } from '../context/SiteContext'
import { useMusic } from '../music/MusicContext'
import { dateParts } from '../lib/date'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'

const ICONS = { whatsapp: IWhatsapp, instagram: IInstagram, website: IGlobe, facebook: IFacebook, youtube: IYoutube }

export function Footer() {
  const { config } = useSite()
  const { first, second, mono } = useCouple()
  const m = useMusic()
  const f = config.footer
  const dp = dateParts(config.wedding.start)
  return (
    <footer className="footer tone-dark relative overflow-hidden" id="thankyou">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Backdrop src={config.backdrops.footer} distance={60} opacity={0.45} />

      {/* Swaying temple floral garlands in the corners */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} /></span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[740px]">
        <Reveal dir="none" scale={0.8}><Deepastambham className="mx-auto mb-4 h-24 w-14 text-kasavu" /></Reveal>

        {/* Unrolling Royal Temple Thank-You Scroll (lovewed ThankYouSection style) */}
        <RollingScroll variant="crimson" startAt={0.92} distance={0.55}>
          <div className="py-3 text-center text-[#FFF8E8]">
            <div className="serif mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#f4d58a]/50 bg-[#2B1B12]/45 text-[30px] italic text-[#f4d58a]">
              <span>{mono[0]}</span><span className="mx-0.5 text-[16px] text-[#f4d58a]/80">&amp;</span><span>{mono[1]}</span>
            </div>
            <MayilpeeliFlute className="mx-auto mt-4 h-11 w-28" />
            <p className="ml mt-2 text-[clamp(15px,2.8vw,18px)] !font-semibold text-[#f4d58a]">
              ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ
            </p>
            <p className="mt-2 text-[12px] uppercase tracking-[.28em] text-[#EADBC0]/90">{f.message}</p>
            <p className="serif mt-3 text-[clamp(38px,8vw,68px)] font-light leading-none text-[#FFF8E8]">
              {first.name} <span className="serif-italic text-[#f4d58a]">&amp;</span> {second.name}
            </p>
            <p className="mt-4 text-[13px] tracking-[.38em] text-[#f4d58a]">{dp.d} · {dp.m} · 20{dp.y}</p>
            <p className="mt-1.5 text-[10.5px] uppercase tracking-[.26em] text-[#EADBC0]/85">
              East Nada Kalyana Mandapam · Guruvayoor Sri Krishna Temple
            </p>
            <VilakkumadamRow className="mx-auto mt-5 h-6 w-[250px] opacity-90" />
          </div>
        </RollingScroll>

        <Ornament className="my-8" />
        <Reveal delay={0.1} className="flex flex-col items-center gap-6">
          {config.music.enabled && m.track && (
            <motion.button onClick={m.toggle} whileTap={{ scale: 0.96 }} className="btn btn-ghost" aria-label={m.playing ? 'Pause music' : 'Play music'}>
              {m.playing ? <IPause /> : <IPlay />}{m.playing ? 'Now playing' : 'Play music'} · {m.track.title}
            </motion.button>
          )}
          {f.socials.length > 0 && (
            <div className="flex justify-center gap-3">
              {f.socials.map((s) => { const I = ICONS[s.kind] ?? IGlobe; return <a key={s.kind + s.url} className="social" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.kind}><I /></a> })}
            </div>
          )}
        </Reveal>
      </div>
    </footer>
  )
}
