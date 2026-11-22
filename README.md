# Vivaha — Kerala Hindu wedding invitation template

A reusable, config-driven digital wedding invitation themed on a traditional Kerala Hindu wedding and the
atmosphere of Guruvayoor Sri Krishna Temple: a sealed ivory-and-kasavu envelope opening over lit nilavilakku,
a temple-entrance hero (two-tier Kerala roof drawn in gold over a festival-lit temple), bilingual Malayalam/English
text, the formal invitation from both families, couple story, profiles, a maroon countdown band, the ceremonies
(നിശ്ചയം Nischayam · താലികെട്ട് Thalikettu · സദ്യ Sadya · സ്വീകരണം Reception), gallery, RSVP with hotel rooms,
live stream, wishes wall, contacts, background music and an admin panel.

**Stack:** React 18 · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (optional) · Vite.

**Palette (Admin → Theme):** temple brown #302018 · dark maroon #581F27 · kasavu gold #C6A15B · antique gold #A98243 ·
warm ivory #FFF8E8 · sandalwood #E8D9BD · deep green #254B36. Each section picks a *tone* (ivory, sandalwood,
temple-brown, maroon, green) built from these, so the whole site re-colours from the palette.

**Fonts (self-hosted, SIL OFL):** Cormorant Garamond (names, headings, dates), Jost (body, buttons, forms) and
Noto Serif Malayalam (Malayalam text).

**Decor (original SVG):** temple roof & pillars, nilavilakku, kasavu borders, jasmine strands, mural-inspired corners
and an illustrated sadya on banana leaf. Section photographs sit under tinted veils with slow parallax.

**Demo content:** Arjun Nair & Meera Menon, Sunday 20 December 2026, Grand Palace Convention Centre, Kochi.
All names, phone numbers (+91 90000 1000x) and addresses are fictional and marked as demo.

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/ (deploy to Netlify, Vercel, Cloudflare Pages, GitHub Pages)
npm run build:single   # one self-contained dist-single/index.html
```

## New couple in 5 minutes

1. Edit `src/config/defaultConfig.ts` — names, parents, wording, date, events, venues, contacts, theme, footer branding.
   Every field is typed in `src/config/types.ts`.
2. Or open the site, scroll to the footer → **Admin** (or add `#admin` to the URL) and edit everything visually.
   Changes preview live behind the panel; **Publish** saves them. **Share & data → Export JSON** saves a reusable config file.
3. Replace the illustrated gallery placeholders with the couple's photos (Admin → Gallery → Add photos).
4. Pick a palette (Admin → Theme): Guruvayoor Classic, Kasavu & Temple Green, Sandalwood & Kumkum, Nilavilakku Night, or custom colours.

Personalised links: `https://your-site/?to=Rahul%20%26%20Family` greets the guest on the envelope and in the invitation,
and pre-fills their RSVP. (Admin → Share & data builds and copies these links.)

## Data & admin modes

| Mode | When | RSVPs / wishes | Admin login |
|---|---|---|---|
| **Supabase** | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set | Postgres, realtime wishes, Storage for photos/music | Email + password (Supabase Auth) and an `admins` allow-list |
| **Local demo** | no env vars | This browser only (localStorage + IndexedDB) | Passcode hashed with PBKDF2 — demo only |
| **Hosted preview** | running as a claude.ai artifact | The artifact's shared database | The artifact's owner and editors |

### Supabase setup

1. Create a project → **SQL Editor** → run `supabase/schema.sql`.
2. **Authentication → Users → Add user** (the couple / your team).
3. Run `insert into public.admins (user_id) values ('<user id>');`
4. Copy `.env.example` to `.env`, fill the URL and anon key, `npm run build`, deploy `dist/`.

Security model: row-level security on every table. Guests never read RSVPs; they submit through `submit_rsvp()` /
`get_my_rsvp()` security-definer functions keyed by a random per-device secret (stored hashed), so a guest can edit
only their own response. Wishes are insert-only for guests; deleting wishes, reading RSVPs, editing the site config and
uploading media require an authenticated user listed in `admins`.

## Structure

```
src/
  config/        types.ts · defaultConfig.ts (the couple) · theme presets
  context/       SiteContext (config, store, toast, guest name)
  lib/store/     WeddingStore interface + supabase / local / hosted adapters
  lib/           date, calendar (Google + .ics), media (compression, IndexedDB), files
  sections/      Landing · Hero · Invitation · Story · Families · DateCountdown · Events · Gallery · Rsvp · LiveStream · Wishes · Contact · Footer
  components/    decor (WaxSeal) · ui (Reveal motion system, Lightbox, Icons, MediaImg)
  music/         MusicProvider + floating control
  admin/         AdminPanel (lazy-loaded) + tabs + form fields
supabase/schema.sql
```

## Notes

- Music starts only after the guest taps to open (browser autoplay rules), pauses in background tabs and resumes on return.
- `prefers-reduced-motion` turns off parallax, drifting light and slide animations (content simply fades in).
- Saved configs from an older template version are ignored automatically (`CONFIG_VERSION`).
- Only upload music and photos you have rights to use.

## Demo photography credits

All demo photos are from [Unsplash](https://unsplash.com) under the free Unsplash Licence (commercial use allowed,
attribution appreciated). They are stand-ins for the client couple's own photos — replace them in the admin panel
(Couple, Ceremonies, Gallery, Theme → Section background photos).

| Used for | Photographer (Unsplash) |
|---|---|
| Hero (festival-lit Kerala temple) | @aadhu119 |
| Invitation backdrop (Kerala temple facade) | @itsananthakrishnan |
| Ceremonies backdrop (temple gable) | @praswinprakashan |
| Countdown backdrop (oil lamps) | @sanoyatra |
| Footer backdrop (brass lamps) | @sanoyatra |
| Opening screen (nilavilakku) | @anjanam |
| Story, Nischayam card, gallery (couple in meadow), Thalikettu card & groom portrait, gallery (walk) | @arununnikrishnan |
| Bride portrait | @itsananthakrishnan |
| Gallery: kasavu bridesmaids | @pranavck |
| Gallery: brass lamps & jasmine | @viditgoswami |
| Gallery: jasmine strings | @mrcato |
| Gallery: temple shrine | @dileeshg |
| Gallery: kodimaram | @vathikulam |
| Gallery: family embrace | @shades_by_43 |
| Gallery: backwaters sunset | @aniljose1997 |
| Gallery: rings | @redaquamedia |
| Reception card | @amishthakkar |
| Gallery decorative jasmine | @moonmoons_days |

Guruvayoor temple itself is the design inspiration; no photograph of its interior is used (photography is not
permitted inside). Kerala mural art is represented by original mural-inspired ornaments rather than reproductions.
