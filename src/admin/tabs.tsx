import { useEffect, useMemo, useRef, useState } from 'react'
import type { Person, Rsvp, SiteConfig, Wish, WeddingEvent } from '../config/types'
import { CONFIG_VERSION, defaultConfig, themePresets } from '../config/defaultConfig'
import { mergeConfig, useSite } from '../context/SiteContext'
import { MediaImg } from '../components/ui/MediaImg'
import { ICopy, IUpload } from '../components/ui/Icons'
import { copyText, saveFile, toCsv, uid } from '../lib/files'
import { relTime, shortDate } from '../lib/date'
import { Color, ConfirmButton, DateOnly, DateTime, ImageField, Num, Section, Text, Toggle } from './fields'

export type Up = (fn: (d: SiteConfig) => void) => void
interface TabProps { d: SiteConfig; up: Up }

// ───────────────────────── Couple & families ─────────────────────────
function PersonEditor({ p, onChange }: { p: Person; onChange: (fn: (p: Person) => void) => void }) {
  return (
    <>
      <ImageField label="Profile photo" value={p.photo} onChange={(v) => onChange((x) => { x.photo = v })} />
      <div className="grid grid-cols-2 gap-x-3">
        <Text label="Display name" value={p.name} onChange={(v) => onChange((x) => { x.name = v })} />
        <Text label="Name in Malayalam" value={p.nameMl ?? ''} onChange={(v) => onChange((x) => { x.nameMl = v })} />
      </div>
      <Text label="Role label" value={p.role} onChange={(v) => onChange((x) => { x.role = v })} />
      <Text label="Full name (optional)" value={p.fullName ?? ''} onChange={(v) => onChange((x) => { x.fullName = v })} />
      <Text label="Short description (optional)" value={p.about ?? ''} multiline onChange={(v) => onChange((x) => { x.about = v })} />
      <Text label="Residence / address" value={p.address} onChange={(v) => onChange((x) => { x.address = v })} />
      <Text label="Parents" value={p.parents} onChange={(v) => onChange((x) => { x.parents = v })} />
      <div className="grid grid-cols-2 gap-x-3">
        <Text label="Family label" value={p.siblingsLabel ?? ''} onChange={(v) => onChange((x) => { x.siblingsLabel = v })} />
        <Text label="Family members" value={p.siblings ?? ''} onChange={(v) => onChange((x) => { x.siblings = v })} />
      </div>
    </>
  )
}

export function CoupleTab({ d, up }: TabProps) {
  return (
    <>
      <Section title="Groom"><PersonEditor p={d.couple.groom} onChange={(fn) => up((c) => fn(c.couple.groom))} /></Section>
      <Section title="Bride"><PersonEditor p={d.couple.bride} onChange={(fn) => up((c) => fn(c.couple.bride))} /></Section>
      <Section title="Display">
        <label className="f"><span>Name order</span>
          <select className="in" value={d.couple.order} onChange={(e) => up((c) => { c.couple.order = e.target.value as 'groom-first' })}>
            <option value="groom-first">Groom first (invitation from groom’s family)</option>
            <option value="bride-first">Bride first (invitation from bride’s family)</option>
          </select>
        </label>
        <Text label="Monogram letters (blank = initials)" value={d.couple.monogram ?? ''} onChange={(v) => up((c) => { c.couple.monogram = v.slice(0, 2) })} />
      </Section>
      <Section title="Hero">
        <ImageField label="Background photo (shown darkened)" value={d.hero.image} onChange={(v) => up((c) => { c.hero.image = v })} />
        <Text label="Malayalam blessing" value={d.hero.blessingMl} onChange={(v) => up((c) => { c.hero.blessingMl = v })} />
        <Text label="Eyebrow" value={d.hero.eyebrow} onChange={(v) => up((c) => { c.hero.eyebrow = v })} />
        <Text label="Venue line" value={d.hero.venueLine} onChange={(v) => up((c) => { c.hero.venueLine = v })} />
        <Text label="Tagline" value={d.hero.tagline} onChange={(v) => up((c) => { c.hero.tagline = v })} />
      </Section>
      <Section title="Our story (couple introduction)">
        <Toggle label="Show story section" value={d.story.enabled} onChange={(v) => up((c) => { c.story.enabled = v })} />
        <ImageField label="Story image" value={d.story.image} onChange={(v) => up((c) => { c.story.image = v })} />
        <Text label="Eyebrow" value={d.story.eyebrow} onChange={(v) => up((c) => { c.story.eyebrow = v })} />
        <Text label="Title" value={d.story.title} onChange={(v) => up((c) => { c.story.title = v })} hint="Wrap words in *asterisks* to set them in gold italic." />
        <Text label="Paragraphs (blank line between)" multiline value={d.story.paragraphs.join('\n\n')} onChange={(v) => up((c) => { c.story.paragraphs = v.split(/\n\s*\n/) })} />
        <div className="grid grid-cols-2 gap-x-3">
          <Text label="Quote" value={d.story.quote} onChange={(v) => up((c) => { c.story.quote = v })} />
          <Text label="Quote by" value={d.story.quoteBy} onChange={(v) => up((c) => { c.story.quoteBy = v })} />
        </div>
      </Section>
      <Section title="Profiles section">
        <Text label="Eyebrow" value={d.families.eyebrow} onChange={(v) => up((c) => { c.families.eyebrow = v })} />
        <Text label="Title" value={d.families.title ?? ''} onChange={(v) => up((c) => { c.families.title = v })} />
        <Text label="Intro" multiline value={d.families.lede ?? ''} onChange={(v) => up((c) => { c.families.lede = v })} />
      </Section>
      <Section title="Invitation wording">
        <Text label="Eyebrow" value={d.invitation.eyebrow} onChange={(v) => up((c) => { c.invitation.eyebrow = v })} />
        <Text label="Malayalam invitation line" value={d.invitation.inviteMl} onChange={(v) => up((c) => { c.invitation.inviteMl = v })} />
        <Text label="Opening line" value={d.invitation.lead} onChange={(v) => up((c) => { c.invitation.lead = v })} />
        <Text label="Hosts (one per line)" multiline value={d.invitation.hosts.join('\n')} onChange={(v) => up((c) => { c.invitation.hosts = v.split('\n') })} />
        <div className="grid grid-cols-2 gap-x-3">
          <Text label="Word between families" value={d.invitation.hostsJoiner} onChange={(v) => up((c) => { c.invitation.hostsJoiner = v })} />
          <Text label="Word between names" value={d.invitation.withWord} onChange={(v) => up((c) => { c.invitation.withWord = v })} />
        </div>
        <Text label="Request (line breaks kept)" multiline value={d.invitation.request} onChange={(v) => up((c) => { c.invitation.request = v })} />
        <Text label="Closing line (date & venue)" multiline value={d.invitation.closing} onChange={(v) => up((c) => { c.invitation.closing = v })} />
      </Section>
    </>
  )
}

