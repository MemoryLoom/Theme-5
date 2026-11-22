/**
 * Every piece of couple-specific content lives in a SiteConfig.
 * To create an invitation for a new couple, edit `defaultConfig.ts`
 * (or use the admin panel, which saves a config to the data store).
 */

export interface Person {
  name: string // display name, e.g. "Arjun"
  nameMl?: string // Malayalam display name, e.g. "അർജുൻ"
  fullName?: string // optional full name for formal lines
  role: string // "The Groom" / "The Bride"
  photo?: string // media ref (url, data url, idb:key, asset id)
  address: string // residence, one line or with \n
  parents: string // "Son of Mr. Rajesh Nair & Mrs. Lakshmi Nair"
  siblingsLabel?: string // "Sharing the happiness"
  siblings?: string
  about?: string // short description (optional)
}

export interface WeddingEvent {
  id: string
  title: string
  titleMl?: string // Malayalam title, e.g. "താലികെട്ട്"
  art?: 'banana-leaf' // illustrated header used when there is no photo
  host?: string // "Hosted by the groom's family"
  intro?: string
  start: string // ISO date-time with offset, e.g. 2026-12-20T10:30:00+05:30
  end: string
  timeText?: string // custom time line, e.g. "Muhurtham 10:30 AM to 11:15 AM"
  subText?: string // extra line under date (calendar note etc.)
  venue: string
  venueSub?: string // city / area
  address?: string
  mapsUrl?: string // optional explicit Google Maps url; else built from venue + address
  rsvpLabel?: string // short line used inside the RSVP picker
  image?: string // card photo (media ref)
}

export interface Contact {
  name: string
  role?: string // "Groom's father"
  phone: string // E.164 preferred: +919876543210
  whatsapp?: boolean
}

export interface Track {
  id: string
  title: string
  subtitle?: string
  src: string // media ref
  builtin?: boolean
}

/** Kerala palette. Sections pick a tone (light ivory, sandalwood, temple-brown, maroon, green) built from these. */
export interface Theme {
  brown: string // deep temple brown — dark sections
  maroon: string // dark maroon — headings & buttons on ivory, countdown band
  gold: string // traditional kasavu gold — accents on dark
  antique: string // antique gold — accents on ivory
  ivory: string // warm ivory — main light background
  sandal: string // sandalwood cream — alternate light background
  green: string // deep green — live-stream band
  text: string // body text on ivory
  muted: string // secondary text on ivory
  footer: string // footer base
}

export interface SiteConfig {
  version: number
  meta: { title: string; description: string; language: string }
  /** Section background photographs (shown under tinted overlays). */
  backdrops: { landing?: string; invitation?: string; countdown?: string; events?: string; gallery?: string; footer?: string }
  hero: { eyebrow: string; blessingMl: string; tagline: string; venueLine: string; image?: string }
  story: { enabled: boolean; eyebrow: string; title: string; paragraphs: string[]; quote: string; quoteBy: string; image?: string; imageAlt?: string }
  couple: {
    groom: Person
    bride: Person
    order: 'groom-first' | 'bride-first'
    monogram?: string // two letters; auto from names when blank
  }
  invitation: {
    eyebrow: string
    inviteMl: string // Malayalam line, e.g. "സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു"
    lead: string // "Together with our families,"
    hosts: string[] // ["Mr. Rajesh Nair & Mrs. Lakshmi Nair", "Mr. Suresh Menon & Mrs. Anitha Menon"]
    hostsJoiner: string // "and"
    request: string // multi-line request text, \n separated
    withWord: string // "with"
    closing: string // line after the names, e.g. "on Sunday, the twentieth of December…"
  }
  wedding: {
    start: string // ISO, used for countdown + date block
    dateBarText: string // text in the gold band above the date
    auspiciousMl: string // e.g. "മംഗളകരമായ വിവാഹം"
    countdownHeading: string
    todayMessage: string
    afterHeading: string
    justMarried: string
  }
  families: { eyebrow: string; title?: string; lede?: string }
  gallery: { eyebrow: string; title: string; lede?: string; photos: { src: string; alt: string; caption?: string; credit?: string }[] }
  events: { eyebrow: string; title?: string; lede?: string; items: WeddingEvent[] }
  rsvp: {
    enabled: boolean
    title: string
    deadline: string // ISO date
    copy: string
    maxGuestsPerEvent: number
    rooms: {
      enabled: boolean
      note: string
      checkIn: string // ISO date
      checkOut: string // ISO date
      details: string[]
      maxRooms: number
    }
  }
  live: { enabled: boolean; eyebrow: string; title: string; url: string; caption: string; buttonLabel: string; platform: string }
  contact: {
    eyebrow: string
    title: string
    note: string
    people: Contact[]
    residence: { label: string; address: string; mapsUrl?: string }
  }
  wishes: { enabled: boolean; eyebrow: string; title: string; lede: string; placeholder: string; pageSize: number; samples: { name: string; message: string; createdAt: string }[] }
  music: { enabled: boolean; tracks: Track[]; currentId: string; volume: number }
  footer: {
    message: string
    creatorName: string
    creatorUrl: string
    socials: { kind: 'whatsapp' | 'instagram' | 'website' | 'facebook' | 'youtube'; url: string }[]
  }
  theme: Theme
}

export interface Rsvp {
  id: string
  name: string
  attending: boolean
  events: Record<string, number> // eventId -> guest count (only when attending)
  needsRooms: boolean
  rooms: number
  checkIn?: string
  checkOut?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Wish {
  id: string
  name: string
  message: string
  photo?: string
  createdAt: string
  owner?: string
}
