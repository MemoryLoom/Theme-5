import type { SiteConfig } from './types'
import mangalam from '../assets/music/mangalam.mp3'
import sandhya from '../assets/music/sandhya.mp3'
// Authentic Guruvayoor Sri Krishna Temple & Kerala Hindu wedding photography
import bgHero from '../assets/photos/bg-hero.webp'
import bgLanding from '../assets/photos/bg-landing.webp'
import bgFooter from '../assets/photos/bg-footer.webp'
import decoJasmine from '../assets/photos/deco-jasmine.webp'
import pStory from '../assets/photos/story.webp'
import pGroom from '../assets/photos/groom.webp'
import pBride from '../assets/photos/bride.webp'
import pThalikettu from '../assets/photos/ev-thalikettu.webp'
import gWalk from '../assets/photos/g-walk.webp'
import gFamily from '../assets/photos/g-family.webp'
import gLampJasmine from '../assets/photos/g-lampjasmine.webp'
import guruvayoorTopview from '../assets/photos/guruvayoor-topview.jpg'
import guruvayoorEastnada from '../assets/photos/guruvayoor-eastnada.jpg'
import guruvayoorSreekovil from '../assets/photos/guruvayoor-sreekovil.jpg'
import guruvayoorKrishnanattam from '../assets/photos/guruvayoor-krishnanattam.jpg'

/** Bump when the template's content model changes; older saved configs are then ignored. */
export const CONFIG_VERSION = 7

/**
 * GURUVAYOOR SRI KRISHNA TEMPLE WEDDING THEME — authentic Guruvayoor temple imagery,
 * East Nada Kalyana Mandapam ceremonies, and sacred Malayalam invocations.
 */