// ───────────────────────── Wedding date & countdown ─────────────────────────
export function WeddingTab({ d, up }: TabProps) {
  return (
    <>
      <Section title="Date & countdown">
        <DateTime label="Wedding date & time (countdown target)" value={d.wedding.start} onChange={(v) => up((c) => { c.wedding.start = v })} />
        <Text label="Malayalam heading" value={d.wedding.auspiciousMl} onChange={(v) => up((c) => { c.wedding.auspiciousMl = v })} />
        <Text label="Date line" value={d.wedding.dateBarText} onChange={(v) => up((c) => { c.wedding.dateBarText = v })} hint="e.g. the weekday, “Save the date”" />
        <Text label="Countdown heading" value={d.wedding.countdownHeading} onChange={(v) => up((c) => { c.wedding.countdownHeading = v })} />
        <Text label="Message on the wedding day" value={d.wedding.todayMessage} onChange={(v) => up((c) => { c.wedding.todayMessage = v })} />
        <Text label="Heading after the wedding (counts up)" value={d.wedding.afterHeading} onChange={(v) => up((c) => { c.wedding.afterHeading = v })} />
        <Text label="After-wedding line" value={d.wedding.justMarried} onChange={(v) => up((c) => { c.wedding.justMarried = v })} />
      </Section>
      <Section title="Page title & sharing">
        <Text label="Browser title" value={d.meta.title} onChange={(v) => up((c) => { c.meta.title = v })} />
        <Text label="Description (link previews)" multiline value={d.meta.description} onChange={(v) => up((c) => { c.meta.description = v })} />
      </Section>
      <Section title="RSVP settings">
        <Toggle label="RSVP section enabled" value={d.rsvp.enabled} onChange={(v) => up((c) => { c.rsvp.enabled = v })} />
        <DateOnly label="Respond by" value={d.rsvp.deadline} onChange={(v) => up((c) => { c.rsvp.deadline = v })} />
        <Text label="Intro text" multiline value={d.rsvp.copy} onChange={(v) => up((c) => { c.rsvp.copy = v })} />
        <Num label="Max guests per event" value={d.rsvp.maxGuestsPerEvent} min={1} max={50} onChange={(v) => up((c) => { c.rsvp.maxGuestsPerEvent = v })} />
        <Toggle label="Ask about hotel rooms" value={d.rsvp.rooms.enabled} onChange={(v) => up((c) => { c.rsvp.rooms.enabled = v })} />
        {d.rsvp.rooms.enabled && (
          <>
            <Text label="Accommodation note" multiline value={d.rsvp.rooms.note} onChange={(v) => up((c) => { c.rsvp.rooms.note = v })} />
            <div className="grid grid-cols-2 gap-x-3">
              <DateOnly label="Default check-in" value={d.rsvp.rooms.checkIn} onChange={(v) => up((c) => { c.rsvp.rooms.checkIn = v })} />
              <DateOnly label="Default check-out" value={d.rsvp.rooms.checkOut} onChange={(v) => up((c) => { c.rsvp.rooms.checkOut = v })} />
            </div>
            <Text label="Room details (one per line)" multiline value={d.rsvp.rooms.details.join('\n')} onChange={(v) => up((c) => { c.rsvp.rooms.details = v.split('\n').filter(Boolean) })} />
            <Num label="Max rooms per guest" value={d.rsvp.rooms.maxRooms} min={1} max={50} onChange={(v) => up((c) => { c.rsvp.rooms.maxRooms = v })} />
          </>
        )}
      </Section>
    </>
  )
}

