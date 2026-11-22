import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { Rsvp as RsvpRec } from '../config/types'
import { IBed, ICheck } from '../components/ui/Icons'
import { Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { JasmineStrand } from '../components/decor/Kerala'
import { SectionFlowerRain } from '../components/ui/RollingScroll'
import { useSite } from '../context/SiteContext'
import { dayLabel, shortDate } from '../lib/date'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'

type Errors = Partial<Record<'name' | 'events' | 'rooms' | 'dates' | 'form', string>>

function Counter({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-2.5" role="group" aria-label={label}>
      <button type="button" className="mini-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>−</button>
      <motion.span key={value} className="mini-count" initial={{ scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} aria-live="polite">{value}</motion.span>
      <button type="button" className="mini-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>+</button>
    </div>
  )
}

function Step({ n, label, children, htmlFor }: { n: number; label: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="mb-8">
      <label className="field-label" htmlFor={htmlFor}><span className="field-num">{n}</span>{label}</label>
      {children}
    </div>
  )
}

const Collapse = ({ show, children }: { show: boolean; children: ReactNode }) => (
  <AnimatePresence initial={false}>
    {show && (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 0.8, 0.24, 1] }} style={{ overflow: 'hidden' }}>
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

function Summary({ r, onEdit, title, sub }: { r: RsvpRec; onEdit: () => void; title: string; sub: string }) {
  const { config } = useSite()
  const evs = config.events.items.filter((e) => (r.events[e.id] ?? 0) > 0)
  return (
    <motion.div className="card card-corner mx-auto max-w-[560px] px-6 py-10 text-left sm:px-10" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, ease: [0.22, 0.8, 0.24, 1] }}>
      <div className="mb-5 border-b border-dashed border-[var(--line-soft)] pb-5 text-center">
        <motion.div className="mx-auto mb-4 grid h-[64px] w-[64px] place-items-center rounded-full border border-gold text-gold2" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.path d="M5 12.5 10 17 19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.45 }} />
          </svg>
        </motion.div>
        <h3 className="m-0 serif text-[34px] font-light text-ivory">{title}</h3>
        <p className="mt-2 text-[15px] text-muted">{sub}</p>
      </div>
      <dl className="m-0">
        <div className="border-b border-dashed border-[var(--line-soft)] py-2.5"><dt className="cell-k">Name</dt><dd className="serif m-0 text-[20px] text-ivory">{r.name}</dd></div>
        <div className="border-b border-dashed border-[var(--line-soft)] py-2.5"><dt className="cell-k">Attending</dt><dd className="serif m-0 text-[20px] text-ivory">{r.attending ? 'Joyfully accepts' : 'Regretfully declines'}</dd></div>
        {r.attending && evs.length > 0 && (
          <div className="border-b border-dashed border-[var(--line-soft)] py-2.5"><dt className="cell-k">Events</dt>
            <dd className="m-0 mt-1 flex flex-wrap gap-1.5">{evs.map((e) => <span key={e.id} className="tag">{e.title} · {r.events[e.id]}</span>)}</dd></div>
        )}
        {r.attending && r.needsRooms && (
          <div className="border-b border-dashed border-[var(--line-soft)] py-2.5"><dt className="cell-k">Stay</dt>
            <dd className="serif m-0 text-[20px] text-ivory">{r.rooms} room{r.rooms > 1 ? 's' : ''} · {r.checkIn && dayLabel(r.checkIn)} → {r.checkOut && dayLabel(r.checkOut)}</dd></div>
        )}
        {r.notes && <div className="py-2.5"><dt className="cell-k">Note</dt><dd className="m-0 text-[15px] text-muted">{r.notes}</dd></div>}
      </dl>
      <button className="btn btn-ghost mt-6 w-full" onClick={onEdit}>Edit response</button>
    </motion.div>
  )
}

