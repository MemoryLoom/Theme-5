import { motion, useReducedMotion } from 'framer-motion'
import { IPlay } from '../components/ui/Icons'
import { Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { useSite } from '../context/SiteContext'

export function LiveStream() {
  const { config } = useSite()
  const reduce = useReducedMotion()
  const l = config.live
  if (!l.enabled) return null
  const now = Date.now()
  const live = config.events.items.some((e) => now >= new Date(e.start).getTime() - 30 * 60_000 && now <= new Date(e.end).getTime())
  const url = l.url.trim()
  return (
    <section className="section tone-green" id="live" aria-label="Live stream">
      <Seam />
      <div className="section-inner">
        <SectionHeading eyebrow={l.eyebrow} title={l.title} />
        <Reveal className="card card-corner mx-auto max-w-[680px] px-6 py-12 sm:px-12" distance={40} scale={0.97}>
          <div className="relative mx-auto mb-8 grid h-[92px] w-[92px] place-items-center">
            {!reduce && [0, 1].map((k) => (
              <motion.span key={k} className="absolute inset-0 rounded-full border border-gold/50" aria-hidden="true"
                animate={{ scale: [1, 1.55], opacity: [0.6, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: k * 1.4 }} />
            ))}
            <span className="grid h-full w-full place-items-center rounded-full border border-gold bg-gold/10 text-gold2"><IPlay width={34} height={34} /></span>
          </div>
          {live && url && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e07a6a]/60 px-3.5 py-1.5 text-[10.5px] uppercase tracking-[.25em] text-[#f0a597]">
              <motion.span className="h-2 w-2 rounded-full bg-[#e07a6a]" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />Live now
            </div>
          )}
          <p className="mx-auto max-w-[46ch] text-[clamp(15px,1.7vw,17px)] leading-[1.9] text-muted">{l.caption}</p>
          <div className="mt-9">
            {url ? (
              <a className="btn btn-primary !px-8 !py-[18px]" href={url} target="_blank" rel="noopener noreferrer"><IPlay />{l.buttonLabel}</a>
            ) : (
              <button className="btn btn-primary !px-8 !py-[18px]" disabled aria-describedby="live-soon"><IPlay />{l.buttonLabel}</button>
            )}
          </div>
          <p id="live-soon" className="mt-5 text-[11px] uppercase tracking-[.28em] text-gold">
            {url ? `Streaming on ${l.platform || 'the web'}` : `${l.platform ? l.platform + ' · ' : ''}The link will appear here on the day`}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