// ───────────────────────── Events & venues ─────────────────────────
export function EventsTab({ d, up }: TabProps) {
  const [open, setOpen] = useState<string | null>(d.events.items[0]?.id ?? null)
  const set = (i: number, fn: (e: WeddingEvent) => void) => up((c) => fn(c.events.items[i]))
  const move = (i: number, dir: number) => up((c) => { const a = c.events.items; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]] })
  return (
    <>
      <Section title="Section">
        <Text label="Eyebrow" value={d.events.eyebrow} onChange={(v) => up((c) => { c.events.eyebrow = v })} />
        <Text label="Title" value={d.events.title ?? ''} onChange={(v) => up((c) => { c.events.title = v })} />
        <Text label="Intro (optional)" multiline value={d.events.lede ?? ''} onChange={(v) => up((c) => { c.events.lede = v })} />
      </Section>
      <h3>Events</h3>
      {d.events.items.map((e, i) => (
        <div key={e.id} className="box">
          <div className="flex items-center gap-2">
            <button type="button" className="flex-1 text-left text-[15px] font-semibold" onClick={() => setOpen(open === e.id ? null : e.id)} aria-expanded={open === e.id}>
              {String(i + 1).padStart(2, '0')} · {e.title || 'Untitled'} <span className="font-normal text-[#8a7652]">— {shortDate(e.start)}</span>
            </button>
            <button type="button" className="b !px-2" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button type="button" className="b !px-2" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
          </div>
          {open === e.id && (
            <div className="mt-3">
              <ImageField label="Event photo" value={e.image} onChange={(v) => set(i, (x) => { x.image = v })} />
              <div className="grid grid-cols-2 gap-x-3">
                <Text label="Title" value={e.title} onChange={(v) => set(i, (x) => { x.title = v })} />
                <Text label="Malayalam title" value={e.titleMl ?? ''} onChange={(v) => set(i, (x) => { x.titleMl = v })} />
              </div>
              {!e.image && <Toggle label="Use banana-leaf sadya illustration" value={e.art === 'banana-leaf'} onChange={(v) => set(i, (x) => { x.art = v ? 'banana-leaf' : undefined })} />}
              <Text label="Hosted by (optional)" value={e.host ?? ''} onChange={(v) => set(i, (x) => { x.host = v })} />
              <Text label="Intro (optional)" multiline value={e.intro ?? ''} onChange={(v) => set(i, (x) => { x.intro = v })} />
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                <DateTime label="Starts" value={e.start} onChange={(v) => set(i, (x) => { x.start = v })} />
                <DateTime label="Ends" value={e.end} onChange={(v) => set(i, (x) => { x.end = v })} />
              </div>
              <Text label="Time line (blank = automatic)" value={e.timeText ?? ''} placeholder="Muhurtham 10:30 AM to 11:15 AM" onChange={(v) => set(i, (x) => { x.timeText = v })} />
              <Text label="Extra line under time" value={e.subText ?? ''} onChange={(v) => set(i, (x) => { x.subText = v })} />
              <div className="grid grid-cols-2 gap-x-3">
                <Text label="Venue" value={e.venue} onChange={(v) => set(i, (x) => { x.venue = v })} />
                <Text label="Area / city" value={e.venueSub ?? ''} onChange={(v) => set(i, (x) => { x.venueSub = v })} />
              </div>
              <Text label="Address (used for directions)" value={e.address ?? ''} onChange={(v) => set(i, (x) => { x.address = v })} />
              <Text label="Google Maps link (optional, overrides address)" value={e.mapsUrl ?? ''} onChange={(v) => set(i, (x) => { x.mapsUrl = v })} />
              <Text label="Short line in RSVP picker" value={e.rsvpLabel ?? ''} onChange={(v) => set(i, (x) => { x.rsvpLabel = v })} />
              <ConfirmButton label="Remove event" onConfirm={() => up((c) => { c.events.items.splice(i, 1) })} />
            </div>
          )}
        </div>
      ))}
      <button type="button" className="b" onClick={() => {
        const id = 'event-' + uid().slice(0, 6)
        up((c) => { c.events.items.push({ id, title: 'New event', start: c.wedding.start, end: c.wedding.start.replace(/T(\d{2})/, (_, h) => 'T' + String(Math.min(23, +h + 2)).padStart(2, '0')), venue: 'Venue name', venueSub: '', address: '' }) })
        setOpen(id)
      }}>+ Add event</button>
    </>
  )
}