export function Rsvp() {
  const { config, store, guestName, toast } = useSite()
  const c = config.rsvp
  const events = config.events.items
  const uid = useId()
  const [mode, setMode] = useState<'loading' | 'form' | 'done' | 'existing'>('loading')
  const [saved, setSaved] = useState<RsvpRec | null>(null)
  const [name, setName] = useState(guestName)
  const [attending, setAttending] = useState(true)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [needsRooms, setNeedsRooms] = useState(false)
  const [rooms, setRooms] = useState(1)
  const [checkIn, setCheckIn] = useState(c.rooms.checkIn)
  const [checkOut, setCheckOut] = useState(c.rooms.checkOut)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const load = (r: RsvpRec) => {
    setName(r.name); setAttending(r.attending); setCounts(r.events || {}); setNeedsRooms(r.needsRooms)
    setRooms(r.rooms || 1); setCheckIn(r.checkIn || c.rooms.checkIn); setCheckOut(r.checkOut || c.rooms.checkOut); setNotes(r.notes || '')
  }

  useEffect(() => {
    if (!store) return
    let alive = true
    store.myRsvp().then((r) => { if (!alive) return; if (r) { setSaved(r); load(r); setMode('existing') } else setMode('form') }).catch(() => alive && setMode('form'))
    return () => { alive = false }
  }, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  const pastDeadline = useMemo(() => new Date(c.deadline + 'T23:59:59') < new Date(), [c.deadline])
  if (!c.enabled) return null

  const toggleEvent = (id: string) => setCounts((m) => ({ ...m, [id]: (m[id] ?? 0) > 0 ? 0 : 1 }))
  const setCount = (id: string, n: number) => setCounts((m) => ({ ...m, [id]: n }))
  const chosen = events.filter((e) => (counts[e.id] ?? 0) > 0)

  function validate(): Errors {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = 'Please enter your name.'
    if (attending && !chosen.length) e.events = 'Choose at least one event you will attend.'
    if (attending && c.rooms.enabled && needsRooms) {
      if (rooms < 1) e.rooms = 'Choose how many rooms you need.'
      if (!checkIn || !checkOut) e.dates = 'Please choose check-in and check-out dates.'
      else if (checkOut <= checkIn) e.dates = 'Check-out must be after check-in.'
    }
    return e
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate(); setErrors(e)
    if (Object.keys(e).length) {
      const first = document.querySelector<HTMLElement>(`[data-err="${Object.keys(e)[0]}"]`)
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' }); first?.querySelector<HTMLElement>('input,button')?.focus({ preventScroll: true })
      return
    }
    if (!store) return
    setBusy(true)
    try {
      const rec = await store.submitRsvp({
        name: name.trim(), attending,
        events: attending ? Object.fromEntries(chosen.map((x) => [x.id, counts[x.id]])) : {},
        needsRooms: attending && c.rooms.enabled && needsRooms, rooms: attending && needsRooms ? rooms : 0,
        checkIn: attending && needsRooms ? checkIn : undefined, checkOut: attending && needsRooms ? checkOut : undefined, notes: notes.trim(),
      })
      setSaved(rec); setMode('done')
      document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setErrors({ form: (err as Error).message || 'Something went wrong. Please try again.' })
      toast('Could not send RSVP')
    } finally { setBusy(false) }
  }

  let step = 1
  return (
    <section className="section tone-light weave overflow-hidden" id="rsvp" aria-label="RSVP">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Seam />
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.5s' }} /></span>
          {mode === 'done' && <SectionFlowerRain />}
        </div>
      </div>
      <div className="section-inner relative z-10">
        <SectionHeading eyebrow="RSVP" title={c.title} lede={c.copy} />
        {guestName && mode === 'form' && <Reveal><p className="serif -mt-8 mb-10 text-[21px] italic text-gold2">We hope to see you, {guestName}.</p></Reveal>}

        <AnimatePresence mode="wait">
          {mode === 'loading' && (
            <motion.div key="l" className="py-10" exit={{ opacity: 0 }}><span className="loader-dots" aria-label="Loading"><span /><span /><span /></span></motion.div>
          )}
          {(mode === 'done' || mode === 'existing') && saved && (
            <Summary key="s" r={saved} onEdit={() => { load(saved); setMode('form') }}
              title={mode === 'done' ? (saved.attending ? 'Thank you!' : 'Thank you for letting us know') : 'Your response'}
              sub={mode === 'done' ? (saved.attending ? 'We can’t wait to celebrate with you.' : 'You will be missed — thank you for your blessings.') : `Received ${shortDate(saved.updatedAt)} · you can update it any time`} />
          )}
          {mode === 'form' && (
            <motion.form key="f" noValidate onSubmit={submit} className="card card-corner relative mx-auto max-w-[620px] px-5 py-9 text-left sm:px-10 sm:py-11"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5 }}>
              <JasmineStrand className="pointer-events-none absolute -top-3 left-1/2 h-7 w-[240px] -translate-x-1/2" />
              <p className="label mb-8 text-center !text-maroon">
                {pastDeadline ? 'The RSVP date has passed — we’d still love to hear from you' : `Kindly respond by ${shortDate(c.deadline)}`}
              </p>

              <div data-err="name"><Step n={step++} label="Your name" htmlFor={`${uid}-name`}>
                <input id={`${uid}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" autoComplete="name" maxLength={80}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} />
                {errors.name && <p id={`${uid}-name-err`} className="field-error" role="alert">{errors.name}</p>}
              </Step></div>

              <Step n={step++} label="Will you attend?">
                <div className="flex gap-2.5" role="radiogroup" aria-label="Will you attend?">
                  <button type="button" role="radio" aria-checked={attending} className={`toggle-btn ${attending ? 'on' : ''}`} onClick={() => setAttending(true)}>Joyfully accept</button>
                  <button type="button" role="radio" aria-checked={!attending} className={`toggle-btn ${!attending ? 'on' : ''}`} onClick={() => setAttending(false)}>Regretfully decline</button>
                </div>
              </Step>

              <Collapse show={attending}>
                <div data-err="events"><Step n={step++} label="Which events, and how many?">
                  <div className="space-y-2.5">
                    {events.map((e) => {
                      const on = (counts[e.id] ?? 0) > 0
                      return (
                        <div key={e.id} className={`pick ${on ? 'on' : ''}`}>
                          <label className="chk">
                            <input type="checkbox" checked={on} onChange={() => toggleEvent(e.id)} />
                            <span className="flex-1"><span className="serif block text-[20px] text-ivory">{e.title}{e.titleMl && <span className="ml ml-2 text-[14px] text-gold">{e.titleMl}</span>}</span>
                              <span className="mt-0.5 block text-[13.5px] text-muted">{e.rsvpLabel || `${shortDate(e.start)} · ${e.venue}`}</span></span>
                          </label>
                          <Collapse show={on}>
                            <div className="flex items-center justify-between gap-3 border-t border-dashed border-[var(--line-soft)] px-4 pb-3 pt-3">
                              <span className="text-[10px] uppercase tracking-[.2em] text-gold">Guests (incl. you)</span>
                              <Counter value={counts[e.id] || 1} min={1} max={c.maxGuestsPerEvent} onChange={(n) => setCount(e.id, n)} label={`guests for ${e.title}`} />
                            </div>
                          </Collapse>
                        </div>
                      )
                    })}
                  </div>
                  {errors.events && <p className="field-error" role="alert">{errors.events}</p>}
                </Step></div>

                {c.rooms.enabled && (
                  <div data-err="rooms"><Step n={step++} label="Do you need a hotel room?">
                    <div className="pick">
                      <p className="m-0 px-4 pb-3 pt-4 text-[14.5px] leading-relaxed text-muted"><IBed className="mr-1.5 inline h-4 w-4 align-[-3px] text-gold" />{c.rooms.note}</p>
                      <div className="flex flex-wrap gap-2 px-4 pb-3">
                        <div className="cell"><span className="cell-k">Check-in</span><span className="cell-v">{dayLabel(c.rooms.checkIn)}</span></div>
                        <div className="cell"><span className="cell-k">Check-out</span><span className="cell-v">{dayLabel(c.rooms.checkOut)}</span></div>
                      </div>
                      {c.rooms.details.length > 0 && <ul className="ticks m-0 px-4 pb-2">{c.rooms.details.map((d) => <li key={d}>{d}</li>)}</ul>}
                      <label className="chk border-t border-dashed border-[var(--line-soft)]">
                        <input type="checkbox" checked={needsRooms} onChange={(e) => setNeedsRooms(e.target.checked)} />
                        <span>Yes, please reserve a room for us</span>
                      </label>
                      <Collapse show={needsRooms}>
                        <div className="space-y-3 border-t border-dashed border-[var(--line-soft)] px-4 pb-3.5 pt-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] uppercase tracking-[.2em] text-gold">Number of rooms</span>
                            <Counter value={rooms} min={1} max={c.rooms.maxRooms} onChange={setRooms} label="rooms" />
                          </div>
                          <div className="grid grid-cols-2 gap-2" data-err="dates">
                            <label className="block"><span className="cell-k mb-1">Check-in</span>
                              <input type="date" className="input !py-2 !text-[16px]" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} aria-invalid={!!errors.dates} /></label>
                            <label className="block"><span className="cell-k mb-1">Check-out</span>
                              <input type="date" className="input !py-2 !text-[16px]" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} aria-invalid={!!errors.dates} /></label>
                          </div>
                          {(errors.dates || errors.rooms) && <p className="field-error" role="alert">{errors.dates || errors.rooms}</p>}
                        </div>
                      </Collapse>
                    </div>
                  </Step></div>
                )}
              </Collapse>

              <Step n={step++} label={attending ? 'A note for the couple (optional)' : 'Send your blessings (optional)'} htmlFor={`${uid}-notes`}>
                <textarea id={`${uid}-notes`} className="textarea" rows={3} maxLength={600} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder={attending ? 'Dietary needs, arrival plans, anything we should know…' : 'We will miss you…'} />
              </Step>

              {errors.form && <p className="field-error mb-2 text-center" role="alert">{errors.form}</p>}
              <button type="submit" className="btn btn-primary mt-2 w-full !py-[18px]" disabled={busy || !store}>
                {busy ? <span className="loader-dots" aria-label="Sending"><span style={{ background: 'var(--on-gold)' }} /><span style={{ background: 'var(--on-gold)' }} /><span style={{ background: 'var(--on-gold)' }} /></span> : <><ICheck />Confirm RSVP</>}
              </button>
              {saved && <button type="button" className="mt-4 w-full text-center text-[14px] text-muted underline-offset-4 transition hover:text-gold2 hover:underline" onClick={() => setMode('existing')}>Cancel editing</button>}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