export const defaultConfig: SiteConfig = {
  version: CONFIG_VERSION,
  meta: {
    title: 'Arjun & Meera — Guruvayoor Temple Wedding · 20 December 2026',
    description: 'Om Namo Bhagavate Vasudevaya. With the divine blessings of Sree Guruvayurappan, Arjun Nair & Meera Menon invite you to their wedding at East Nada Kalyana Mandapam, Guruvayoor Sri Krishna Temple on Sunday, 20 December 2026.',
    language: 'en',
  },
  backdrops: {
    landing: bgLanding,
    invitation: guruvayoorTopview,
    countdown: guruvayoorSreekovil,
    events: guruvayoorEastnada,
    gallery: decoJasmine,
    footer: bgFooter,
  },
  hero: {
    eyebrow: 'Sree Guruvayurappan Thuna · The Wedding Of',
    blessingMl: 'ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ',
    tagline: 'Before the sacred Deepastambham and golden Kodimaram of Bhooloka Vaikuntam, two souls unite as one.',
    venueLine: 'Sree Guruvayurappan Temple · East Nada, Guruvayoor',
    image: bgHero,
  },
  invitation: {
    eyebrow: 'Thirumangalya Kshanam · Sacred Scroll',
    inviteMl: 'ഗുരുവായൂരപ്പന്റെ തിരുസന്നിധിയിലേക്ക് സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു',
    lead: 'With the divine grace of Lord Sree Guruvayurappan and the blessings of our revered elders,',
    hosts: ['Mr. Rajesh Nair & Mrs. Lakshmi Nair', 'Mr. Suresh Menon & Mrs. Anitha Menon'],
    hostsJoiner: 'together with',
    request: 'humbly seek your auspicious presence and prayers\nat the Thirumangalyam (Thalikettu) of our children',
    withWord: 'weds',
    closing: 'on Sunday, the twentieth of December, two thousand twenty-six (1202 Dhanu 5),\nduring the sacred Muhurtham between 10:45 AM and 11:30 AM,\nat the East Nada Kalyana Mandapam, Sree Krishna Temple, Guruvayoor.',
  },
  story: {
    enabled: true,
    eyebrow: 'Blessed at Bhooloka Vaikuntam',
    title: 'Under the lamps of *Guruvayoor*',
    paragraphs: [
      'Arjun and Meera first crossed paths during a sacred Ekadashi dawn at the East Nada of Guruvayoor Sri Krishna Temple, where thousands of oil lamps on the Vilakkumadam glowed against the morning mist and the melody of Sopana Sangeetham filled the courtyard.',
      'Bound by shared devotion, family traditions, and the fragrance of thulasi and mullappoo, they return to the threshold of Lord Guruvayurappan’s Sreekovil to exchange tulsi garlands and tie the sacred thali before the eternal flame of the Nilavilakku.',
    ],
    quote: 'Where the flute of Guruvayurappan plays and the thousand lamps of the Vilakkumadam shine, two hearts find their eternal home.',
    quoteBy: 'Sacred Guruvayoor Blessing',
    image: pStory,
    imageAlt: 'Arjun in a traditional kasavu mundu and Meera in a silk half-saree holding a sacred lotus',
  },
  couple: {
    order: 'groom-first',
    groom: {
      name: 'Arjun',
      nameMl: 'അർജുൻ നായർ',
      fullName: 'Arjun Nair',
      role: 'The Groom',
      photo: pGroom,
      about: 'Son of Mr. Rajesh Nair & Mrs. Lakshmi Nair, Sopanam, Punkunnam, Thrissur.',
      address: 'Sopanam, Temple Road, Punkunnam, Thrissur',
      parents: 'Son of Mr. Rajesh Nair & Mrs. Lakshmi Nair',
      siblingsLabel: 'With love from',
      siblings: 'Anjali Nair & family',
    },
    bride: {
      name: 'Meera',
      nameMl: 'മീര മേനോൻ',
      fullName: 'Meera Menon',
      role: 'The Bride',
      photo: pBride,
      about: 'Daughter of Mr. Suresh Menon & Mrs. Anitha Menon, Nandavanam, East Nada, Guruvayoor.',
      address: 'Nandavanam, East Nada, Guruvayoor, Thrissur',
      parents: 'Daughter of Mr. Suresh Menon & Mrs. Anitha Menon',
      siblingsLabel: 'With love from',
      siblings: 'Karthik Menon',
    },
  },
  wedding: {
    start: '2026-12-20T10:45:00+05:30',
    dateBarText: 'Sunday · 20 December 2026 · 1202 Dhanu 5',
    auspiciousMl: 'ശ്രീ ഗുരുവായൂരപ്പൻ തുണ · ശുഭ മുഹൂർത്തം',
    countdownHeading: 'Counting down to the Guruvayoor Muhurtham',
    todayMessage: 'Today is the sacred Muhurtham at Guruvayoor ✦',
    afterHeading: 'Blessed in marriage by Sree Guruvayurappan for',
    justMarried: 'Blessed at Guruvayoor',
  },
  families: {
    eyebrow: 'The bride & groom',
    title: 'Meet the *couple*',
    lede: 'Two families united in devotion and love before Lord Guruvayurappan.',
  },
  gallery: {
    eyebrow: 'Sacred Darshan & Moments',
    title: 'Guruvayoor *Sannidhi*',
    lede: 'Sreekovil copper roofs, the golden Swarna Kodimaram, Deepastambham lamplight, and sacred thulasi garlands.',
    photos: [
      { src: guruvayoorTopview, alt: 'Guruvayoor Sri Krishna Temple Sreekovil copper roof and golden Swarna Kodimaram flagstaff', caption: 'Sree Guruvayurappan Sreekovil & Swarna Kodimaram', credit: 'Wikimedia Commons' },
      { src: guruvayoorEastnada, alt: 'East Nada Gopuram and copper-roofed Nalambalam of Guruvayoor Sri Krishna Temple', caption: 'East Nada Gopuram — Guruvayoor Sri Krishna Temple', credit: 'Wikimedia Commons' },
      { src: guruvayoorSreekovil, alt: 'Guruvayoor Temple illuminated at night with Sudarshana Chakra lights reflecting in Rudratheertham pond', caption: 'Deeparadhana lights reflecting in Rudratheertham Pond', credit: 'Wikimedia Commons' },
      { src: gFamily, alt: 'Tying the sacred thali at the Guruvayoor East Nada Kalyana Mandapam surrounded by family', caption: 'Mangalya Dharanam — tying the sacred thali at the Mandapam', credit: 'shades_by_43' },
      { src: gWalk, alt: 'Bride and groom in traditional Kerala kasavu and silk with sacred thulasi garlands', caption: 'Pradakshinam in fragrant thulasi garlands after the Muhurtham', credit: 'arununnikrishnan' },
      { src: guruvayoorKrishnanattam, alt: 'Traditional Krishnanattam performance before a lit brass Nilavilakku at Guruvayoor Temple', caption: 'Sacred Krishnanattam offering before the temple Nilavilakku', credit: 'Wikimedia Commons' },
    ],
  },
  events: {
    eyebrow: 'Sacred Rites at Bhooloka Vaikuntam',
    title: 'Guruvayoor *Ceremonies*',
    lede: 'Join us at the East Nada of Sree Guruvayurappan Temple as the nadaswaram plays and the sacred lamps are lit.',
    items: [
      {
        id: 'thalikettu',
        title: 'Guruvayoor Temple Muhurtham',
        titleMl: 'താലികെട്ട് · തിരുമംഗല്യം',
        image: pThalikettu,
        host: 'In the divine presence of Sree Guruvayurappan',
        intro: 'Before the golden Kodimaram and lit Nilavilakku at the East Nada Kalyana Mandapam, Arjun ties the sacred thali, the couple exchange fragrant thulasi & jasmine garlands, and Meera receives the auspicious pudava to the resonance of temple Nadaswaram.',
        start: '2026-12-20T10:15:00+05:30',
        end: '2026-12-20T11:45:00+05:30',
        timeText: 'Muhurtham 10:45 AM to 11:30 AM',
        subText: 'Attire · Temple Traditional — Kasavu saree, mundu & melmundu',
        venue: 'East Nada Kalyana Mandapam, Guruvayoor Sri Krishna Temple',
        venueSub: 'East Nada, Guruvayoor, Thrissur',
        address: 'East Nada, Guruvayoor Sri Krishna Temple, Guruvayoor, Kerala 680101',
        rsvpLabel: 'Sun, 20 Dec · Muhurtham 10:45 AM · East Nada, Guruvayoor',
      },
      {
        id: 'reception',
        title: 'Sweekaranam & Temple Sadya',
        titleMl: 'സ്വീകരണം · വിവാഹസദ്യ',
        image: gLampJasmine,
        host: 'Hosted by both families at Guruvayoor',
        intro: 'Following Darshan and Pradakshinam at the temple courtyard, please join us steps away from East Nada to bless the newlyweds over a traditional 24-course Kerala wedding sadya served on banana leaf with Palada Pradhaman.',
        start: '2026-12-20T12:00:00+05:30',
        end: '2026-12-20T15:30:00+05:30',
        timeText: '12:00 PM to 3:30 PM',
        subText: 'Traditional Sadya & Blessings · East Nada, Guruvayoor',
        venue: 'Sreevalsam Kalyana Mandapam, East Nada',
        venueSub: 'Guruvayoor, Thrissur, Kerala',
        address: 'East Nada, Guruvayoor, Thrissur, Kerala 680101',
        rsvpLabel: 'Sun, 20 Dec · 12:00 PM · Sreevalsam Mandapam, Guruvayoor',
      },
    ],
  },
  rsvp: {
    enabled: true,
    title: 'Join us at *Guruvayoor*',
    deadline: '2026-12-10',
    copy: 'Your presence and prayers before Lord Guruvayurappan are the greatest blessing we could ask for. Kindly confirm your attendance for the East Nada Muhurtham and Sadya.',
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
      label: 'Temple Venue',
      address: 'East Nada Kalyana Mandapam\nSree Krishna Temple, Guruvayoor, Kerala',
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
      { id: 'mangalam', title: 'Sopana Mangalam', subtitle: 'Temple veena & tanpura · original', src: mangalam, builtin: true },
      { id: 'sandhya', title: 'Guruvayoor Sandhya', subtitle: 'Evening deeparadhana · original', src: sandhya, builtin: true },
    ],
  },
  footer: {
    message: 'With prayers at the lotus feet of Sree Guruvayurappan,',
    creatorName: '',
    creatorUrl: '',
    socials: [],
  },
  theme: {
    brown: '#2B1B12',
    maroon: '#5A1A22',
    gold: '#C9A253',
    antique: '#A8803E',
    ivory: '#FFF8E8',
    sandal: '#EADBC0',
    green: '#234A34',
    text: '#2B1B12',
    muted: '#695242',
    footer: '#1C110B',
  },
}

/** Ready-made Kerala palettes selectable in the admin panel. */
export const themePresets: Record<string, Partial<SiteConfig['theme']>> = {
  'Guruvayoor Classic': {},
  'Kasavu & Temple Green': { maroon: '#234A34', green: '#5A1A22' },
  'Sandalwood & Kumkum': { maroon: '#7A1E2C', brown: '#2A1A14', sandal: '#EAD8B4', ivory: '#FFF6E2' },
  'Nilavilakku Night': { brown: '#1F1611', footer: '#150F0B', maroon: '#4A1A21' },
}
