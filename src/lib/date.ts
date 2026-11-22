const pad = (n: number) => String(n).padStart(2, '0')

export const parseDate = (iso: string) => new Date(iso)

/** Wednesday, 21 October 2026 */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tzOf(iso) })

/** 21 Oct 2026 */
export const shortDate = (iso: string) =>
  new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tzOf(iso) })

/** Day / month / 2-digit year of the wedding as shown in the big date block (in the event's own offset). */
export function dateParts(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) { const d = new Date(iso); return { d: pad(d.getDate()), m: pad(d.getMonth() + 1), y: String(d.getFullYear()).slice(2) } }
  return { d: m[3], m: m[2], y: m[1].slice(2) }
}

/** India-first: when an ISO carries +05:30 show it in IST regardless of the viewer's zone. */
export function tzOf(iso: string): string | undefined {
  if (/\+05:30$/.test(iso)) return 'Asia/Kolkata'
  if (/Z$|\+00:00$/.test(iso)) return 'UTC'
  return undefined
}

export function diffParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60 }
}

export const sameLocalDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const relTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()
}

/** "2026-12-19" -> "Sat, 19 Dec" */
export const dayLabel = (isoDate: string) =>
  new Date(isoDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