// ───────────────────────── Gallery ─────────────────────────
export function GalleryTab({ d, up }: TabProps) {
  const { store, toast } = useSite()
  const ref = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState('')
  async function add(files: FileList | null) {
    if (!files?.length || !store) return
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    for (let k = 0; k < list.length; k++) {
      setProgress(`Uploading ${k + 1} of ${list.length}…`)
      try {
        const src = await store.uploadMedia(list[k], 'image')
        up((c) => { c.gallery.photos.push({ src, alt: list[k].name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), caption: '' }) })
      } catch (e) { toast((e as Error).message); break }
    }
    setProgress(''); if (ref.current) ref.current.value = ''
  }
  const move = (i: number, dir: number) => up((c) => { const a = c.gallery.photos; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]] })
  return (
    <>
      <Section title="Section">
        <div className="grid grid-cols-2 gap-x-3">
          <Text label="Eyebrow" value={d.gallery.eyebrow} onChange={(v) => up((c) => { c.gallery.eyebrow = v })} />
          <Text label="Title" value={d.gallery.title} onChange={(v) => up((c) => { c.gallery.title = v })} />
        </div>
        <Text label="Intro" value={d.gallery.lede ?? ''} onChange={(v) => up((c) => { c.gallery.lede = v })} />
      </Section>
      <h3>Photos ({d.gallery.photos.length})</h3>
      <div className="mb-3 flex items-center gap-3">
        <button type="button" className="b pri" onClick={() => ref.current?.click()} disabled={!!progress}><IUpload width={14} height={14} />Add photos</button>
        <span className="text-[13px] text-[#8a7652]">{progress || 'JPG/PNG, resized to 1600px automatically'}</span>
        <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {d.gallery.photos.map((p, i) => (
          <div key={p.src + i} className="overflow-hidden rounded-xl border border-[#ece3d0] bg-white">
            <MediaImg src={p.src} alt={p.alt} className="aspect-[3/4] w-full object-cover" />
            <div className="p-2">
              <input className="in mb-1 !py-1.5 !text-[12.5px]" value={p.caption ?? ''} placeholder="Caption" onChange={(e) => up((c) => { c.gallery.photos[i].caption = e.target.value })} />
              <input className="in !py-1.5 !text-[12.5px]" value={p.alt} placeholder="Image description (accessibility)" onChange={(e) => up((c) => { c.gallery.photos[i].alt = e.target.value })} />
              <div className="mt-2 flex gap-1">
                <button type="button" className="b !px-2" onClick={() => move(i, -1)} aria-label="Move earlier">←</button>
                <button type="button" className="b !px-2" onClick={() => move(i, 1)} aria-label="Move later">→</button>
                <ConfirmButton label="" onConfirm={() => up((c) => { c.gallery.photos.splice(i, 1) })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ───────────────────────── Music ─────────────────────────
export function MusicTab({ d, up }: TabProps) {
  const { store, toast } = useSite()
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const preview = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  useEffect(() => () => { preview.current?.pause() }, [])
  async function listen(id: string, src: string) {
    const { resolveMedia } = await import('../lib/media')
    if (!preview.current) { preview.current = new Audio(); preview.current.onended = () => setPlaying(null) }
    if (playing === id) { preview.current.pause(); setPlaying(null); return }
    preview.current.src = (await resolveMedia(src)) || ''; preview.current.volume = 0.6
    preview.current.play().then(() => setPlaying(id)).catch(() => toast('Could not play this file'))
  }
  async function add(f?: File) {
    if (!f || !store) return
    if (!f.type.startsWith('audio/')) return toast('Please choose an audio file (MP3, M4A, AAC, OGG)')
    if (f.size > 15 * 1024 * 1024) return toast('Please use a file under 15 MB')
    setBusy(true)
    try {
      const src = await store.uploadMedia(f, 'audio'); const id = 'track-' + uid().slice(0, 6)
      up((c) => { c.music.tracks.push({ id, title: f.name.replace(/\.[^.]+$/, ''), subtitle: 'Uploaded', src }); c.music.currentId = id })
      toast('Track added and set as default')
    } catch (e) { toast((e as Error).message) } finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  return (
    <>
      <Section title="Background music">
        <Toggle label="Music enabled" value={d.music.enabled} onChange={(v) => up((c) => { c.music.enabled = v })} />
        <label className="f"><span>Default volume · {Math.round(d.music.volume * 100)}%</span>
          <input type="range" min={0} max={1} step={0.05} value={d.music.volume} onChange={(e) => up((c) => { c.music.volume = +e.target.value })} className="w-full" />
        </label>
        <p className="text-[12.5px] text-[#8a7652]">Music starts when a guest taps to open the invitation (browsers block autoplay before a tap). Guests can pause, change volume or switch tracks.</p>
      </Section>
      <h3>Tracks</h3>
      {d.music.tracks.map((t, i) => (
        <div key={t.id} className="box flex flex-wrap items-center gap-2">
          <input type="radio" name="default-track" checked={d.music.currentId === t.id} onChange={() => up((c) => { c.music.currentId = t.id })} aria-label={`Use ${t.title} as default`} />
          <input className="in !w-auto min-w-0 flex-1" value={t.title} onChange={(e) => up((c) => { c.music.tracks[i].title = e.target.value })} />
          <button type="button" className="b" onClick={() => listen(t.id, t.src)}>{playing === t.id ? 'Stop' : 'Preview'}</button>
          {!t.builtin && <ConfirmButton label="" onConfirm={() => up((c) => { c.music.tracks.splice(i, 1); if (c.music.currentId === t.id) c.music.currentId = c.music.tracks[0]?.id ?? '' })} />}
        </div>
      ))}
      <button type="button" className="b pri" onClick={() => ref.current?.click()} disabled={busy}><IUpload width={14} height={14} />{busy ? 'Uploading…' : 'Upload a track'}</button>
      <input ref={ref} type="file" accept="audio/*" hidden onChange={(e) => add(e.target.files?.[0])} />
      <p className="mt-2 text-[12.5px] text-[#8a7652]">Only upload music you have the rights to use. The two built-in tracks are original compositions included with this template.</p>
    </>
  )
}

// ───────────────────────── RSVPs ─────────────────────────
export function RsvpsTab({ d }: { d: SiteConfig }) {
  const { store, toast } = useSite()
  const [rows, setRows] = useState<Rsvp[] | null>(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'rooms'>('all')
  const load = () => { setErr(''); store?.listRsvps().then(setRows).catch((e) => setErr(e.message)) }
  useEffect(load, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const r = rows ?? []; const yes = r.filter((x) => x.attending)
    return {
      total: r.length, yes: yes.length, no: r.length - yes.length,
      perEvent: d.events.items.map((e) => ({ e, n: yes.reduce((s, x) => s + (x.events[e.id] || 0), 0), parties: yes.filter((x) => (x.events[e.id] || 0) > 0).length })),
      rooms: yes.filter((x) => x.needsRooms).reduce((s, x) => s + x.rooms, 0),
    }
  }, [rows, d.events.items])

  const list = (rows ?? []).filter((r) =>
    (filter === 'all' || (filter === 'yes' && r.attending) || (filter === 'no' && !r.attending) || (filter === 'rooms' && r.needsRooms)) &&
    (!q || r.name.toLowerCase().includes(q.toLowerCase()) || (r.notes ?? '').toLowerCase().includes(q.toLowerCase())))

  const csv = () => toCsv([
    ['Name', 'Attending', ...d.events.items.map((e) => e.title), 'Needs rooms', 'Rooms', 'Check-in', 'Check-out', 'Notes', 'Responded'],
    ...(rows ?? []).map((r) => [r.name, r.attending ? 'Yes' : 'No', ...d.events.items.map((e) => r.events[e.id] || 0), r.needsRooms ? 'Yes' : 'No', r.rooms, r.checkIn, r.checkOut, r.notes, r.updatedAt]),
  ])

  return (
    <>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[['Responses', stats.total], ['Attending', stats.yes], ['Declined', stats.no]].map(([l, n]) => (
          <div key={l} className="box !mb-0 text-center"><div className="text-[24px] font-bold text-accent">{n}</div><div className="text-[11px] uppercase tracking-wide text-[#8a7652]">{l}</div></div>
        ))}
      </div>
      <div className="box">
        {stats.perEvent.map(({ e, n, parties }) => (
          <div key={e.id} className="flex justify-between border-b border-[#f1ead9] py-1.5 last:border-0"><span>{e.title}</span><b>{n} guests <span className="font-normal text-[#8a7652]">· {parties} parties</span></b></div>
        ))}
        <div className="flex justify-between pt-1.5"><span>Hotel rooms requested</span><b>{stats.rooms}</b></div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <input className="in !w-auto min-w-[140px] flex-1" placeholder="Search name or note" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="in !w-auto" value={filter} onChange={(e) => setFilter(e.target.value as 'all')}>
          <option value="all">All</option><option value="yes">Attending</option><option value="no">Declined</option><option value="rooms">Need rooms</option>
        </select>
        <button type="button" className="b" onClick={load}>Refresh</button>
        <button type="button" className="b" disabled={!rows?.length} onClick={async () => { const ok = await saveFile('rsvps.csv', csv(), 'text/csv'); toast(ok ? 'CSV exported' : 'Download blocked — use Copy') }}>Export CSV</button>
        <button type="button" className="b" disabled={!rows?.length} onClick={async () => toast((await copyText(csv())) ? 'CSV copied' : 'Copy failed')}><ICopy width={14} height={14} />Copy</button>
      </div>
      {err && <p className="text-[#a8352c]">{err}</p>}
      {rows === null && !err && <p>Loading…</p>}
      {rows && !list.length && <p className="text-[#8a7652]">No responses{q || filter !== 'all' ? ' match' : ' yet'}.</p>}
      {list.map((r) => (
        <div key={r.id} className="box">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[15px] font-semibold">{r.name} <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] ${r.attending ? 'bg-[#e6f1e0] text-[#2f6b2a]' : 'bg-[#f6e3df] text-[#9a3b2e]'}`}>{r.attending ? 'Attending' : 'Declined'}</span></div>
              <div className="text-[12px] text-[#8a7652]">{relTime(r.updatedAt)}</div>
            </div>
            <ConfirmButton label="" onConfirm={async () => { try { await store?.deleteRsvp(r.id); setRows((x) => x?.filter((y) => y.id !== r.id) ?? null) } catch (e) { toast((e as Error).message) } }} />
          </div>
          {r.attending && (
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[12.5px]">
              {d.events.items.filter((e) => r.events[e.id]).map((e) => <span key={e.id} className="rounded bg-[#f4edd9] px-2 py-0.5">{e.title}: {r.events[e.id]}</span>)}
              {r.needsRooms && <span className="rounded bg-[#efe3f4] px-2 py-0.5">{r.rooms} room(s) · {r.checkIn} → {r.checkOut}</span>}
            </div>
          )}
          {r.notes && <p className="mt-1.5 text-[13px] italic text-[#5d4e36]">“{r.notes}”</p>}
        </div>
      ))}
    </>
  )
}

// ───────────────────────── Wishes moderation ─────────────────────────
export function WishesTab({ d, up }: TabProps) {
  const { store, toast } = useSite()
  const [list, setList] = useState<Wish[] | null>(null)
  useEffect(() => store?.subscribeWishes(setList), [store])
  return (
    <>
      <Section title="Wishes wall">
        <Toggle label="Wishes wall enabled" value={d.wishes.enabled} onChange={(v) => up((c) => { c.wishes.enabled = v })} />
        <Text label="Intro" value={d.wishes.lede} onChange={(v) => up((c) => { c.wishes.lede = v })} />
        <Text label="Placeholder" value={d.wishes.placeholder} onChange={(v) => up((c) => { c.wishes.placeholder = v })} />
        <Num label="Wishes shown before “Load more”" value={d.wishes.pageSize} min={2} max={50} onChange={(v) => up((c) => { c.wishes.pageSize = v })} />
      </Section>
      <h3>Sample wishes ({d.wishes.samples.length})</h3>
      <p className="mb-2 text-[12.5px] text-[#8a7652]">Shown after real guest wishes. Remove them before sharing with guests if you prefer an empty wall.</p>
      {d.wishes.samples.map((w, i) => (
        <div key={i} className="box">
          <input className="in mb-2" value={w.name} onChange={(e) => up((c) => { c.wishes.samples[i].name = e.target.value })} />
          <textarea className="in" value={w.message} onChange={(e) => up((c) => { c.wishes.samples[i].message = e.target.value })} />
          <div className="mt-2"><ConfirmButton label="Remove" onConfirm={() => up((c) => { c.wishes.samples.splice(i, 1) })} /></div>
        </div>
      ))}
      <button type="button" className="b mb-2" onClick={() => up((c) => { c.wishes.samples.push({ name: 'Name', message: 'Your wish', createdAt: new Date().toISOString() }) })}>+ Add sample wish</button>
      <h3>Received from guests ({list?.length ?? '…'})</h3>
      {list?.map((w) => (
        <div key={w.id} className="box flex gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#ede2c9]">{w.photo && <MediaImg src={w.photo} alt="" className="h-full w-full object-cover" />}</div>
          <div className="min-w-0 flex-1"><b>{w.name}</b> <span className="text-[12px] text-[#8a7652]">{relTime(w.createdAt)}</span><p className="m-0 mt-1 whitespace-pre-line break-words text-[13.5px]">{w.message}</p></div>
          <ConfirmButton label="" onConfirm={async () => { try { await store?.deleteWish(w.id); toast('Wish removed') } catch (e) { toast((e as Error).message) } }} />
        </div>
      ))}
    </>
  )
}

// ───────────────────────── Stream, contacts, footer ─────────────────────────
export function ContactTab({ d, up }: TabProps) {
  return (
    <>
      <Section title="Live stream">
        <Toggle label="Show live stream section" value={d.live.enabled} onChange={(v) => up((c) => { c.live.enabled = v })} />
        <Text label="Streaming link (YouTube, Zoom, Facebook…)" type="url" value={d.live.url} placeholder="https://youtube.com/live/…" onChange={(v) => up((c) => { c.live.url = v })} hint="Leave blank until the link is ready — guests see “link will appear here”." />
        <div className="grid grid-cols-2 gap-x-3">
          <Text label="Button label" value={d.live.buttonLabel} onChange={(v) => up((c) => { c.live.buttonLabel = v })} />
          <Text label="Platform name" value={d.live.platform} onChange={(v) => up((c) => { c.live.platform = v })} />
        </div>
        <Text label="Caption" multiline value={d.live.caption} onChange={(v) => up((c) => { c.live.caption = v })} />
      </Section>
      <Section title="Contact section">
        <Text label="Title" value={d.contact.title} onChange={(v) => up((c) => { c.contact.title = v })} />
        <Text label="Small note under contacts" value={d.contact.note} onChange={(v) => up((c) => { c.contact.note = v })} />
      </Section>
      <h3>Contacts</h3>
      {d.contact.people.map((p, i) => (
        <div key={i} className="box">
          <div className="grid grid-cols-2 gap-x-3">
            <Text label="Name" value={p.name} onChange={(v) => up((c) => { c.contact.people[i].name = v })} />
            <Text label="Phone (+91…)" type="tel" value={p.phone} onChange={(v) => up((c) => { c.contact.people[i].phone = v })} />
          </div>
          <Text label="Role (e.g. Groom's father)" value={p.role ?? ''} onChange={(v) => up((c) => { c.contact.people[i].role = v })} />
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1"><Toggle label="WhatsApp button" value={!!p.whatsapp} onChange={(v) => up((c) => { c.contact.people[i].whatsapp = v })} /></div>
            <ConfirmButton label="" onConfirm={() => up((c) => { c.contact.people.splice(i, 1) })} />
          </div>
        </div>
      ))}
      <button type="button" className="b" onClick={() => up((c) => { c.contact.people.push({ name: 'Name', phone: '+91', whatsapp: true }) })}>+ Add contact</button>
      <Section title="Location card">
        <Text label="Label" value={d.contact.residence.label} onChange={(v) => up((c) => { c.contact.residence.label = v })} />
        <Text label="Address" multiline value={d.contact.residence.address} onChange={(v) => up((c) => { c.contact.residence.address = v })} />
        <Text label="Google Maps link (optional)" value={d.contact.residence.mapsUrl ?? ''} onChange={(v) => up((c) => { c.contact.residence.mapsUrl = v })} />
      </Section>
      <Section title="Footer">
        <Text label="Closing message" value={d.footer.message} onChange={(v) => up((c) => { c.footer.message = v })} />
        <div className="grid grid-cols-2 gap-x-3">
          <Text label="Created by" value={d.footer.creatorName} onChange={(v) => up((c) => { c.footer.creatorName = v })} />
          <Text label="Creator link" value={d.footer.creatorUrl} onChange={(v) => up((c) => { c.footer.creatorUrl = v })} />
        </div>
        {d.footer.socials.map((s, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <select className="in !w-auto" value={s.kind} onChange={(e) => up((c) => { c.footer.socials[i].kind = e.target.value as 'website' })}>
              {['whatsapp', 'instagram', 'website', 'facebook', 'youtube'].map((k) => <option key={k}>{k}</option>)}
            </select>
            <input className="in" value={s.url} onChange={(e) => up((c) => { c.footer.socials[i].url = e.target.value })} />
            <ConfirmButton label="" onConfirm={() => up((c) => { c.footer.socials.splice(i, 1) })} />
          </div>
        ))}
        <button type="button" className="b" onClick={() => up((c) => { c.footer.socials.push({ kind: 'website', url: 'https://' }) })}>+ Add link</button>
      </Section>
    </>
  )
}

// ───────────────────────── Theme ─────────────────────────
const COLOR_KEYS: [keyof SiteConfig['theme'], string][] = [
  ['brown', 'Deep temple brown'], ['maroon', 'Dark maroon'], ['gold', 'Kasavu gold'], ['antique', 'Antique gold'], ['ivory', 'Warm ivory'],
  ['sandal', 'Sandalwood cream'], ['green', 'Deep green'], ['text', 'Text on ivory'], ['muted', 'Secondary text'], ['footer', 'Footer base'],
]
const BACKDROPS: [keyof SiteConfig['backdrops'], string][] = [
  ['landing', 'Opening screen'], ['invitation', 'Invitation (shown faint, sepia)'], ['countdown', 'Countdown (maroon veil)'], ['events', 'Ceremonies (temple-brown veil)'], ['gallery', 'Gallery decorative image'], ['footer', 'Footer (brown veil)'],
]
export function ThemeTab({ d, up }: TabProps) {
  return (
    <>
      <h3>Presets</h3>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {Object.entries(themePresets).map(([name, t]) => {
          const th = { ...defaultConfig.theme, ...t }
          return (
            <button key={name} type="button" className="box !mb-0 text-left" onClick={() => up((c) => { c.theme = { ...th } })}>
              <div className="mb-2 flex gap-1">{[th.ivory, th.sandal, th.maroon, th.gold, th.brown, th.green].map((col, i) => <span key={i} className="h-5 w-5 rounded-full border border-black/10" style={{ background: col }} />)}</div>
              <span className="text-[13px] font-semibold">{name}</span>
            </button>
          )
        })}
      </div>
      <Section title="Colours">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {COLOR_KEYS.map(([k, l]) => <Color key={k} label={l} value={d.theme[k] as string} onChange={(v) => up((c) => { (c.theme[k] as string) = v })} />)}
        </div>
      </Section>
      <Section title="Section background photos">
        {BACKDROPS.map(([k, l]) => <ImageField key={k} label={l} value={d.backdrops[k]} onChange={(v) => up((c) => { c.backdrops[k] = v })} />)}
      </Section>
    </>
  )
}

// ───────────────────────── Share & data ─────────────────────────
export function ShareTab({ d, up }: TabProps) {
  const { store, toast } = useSite()
  const [guest, setGuest] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const base = location.href.split('#')[0].split('?')[0]
  const link = guest.trim() ? `${base}?to=${encodeURIComponent(guest.trim())}` : base
  const hashLink = guest.trim() ? `${base}#to-${guest.trim().replace(/[^A-Za-z0-9]+/g, '-')}` : base
  const json = () => JSON.stringify(d, null, 2)
  async function importFile(f?: File) {
    if (!f) return
    try {
      const parsed = JSON.parse(await f.text())
      if (!parsed || typeof parsed !== 'object' || !parsed.couple) throw new Error('Not an invitation config file')
      up((c) => { Object.assign(c, mergeConfig(defaultConfig, parsed)); c.version = CONFIG_VERSION })
      toast('Imported — review, then Publish')
    } catch (e) { toast((e as Error).message) } finally { if (fileRef.current) fileRef.current.value = '' }
  }
  return (
    <>
      <Section title="Personalised invitation link">
        <Text label="Guest name" value={guest} placeholder="e.g. Rahul & Family" onChange={setGuest} />
        <div className="break-all rounded-lg bg-[#f7f2e6] p-2.5 text-[12.5px]">{link}</div>
        <div className="mt-2 flex gap-2">
          <button type="button" className="b pri" onClick={async () => toast((await copyText(link)) ? 'Link copied' : 'Copy failed')}><ICopy width={14} height={14} />Copy link</button>
          <a className="b" href={`https://wa.me/?text=${encodeURIComponent(`You're invited! ${link}`)}`} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
        </div>
        <p className="mt-2 text-[12px] text-[#8a7652]">The guest’s name appears on the opening screen, in the invitation and pre-fills their RSVP. Where query strings are stripped, use: <code className="break-all">{hashLink}</code></p>
      </Section>
      <Section title="Template file">
        <p className="mb-2 text-[13px] text-[#5d4e36]">Export this couple’s full configuration to reuse the template, keep a backup, or move it to another deployment.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="b" onClick={async () => toast((await saveFile('invitation-config.json', json(), 'application/json')) ? 'Exported' : 'Download blocked — use Copy')}>Export JSON</button>
          <button type="button" className="b" onClick={async () => toast((await copyText(json())) ? 'Config copied' : 'Copy failed')}><ICopy width={14} height={14} />Copy JSON</button>
          <button type="button" className="b" onClick={() => fileRef.current?.click()}><IUpload width={14} height={14} />Import JSON</button>
          <ConfirmButton label="Reset to template" className="b danger" onConfirm={() => up((c) => { Object.assign(c, structuredClone(defaultConfig)) })} />
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
        </div>
      </Section>
      <Section title="Data storage">
        <p className="m-0 text-[13px] text-[#5d4e36]">{store?.describe}</p>
      </Section>
    </>
  )
}
