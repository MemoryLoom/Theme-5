import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { WeddingEvent } from '../config/types'
import { ICalendar, IClock, INav, IPin } from '../components/ui/Icons'
import { Backdrop, ImageReveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { MediaImg } from '../components/ui/MediaImg'
import { MuralCorner, SadyaLeaf, VilakkumadamRow } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import { googleCalendarUrl, icsFile, mapsUrl } from '../lib/calendar'
import { longDate, timeOf, tzOf } from '../lib/date'
import { saveFile } from '../lib/files'

function CalendarMenu({ e, couple }: { e: WeddingEvent; couple: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { toast } = useSite()
  useEffect(() => {
    if (!open) return
    const h = (ev: PointerEvent) => { if (!ref.current?.contains(ev.target as Node)) setOpen(false) }
    window.addEventListener('pointerdown', h); return () => window.removeEventListener('pointerdown', h)
  }, [open])
  const ics = async () => {
    setOpen(false)
    const ok = await saveFile(`${e.id}.ics`, icsFile(e, couple), 'text/calendar')
    toast(ok ? 'Calendar file ready' : 'Download was blocked')
  }
  return (
    <div ref={ref} className="relative flex-1">
      <button className="btn btn-ghost w-full" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"><ICalendar />Calendar</button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-20 overflow-hidden rounded-2xl border border-gold/30 bg-bg3 text-left shadow-2xl"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}>
            <a role="menuitem" className="block px-4 py-3 text-[15px] text-champagne transition hover:bg-gold/10 hover:text-gold2" href={googleCalendarUrl(e, couple)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Google Calendar</a>
            <button role="menuitem" className="block w-full px-4 py-3 text-left text-[15px] text-champagne transition hover:bg-gold/10 hover:text-gold2" onClick={ics}>Apple / Outlook (.ics)</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventCard({ e, n, couple }: { e: WeddingEvent; n: number; couple: string }) {
  const day = new Date(e.start).toLocaleDateString('en-GB', { day: '2-digit', timeZone: tzOf(e.start) })
  const mon = new Date(e.start).toLocaleDateString('en-GB', { month: 'short', timeZone: tzOf(e.start) })
  return (
    <motion.article className="group card hoverable flex h-full flex-col overflow-hidden px-6 pb-7 pt-8 text-left backdrop-blur-[2px] sm:px-8"
      initial={{ opacity: 0, y: 60, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.15, ease: [0.22, 0.8, 0.24, 1], delay: 0.08 + ((n - 1) % 2) * 0.16 }} style={{ transformPerspective: 1200 }}>
      <motion.span className="absolute left-0 right-0 top-0 h-px origin-left bg-gradient-to-r from-gold via-gold2/60 to-transparent" aria-hidden="true"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 0.8, 0.24, 1], delay: 0.4 }} />
      {(e.image || e.art) && (
        <div className="-mx-6 -mt-8 mb-7 sm:-mx-8">
          <ImageReveal className="aspect-[16/10] !rounded-b-none !rounded-t-[22px]" from={n % 2 ? 'left' : 'right'} delay={0.15}>
            <div className="relative h-full w-full">
              {e.image ? <MediaImg src={e.image} alt={`${e.title}`} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                : <SadyaLeaf className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg2)] via-transparent to-transparent opacity-90" />
            </div>
          </ImageReveal>
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="label">{String(n).padStart(2, '0')} · {e.host || 'Celebration'}</div>
          {e.titleMl && <p className="ml mt-3 text-[clamp(24px,3vw,30px)] !font-semibold leading-tight text-kasavu">{e.titleMl}</p>}
          <h3 className={`serif ${e.titleMl ? 'mt-0' : 'mt-3'} text-[clamp(26px,3.2vw,34px)] font-light leading-tight text-ivory`}>{e.title}</h3>
        </div>
        <div className="shrink-0 rounded-2xl border border-gold/30 px-3.5 py-2 text-center">
          <div className="serif text-[30px] font-light leading-none text-gold2">{day}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[.25em] text-muted">{mon}</div>
        </div>
      </div>
      {e.intro && <p className="mt-4 text-[15px] leading-[1.85] text-muted">{e.intro}</p>}
      <div className="mt-5 border-t border-[var(--line-soft)] pt-3">
        <div className="ev-row">
          <span className="row-icon"><IClock /></span>
          <div className="min-w-0 flex-1">
            <div className="row-label">Date & time</div>
            <div className="row-value">{longDate(e.start)}</div>
            <div className="row-sub !text-champagne">{e.timeText || `${timeOf(e.start)} to ${timeOf(e.end)}`}</div>
            {e.subText && <div className="row-sub">{e.subText}</div>}
          </div>
        </div>
        <div className="ev-row">
          <span className="row-icon"><IPin /></span>
          <div className="min-w-0 flex-1">
            <div className="row-label">Venue</div>
            <div className="row-value">{e.venue}</div>
            {e.venueSub && <div className="row-sub">{e.venueSub}</div>}
          </div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
        <a className="btn btn-primary flex-1" href={mapsUrl(e)} target="_blank" rel="noopener noreferrer"><INav />Directions</a>
        <CalendarMenu e={e} couple={couple} />
      </div>
      <MuralCorner className="pointer-events-none absolute bottom-2 left-2 h-11 w-11 scale-y-[-1] opacity-55" />
      <MuralCorner className="pointer-events-none absolute bottom-2 right-2 h-11 w-11 scale-[-1] opacity-55" />
    </motion.article>
  )
}

export function Events() {
  const { config } = useSite()
  const { names } = useCouple()
  const ev = config.events
  if (!ev.items.length) return null
  return (
    <section className="section tone-dark overflow-hidden" id="events" aria-label="Wedding events">
      <Backdrop src={config.backdrops.events} distance={90} />
      <Seam />
      <div className="section-inner">
        <SectionHeading eyebrow={ev.eyebrow} title={ev.title} lede={ev.lede} />
        <VilakkumadamRow className="mx-auto -mt-8 mb-12 h-6 w-[280px] opacity-85" />
        <div className={`mx-auto grid max-w-[560px] gap-6 ${ev.items.length > 1 ? 'md:max-w-[1040px] md:grid-cols-2 md:gap-8' : ''}`}>
          {ev.items.map((e, i) => <EventCard key={e.id} e={e} n={i + 1} couple={names} />)}
        </div>
      </div>
    </section>
  )
}
