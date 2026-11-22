import { ImageReveal, Parallax, Reveal, RevealItem, Seam, TextReveal } from '../components/ui/Reveal'
import { MediaImg } from '../components/ui/MediaImg'
import { MayilpeeliFlute, MuralCorner, TempleBell } from '../components/decor/Kerala'
import { useSite } from '../context/SiteContext'

/** Couple introduction framed as a Guruvayoor temple mandapam arch with hanging brass bells. */
export function Story() {
  const { config } = useSite()
  const s = config.story
  if (!s.enabled) return null
  return (
    <section className="section tone-sandal weave" id="story" aria-label="Our story">
      <Seam />
      <div className="section-inner grid items-center gap-14 text-left lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {s.image && (
          <div className="relative mx-auto w-full max-w-[440px]">
            {/* Hanging brass temple bells flanking the arch */}
            <TempleBell className="pointer-events-none absolute -left-5 -top-4 z-10 h-20 w-9 text-gold opacity-85" />
            <TempleBell className="pointer-events-none absolute -right-5 -top-4 z-10 h-20 w-9 text-gold opacity-85" />
            <Parallax distance={40}>
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
        <div>
          <Reveal distance={10} dir="none"><MayilpeeliFlute className="mb-2 h-11 w-28" /></Reveal>
          <Reveal distance={14}><div className="eyebrow !mb-5">{s.eyebrow}</div></Reveal>
          <TextReveal text={s.title} className="title !text-[clamp(36px,5.6vw,60px)]" />
          <Reveal stagger={0.15} delay={0.25} className="mt-8 space-y-5">
            {s.paragraphs.map((p, i) => <RevealItem key={i}><p className="text-[clamp(15.5px,1.6vw,17px)] leading-[1.95] text-muted">{p}</p></RevealItem>)}
          </Reveal>
          {s.quote && (
            <Reveal delay={0.4} className="mt-10 border-l-2 border-gold/60 pl-6">
              <blockquote className="serif text-[clamp(21px,2.6vw,27px)] italic leading-snug text-maroon">“{s.quote}”</blockquote>
              {s.quoteBy && <p className="mt-3 text-[11px] uppercase tracking-[.3em] text-gold">— {s.quoteBy}</p>}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
