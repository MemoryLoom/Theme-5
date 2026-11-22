import { ImageReveal, Parallax, Reveal, RevealItem, Seam, TextReveal } from '../components/ui/Reveal'
import { MediaImg } from '../components/ui/MediaImg'
import { MayilpeeliFlute, MuralCorner, TempleBell } from '../components/decor/Kerala'
import { useSite } from '../context/SiteContext'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'

/** Couple introduction framed as a Guruvayoor temple mandapam arch with hanging brass bells and swaying floral garlands. */
export function Story() {
  const { config } = useSite()
  const s = config.story
  if (!s.enabled) return null
  return (
    <section className="section tone-sandal weave overflow-hidden" id="story" aria-label="Our story">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Seam />

      <span className="sway-corner sway-corner--tl opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" />
      </span>
      <span className="sway-corner sway-corner--tr opacity-85" aria-hidden="true">
        <img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.6s' }} />
      </span>

      <div className="section-inner relative z-10 grid items-center gap-12 text-center lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20 lg:text-left">
        {s.image && (
          <div className="relative mx-auto w-full max-w-[420px]">
            {/* Hanging brass temple bells flanking the arch */}
            <TempleBell className="pointer-events-none absolute -left-3 -top-4 z-10 h-20 w-9 text-gold opacity-85 sm:-left-5" />
            <TempleBell className="pointer-events-none absolute -right-3 -top-4 z-10 h-20 w-9 text-gold opacity-85 sm:-right-5" />
            <Parallax distance={36}>
              <ImageReveal className="aspect-[4/5] !rounded-[200px_200px_20px_20px]" from="bottom">
                <MediaImg src={s.image} alt={s.imageAlt || ''} className="h-full w-full object-cover" />
              </ImageReveal>
            </Parallax>
            <div className="pointer-events-none absolute -inset-3 rounded-[210px_210px_26px_26px] border border-gold2/60" aria-hidden="true" />
            <div className="pointer-events-none absolute -inset-[22px] rounded-[220px_220px_32px_32px] border border-gold2/30" aria-hidden="true" />
            <MuralCorner className="absolute -bottom-6 -left-6 h-20 w-20 -rotate-90" />
            <MuralCorner className="absolute -bottom-6 -right-6 h-20 w-20 rotate-180" />
          </div>
        )}
        <div className="mx-auto max-w-[540px] lg:mx-0 lg:max-w-none">
          <Reveal distance={10} dir="none"><MayilpeeliFlute className="mx-auto mb-2 h-11 w-28 lg:mx-0" /></Reveal>
          <Reveal distance={12}><div className="eyebrow !mb-4">{s.eyebrow}</div></Reveal>
          <TextReveal text={s.title} className="title !text-[clamp(34px,5.4vw,58px)]" />
          <Reveal stagger={0.1} delay={0.12} className="mt-7 space-y-5">
            {s.paragraphs.map((p, i) => <RevealItem key={i}><p className="text-[clamp(15.5px,1.6vw,17px)] leading-[1.9] text-muted">{p}</p></RevealItem>)}
          </Reveal>
          {s.quote && (
            <Reveal delay={0.22} className="mt-9 border-gold/60 lg:border-l-2 lg:pl-6">
              <blockquote className="serif text-[clamp(20px,2.6vw,26px)] italic leading-snug text-maroon">“{s.quote}”</blockquote>
              {s.quoteBy && <p className="mt-2.5 text-[11px] uppercase tracking-[.28em] text-gold">— {s.quoteBy}</p>}
            </Reveal>
          )}
        </div>
      </div>
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
