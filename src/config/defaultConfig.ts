import type { SiteConfig } from './types'
import mangalam from '../assets/music/mangalam.mp3'
import sandhya from '../assets/music/sandhya.mp3'
// Demo photography: Unsplash (free licence) — see README for photographer credits.
import bgHero from '../assets/photos/bg-hero.webp'
import bgInvite from '../assets/photos/bg-invite.webp'
import bgEvents from '../assets/photos/bg-events.webp'
import bgCountdown from '../assets/photos/bg-countdown.webp'
import bgFooter from '../assets/photos/bg-footer.webp'
import bgLanding from '../assets/photos/bg-landing.webp'
import decoJasmine from '../assets/photos/deco-jasmine.webp'
import pStory from '../assets/photos/story.webp'
import pGroom from '../assets/photos/groom.webp'
import pBride from '../assets/photos/bride.webp'
import pThalikettu from '../assets/photos/ev-thalikettu.webp'
import pReception from '../assets/photos/ev-reception.webp'
import gWalk from '../assets/photos/g-walk.webp'
import gSitting from '../assets/photos/g-sitting.webp'
import gKasavu from '../assets/photos/g-kasavu.webp'
import gFamily from '../assets/photos/g-family.webp'
import gLampJasmine from '../assets/photos/g-lampjasmine.webp'
import gTemple from '../assets/photos/g-temple.webp'

/** Bump when the template's content model changes; older saved configs are then ignored. */
export const CONFIG_VERSION = 5

/**
 * DEMO COUPLE — every name, phone number and address below is fictional sample content.
 * Replace it (here or in the admin panel) for a real client.
 */
