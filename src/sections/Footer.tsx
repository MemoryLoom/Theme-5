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
      <Backdrop src={config.backdrops.footer} distance={50} opacity={0.45} />

      {/* Swaying temple floral garlands in the corners */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} /></span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[700px]">
        <Reveal dir="none" scale={0.85}><Deepastambham className="mx-auto mb-4 h-24 w-14 text-kasavu" /></Reveal>

        {/* Unrolling Royal Temple Thank-You Scroll */}
        <RollingScroll variant="crimson" startAt={0.96} distance={0.32}>
          <div className="mx-auto max-w-[460px] py-4 text-center text-[#FFF8E8]">
            <div className="serif mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#f4d58a]/50 bg-[#2B1B12]/45 text-[30px] italic text-[#f4d58a]">
              <span>{mono[0]}</span><span className="mx-0.5 text-[16px] text-[#f4d58a]/80">&amp;</span><span>{mono[1]}</span>
            </div>
            <MayilpeeliFlute className="mx-auto mt-4 h-11 w-28" />
            <p className="ml mt-2 text-[clamp(14.5px,2.6vw,17.5px)] !font-semibold text-[#f4d58a]">
              ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ
            </p>
            <p className="mt-2.5 text-[11.5px] uppercase tracking-[.26em] text-[#EADBC0]/90">{f.message}</p>
            <p className="serif mt-3 text-[clamp(36px,7.5vw,64px)] font-light leading-none text-[#FFF8E8]">
              {first.name} <span className="serif-italic text-[#f4d58a]">&amp;</span> {second.name}
            </p>
            <p className="mt-4 text-[12.5px] tracking-[.36em] text-[#f4d58a]">{dp.d} · {dp.m} · 20{dp.y}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[.22em] text-[#EADBC0]/85">
              East Nada Kalyana Mandapam · Guruvayoor Sri Krishna Temple
            </p>
            <VilakkumadamRow className="mx-auto mt-5 h-6 w-[240px] opacity-90" />
          </div>
        </RollingScroll>

        <Ornament className="my-8" />
        <Reveal delay={0.08} className="flex flex-col items-center gap-6">
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
