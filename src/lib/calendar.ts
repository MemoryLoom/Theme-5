import type { WeddingEvent } from '../config/types'

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export const mapsUrl = (e: { mapsUrl?: string; venue?: string; address?: string }) =>
  e.mapsUrl?.trim() ||
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([e.venue, e.address].filter(Boolean).join(', '))

export const addressMapsUrl = (address: string, explicit?: string) =>
  explicit?.trim() || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address.replace(/\n/g, ', '))

export function googleCalendarUrl(e: WeddingEvent, couple: string) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${e.title} · ${couple}`,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: [e.timeText, e.intro, `Invitation: ${location.href.split('#')[0]}`].filter(Boolean).join('\n'),
    location: [e.venue, e.venueSub, e.address].filter(Boolean).join(', '),
  })
  return 'https://calendar.google.com/calendar/render?' + p.toString()
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

export function icsFile(e: WeddingEvent, couple: string) {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vivaha Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.id}-${stamp(e.start)}@vivaha`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${esc(`${e.title} · ${couple}`)}`,
    `LOCATION:${esc([e.venue, e.venueSub, e.address].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${esc([e.timeText, e.intro].filter(Boolean).join('\n'))}`,
    'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
}
