import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { WeddingEvent } from '../config/types'
import { ICalendar, IClock, INav, IPin } from '../components/ui/Icons'
import { Backdrop, ImageReveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { RollingScroll, SectionFlowerRain } from '../components/ui/RollingScroll'
import { MediaImg } from '../components/ui/MediaImg'
import { SadyaLeaf, VilakkumadamRow } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import { googleCalendarUrl, icsFile, mapsUrl } from '../lib/calendar'
import { longDate, timeOf, tzOf } from '../lib/date'
import { saveFile } from '../lib/files'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'

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
      <button className="btn btn-ghost w-full !border-[#f4d58a]/45 !text-[#FFF8E8] hover:!bg-[#f4d58a]/15" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"><ICalendar />Calendar</button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-20 overflow-hidden rounded-2xl border border-gold/40 bg-[#2B1B12] text-left shadow-2xl"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}>
            <a role="menuitem" className="block px-4 py-3 text-[14.5px] text-[#FFF8E8] transition hover:bg-gold/15 hover:text-kasavu" href={googleCalendarUrl(e, couple)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Google Calendar</a>
            <button role="menuitem" className="block w-full px-4 py-3 text-left text-[14.5px] text-[#FFF8E8] transition hover:bg-gold/15 hover:text-kasavu" onClick={ics}>Apple / Outlook (.ics)</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventScrollCard({ e, n, couple }: { e: WeddingEvent; n: number; couple: string }) {
  const day = new Date(e.start).toLocaleDateString('en-GB', { day: '2-digit', timeZone: tzOf(e.start) })
  const mon = new Date(e.start).toLocaleDateString('en-GB', { month: 'short', timeZone: tzOf(e.start) })
  return (
    <RollingScroll variant="crimson" startAt={0.9} distance={0.58} className="!w-full">
      <article className="flex flex-col text-left text-[#FFF8E8]">
        {(e.image || e.art) && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-[#f4d58a]/45 shadow-lg">
            <ImageReveal className="aspect-[16/10] !rounded-2xl" from={n % 2 ? 'left' : 'right'} delay={0.1}>
              <div className="relative h-full w-full">
                {e.image ? <MediaImg src={e.image} alt={e.title} className="h-full w-full object-cover" />
                  : <SadyaLeaf className="h-full w-full" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a0911]/80 via-transparent to-transparent" />
              </div>
            </ImageReveal>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[.26em] text-[#f4d58a]">
              {String(n).padStart(2, '0')} · {e.host || 'Guruvayoor Sannidhi'}
            </div>
            {e.titleMl && <p className="ml mt-2 text-[clamp(21px,2.8vw,27px)] !font-semibold leading-tight text-[#f4d58a]">{e.titleMl}</p>}
            <h3 className={`serif ${e.titleMl ? 'mt-0.5' : 'mt-2'} text-[clamp(24px,3vw,32px)] font-normal leading-tight text-[#FFF8E8]`}>{e.title}</h3>
          </div>
          <div className="shrink-0 rounded-2xl border border-[#f4d58a]/45 bg-[#2B1B12]/45 px-3.5 py-2 text-center">
            <div className="serif text-[28px] font-normal leading-none text-[#f4d58a]">{day}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[.25em] text-[#EADBC0]">{mon}</div>
          </div>
        </div>

        {e.intro && <p className="mt-3.5 text-[14.5px] leading-[1.8] text-[#FFF8E8]/90">{e.intro}</p>}

        <div className="mt-4 border-t border-[#f4d58a]/25 pt-3">
          <div className="ev-row">
            <span className="row-icon !border-[#f4d58a]/40 !bg-[#2B1B12]/40 !text-[#f4d58a]"><IClock /></span>
            <div className="min-w-0 flex-1">
              <div className="row-label !text-[#f4d58a]">Muhurtham &amp; Time</div>
              <div className="row-value !text-[#FFF8E8]">{longDate(e.start)}</div>
              <div className="row-sub !text-[#f4d58a]">{e.timeText || `${timeOf(e.start)} to ${timeOf(e.end)}`}</div>
              {e.subText && <div className="row-sub !text-[#EADBC0]/85">{e.subText}</div>}
            </div>
          </div>
          <div className="ev-row">
            <span className="row-icon !border-[#f4d58a]/40 !bg-[#2B1B12]/40 !text-[#f4d58a]"><IPin /></span>
            <div className="min-w-0 flex-1">
              <div className="row-label !text-[#f4d58a]">Temple Venue</div>
              <div className="row-value !text-[#FFF8E8]">{e.venue}</div>
              {e.venueSub && <div className="row-sub !text-[#EADBC0]/85">{e.venueSub}</div>}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <a className="btn btn-primary flex-1 !bg-[#f4d58a] !text-[#2B1B12]" href={mapsUrl(e)} target="_blank" rel="noopener noreferrer"><INav />Directions</a>
          <CalendarMenu e={e} couple={couple} />
        </div>
      </article>
    </RollingScroll>
  )
}

export function Events() {
  const { config } = useSite()
  const { names } = useCouple()
  const ev = config.events
  const secRef = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = secRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!ev.items.length) return null
  return (
    <section ref={secRef} className="section tone-dark overflow-hidden" id="events" aria-label="Wedding ceremonies at Guruvayoor">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Backdrop src={config.backdrops.events} distance={90} opacity={0.55} />
      <Seam />

      {/* Sticky 4-corner temple floral frame & falling marigold/dahlia flowers (from lovewed EventSection) */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.2s' }} /></span>
          <span className="sway-corner sway-corner--bl"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-2.4s' }} /></span>
          <span className="sway-corner sway-corner--br"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-3.6s' }} /></span>
          <SectionFlowerRain paused={paused} />
        </div>
      </div>

      <div className="section-inner relative z-10">
        <SectionHeading eyebrow={ev.eyebrow} title={ev.title} lede={ev.lede} />
        <VilakkumadamRow className="mx-auto -mt-8 mb-10 h-6 w-[280px] opacity-85" />
        <div className={`mx-auto grid max-w-[580px] items-start gap-8 ${ev.items.length > 1 ? 'lg:max-w-[1100px] lg:grid-cols-2 lg:gap-10' : ''}`}>
          {ev.items.map((e, i) => <EventScrollCard key={e.id} e={e} n={i + 1} couple={names} />)}
        </div>
      </div>
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