export const defaultConfig: SiteConfig = {
  version: CONFIG_VERSION,
  meta: {
    title: 'Arjun & Meera — 20 December 2026',
    description: 'With the blessings of Sree Guruvayurappan, Arjun Nair & Meera Menon invite you to their wedding on Sunday, 20 December 2026 at the Grand Palace Convention Centre, Kochi.',
    language: 'en',
  },
  backdrops: {
    landing: bgLanding,
    invitation: bgInvite,
    countdown: bgCountdown,
    events: bgEvents,
    gallery: decoJasmine,
    footer: bgFooter,
  },
  hero: {
    eyebrow: 'The wedding of',
    blessingMl: 'ശ്രീ ഗുരുവായൂരപ്പന്റെ അനുഗ്രഹത്തോടെ',
    tagline: 'Two hearts, two families, one auspicious beginning.',
    venueLine: 'Grand Palace Convention Centre · Kochi, Kerala',
    image: bgHero,
  },
  invitation: {
    eyebrow: 'An invitation',
    inviteMl: 'സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു',
    lead: 'With the blessings of Sree Guruvayurappan and our elders,',
    hosts: ['Mr. Rajesh Nair & Mrs. Lakshmi Nair', 'Mr. Suresh Menon & Mrs. Anitha Menon'],
    hostsJoiner: 'together with',
    request: 'joyfully request your gracious presence and blessings\nat the marriage of our children',
    withWord: 'and',
    closing: 'on Sunday, the twentieth of December, two thousand twenty-six,\nduring the auspicious muhurtham between 10:45 and 11:30 in the morning,\nat the Grand Palace Convention Centre, Kochi.',
  },
  story: {
    enabled: true,
    eyebrow: 'Our story',
    title: 'From a monsoon afternoon *to forever*',
    paragraphs: [
      'Arjun and Meera first met on a rain-soaked afternoon at a bookshop café in Fort Kochi, both reaching for the last copy of the same novel. He let her have it; she insisted they share it over a cup of filter coffee. Neither of them finished the book that day.',
      'Five years of long conversations, temple-festival evenings and sunsets along the Marine Drive walkway later — and with both families’ blessings at the nischayam — they are ready to begin their greatest chapter together, before the lamp, in the traditional Kerala way.',
    ],
    quote: 'Whatever our souls are made of, his and mine are the same.',
    quoteBy: 'Emily Brontë',
    image: pStory,
    imageAlt: 'Arjun in a white mundu and Meera in a silk half-saree, holding a lotus',
  },
  couple: {
    order: 'groom-first',
    groom: {
      name: 'Arjun',
      nameMl: 'അർജുൻ',
      fullName: 'Arjun Nair',
      role: 'The Groom',
      photo: pGroom,
      about: 'An architect who sketches temple roofs and old Kochi houses by day and plays the guitar by night. On the wedding day he will wear the traditional kasavu mundu and melmundu.',
      address: 'Sopanam, 12 Temple Road, Kakkanad, Kochi (demo address)',
      parents: 'Son of Mr. Rajesh Nair & Mrs. Lakshmi Nair',
      siblingsLabel: 'With love from',
      siblings: 'Anjali Nair (sister) & family',
    },
    bride: {
      name: 'Meera',
      nameMl: 'മീര',
      fullName: 'Meera Menon',
      role: 'The Bride',
      photo: pBride,
      about: 'A Mohiniyattam dancer and paediatric doctor with a gentle heart and a fearless spirit. She will be draped in a kasavu silk saree with jasmine in her hair, just as her mother was.',
      address: 'Chandrika, 8 Lake View Road, Panampilly Nagar, Kochi (demo address)',
      parents: 'Daughter of Mr. Suresh Menon & Mrs. Anitha Menon',
      siblingsLabel: 'With love from',
      siblings: 'Karthik Menon (brother)',
    },
  },
  wedding: {
    start: '2026-12-20T10:45:00+05:30',
    dateBarText: 'Sunday · 20 December 2026',
    auspiciousMl: 'മംഗളകരമായ വിവാഹം',
    countdownHeading: 'Counting down to the muhurtham',
    todayMessage: 'Today is the auspicious day ✦',
    afterHeading: 'Happily married for',
    justMarried: 'Just married',
  },
  families: {
    eyebrow: 'The bride & groom',
    title: 'Meet the *couple*',
    lede: 'Two families from Kochi, brought together by love, laughter and the blessings of Guruvayurappan.',
  },
  gallery: {
    eyebrow: 'Moments',
    title: 'Our *gallery*',
    lede: 'Kasavu, jasmine and lamplight — a few frames from our journey together.',
    photos: [
      { src: gWalk, alt: 'A Kerala bride in red silk and a groom in mundu with tulsi garlands walking hand in hand', caption: 'Hand in hand — the walk after the thali', credit: 'arununnikrishnan' },
      { src: gSitting, alt: 'The couple sitting in a misty meadow, he in a mundu, she in a silk half-saree', caption: 'Misty mornings in Munnar', credit: 'arununnikrishnan' },
      { src: gKasavu, alt: 'Three women in kasavu sarees against a laterite wall', caption: 'The bridesmaids in kasavu', credit: 'pranavck' },
      { src: gLampJasmine, alt: 'Brass lamp stands with long jasmine garlands', caption: 'Brass, jasmine and lamplight for the mandapam', credit: 'viditgoswami' },
      { src: gFamily, alt: 'The couple embraced by family in traditional Kerala attire', caption: 'Both families, one big embrace', credit: 'shades_by_43' },
      { src: gTemple, alt: 'A Kerala temple shrine with a tiled roof decorated with garlands', caption: 'Where we went to seek blessings', credit: 'dileeshg' },
    ],
  },
  events: {
    eyebrow: 'Celebrations',
    title: 'Wedding *ceremonies*',
    lede: 'We would be honoured to have your presence and blessings as we celebrate our wedding and reception.',
    items: [
      {
        id: 'thalikettu',
        title: 'Wedding Ceremony',
        titleMl: 'താലികെട്ട്',
        image: pThalikettu,
        host: 'Hosted by both families',
        intro: 'Before the lit nilavilakku in a mandapam of jasmine and plantain, Arjun ties the thali, the couple exchange garlands and Meera receives the pudava — to the sound of the nadaswaram.',
        start: '2026-12-20T10:15:00+05:30',
        end: '2026-12-20T11:45:00+05:30',
        timeText: 'Muhurtham 10:45 AM to 11:30 AM',
        subText: 'Attire · Kerala traditional — set-saree, mundu & melmundu',
        venue: 'Kalyana Mandapam, Grand Palace Convention Centre',
        venueSub: 'Kochi, Kerala',
        address: 'Grand Palace Convention Centre, Kochi, Kerala',
        rsvpLabel: 'Sun, 20 Dec · Muhurtham 10:45 AM',
      },
      {
        id: 'reception',
        title: 'Reception',
        titleMl: 'സ്വീകരണം',
        image: pReception,
        host: 'Hosted by both families',
        intro: 'An evening to celebrate the newlyweds with music, dinner and everyone we love, under the lights of the Crystal Ballroom.',
        start: '2026-12-20T18:30:00+05:30',
        end: '2026-12-20T22:00:00+05:30',
        timeText: '6:30 PM to 10:00 PM',
        subText: 'Attire · Festive formal',
        venue: 'Crystal Ballroom, Grand Palace Convention Centre',
        venueSub: 'Kochi, Kerala',
        address: 'Grand Palace Convention Centre, Kochi, Kerala',
        rsvpLabel: 'Sun, 20 Dec · 6:30 PM · Crystal Ballroom',
      },
    ],
  },
  rsvp: {
    enabled: true,
    title: 'Will you *join us?*',
    deadline: '2026-12-10',
    copy: 'Your presence and blessings are the greatest gift we could ask for. Please let us know which ceremonies you will attend so we can welcome you properly.',
    maxGuestsPerEvent: 10,
    rooms: {
      enabled: false,
      note: '',
      checkIn: '2026-12-19',
      checkOut: '2026-12-21',
      details: [],
      maxRooms: 6,
    },
  },
  live: {
    enabled: false,
    eyebrow: 'From wherever you are',
    title: 'Watch us *live*',
    url: '',
    platform: 'YouTube Live',
    caption: '',
    buttonLabel: 'Watch the wedding live',
  },
  contact: {
    eyebrow: 'Questions?',
    title: 'Get in *touch*',
    note: '',
    people: [],
    residence: {
      label: 'Wedding venue',
      address: 'Grand Palace Convention Centre\nMarine Drive, Kochi, Kerala',
      mapsUrl: '',
    },
  },
  wishes: {
    enabled: false,
    eyebrow: 'Guestbook',
    title: 'Wishes *wall*',
    lede: '',
    placeholder: 'Write your blessings for Arjun & Meera…',
    pageSize: 6,
    samples: [],
  },
  music: {
    enabled: true,
    currentId: 'mangalam',
    volume: 0.5,
    tracks: [
      { id: 'mangalam', title: 'Mangalam', subtitle: 'Veena & tanpura · original', src: mangalam, builtin: true },
      { id: 'sandhya', title: 'Sandhya', subtitle: 'Soft piano · original', src: sandhya, builtin: true },
    ],
  },
  footer: {
    message: 'With love and gratitude,',
    creatorName: '',
    creatorUrl: '',
    socials: [],
  },
  theme: {
    brown: '#302018',
    maroon: '#581F27',
    gold: '#C6A15B',
    antique: '#A98243',
    ivory: '#FFF8E8',
    sandal: '#E8D9BD',
    green: '#254B36',
    text: '#302018',
    muted: '#6B5545',
    footer: '#21160F',
  },
}

/** Ready-made Kerala palettes selectable in the admin panel. */
export const themePresets: Record<string, Partial<SiteConfig['theme']>> = {
  'Guruvayoor Classic': {},
  'Kasavu & Temple Green': { maroon: '#254B36', green: '#581F27' },
  'Sandalwood & Kumkum': { maroon: '#7A1E2C', brown: '#2A1A14', sandal: '#EAD8B4', ivory: '#FFF6E2' },
  'Nilavilakku Night': { brown: '#1F1611', footer: '#150F0B', maroon: '#4A1A21' },
}
