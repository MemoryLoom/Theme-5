import { motion } from 'framer-motion'
import { Backdrop, Ornament, Reveal, TextReveal } from '../components/ui/Reveal'
import { Nilavilakku } from '../components/decor/Kerala'
import { IFacebook, IGlobe, IInstagram, IPause, IPlay, IWhatsapp, IYoutube } from '../components/ui/Icons'
import { useCouple, useSite } from '../context/SiteContext'
import { useMusic } from '../music/MusicContext'
import { dateParts } from '../lib/date'

const ICONS = { whatsapp: IWhatsapp, instagram: IInstagram, website: IGlobe, facebook: IFacebook, youtube: IYoutube }

export function Footer() {
  const { config } = useSite()
  const { first, second, mono } = useCouple()
  const m = useMusic()
  const f = config.footer
  const dp = dateParts(config.wedding.start)
  return (
    <footer className="footer tone-dark">
      <Backdrop src={config.backdrops.footer} distance={60} />
      <div className="kasavu-band absolute inset-x-0 top-0" aria-hidden="true" />
            <Reveal dir="none" scale={0.8}><Nilavilakku className="mx-auto mb-6 h-16 w-10 text-kasavu" flames={5} /></Reveal>
      <Reveal className="serif mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 text-[34px] italic text-gold2" scale={0.8} dir="none">
        <span>{mono[0]}</span><span className="mx-0.5 text-[18px] text-gold/80">&amp;</span><span>{mono[1]}</span>
      </Reveal>
      <Reveal delay={0.1}><p className="ml mt-10 text-[18px] text-kasavu">{config.invitation.inviteMl}</p><p className="mt-2 text-[13px] uppercase tracking-[.3em] text-muted">{f.message}</p></Reveal>
      <TextReveal as="p" text={`${first.name} *&* ${second.name}`} className="serif mt-4 text-[clamp(44px,9vw,84px)] font-light leading-none text-ivory" delay={0.15} />
      <Reveal delay={0.3}><p className="mt-5 text-[13px] tracking-[.4em] text-gold2">{dp.d} · {dp.m} · 20{dp.y}</p></Reveal>
      <Ornament className="my-12" />
      <Reveal delay={0.1} className="flex flex-col items-center gap-8">
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
        {f.creatorName && (
          <div className="text-[10.5px] uppercase tracking-[.36em] text-muted/60">
            Invitation crafted by {f.creatorUrl ? <a href={f.creatorUrl} target="_blank" rel="noopener noreferrer" className="text-gold transition hover:text-gold2">{f.creatorName}</a> : f.creatorName}
          </div>
        )}
      </Reveal>
    </footer>
  )
}
