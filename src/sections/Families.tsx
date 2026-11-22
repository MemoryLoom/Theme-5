import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Person } from '../config/types'
import { Lightbox } from '../components/ui/Lightbox'
import { MediaImg } from '../components/ui/MediaImg'
import { Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { IHome } from '../components/ui/Icons'
import { MuralCorner } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'

function ProfileCard({ p, onPhoto, from }: { p: Person; onPhoto: () => void; from: 'left' | 'right' }) {
  return (
    <motion.article className="card hoverable relative h-full overflow-hidden px-7 pb-9 pt-11 text-center sm:px-10"
      initial={{ opacity: 0, x: from === 'left' ? -40 : 40, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, ease: [0.22, 0.8, 0.24, 1] }}>
      <MuralCorner className="absolute left-2 top-2 h-14 w-14" />
      <MuralCorner className="absolute right-2 top-2 h-14 w-14 scale-x-[-1]" />
      <div className="kasavu-band absolute inset-x-0 bottom-0 !h-[10px] opacity-80" aria-hidden="true" />
      <button className="medallion" onClick={p.photo ? onPhoto : undefined} tabIndex={p.photo ? 0 : -1} aria-label={p.photo ? `View photo of ${p.name}` : undefined} style={{ cursor: p.photo ? 'zoom-in' : 'default' }}>
        {p.photo ? <MediaImg src={p.photo} alt={p.name} /> : <span className="serif text-[56px] font-light italic text-maroon">{p.name[0]}</span>}
      </button>
      <div className="label mt-7">{p.role}</div>
      <h3 className="serif mt-2 text-[clamp(34px,4.4vw,44px)] font-normal leading-tight text-maroon">{p.fullName || p.name}</h3>
      {p.nameMl && <p className="ml text-[17px] text-gold">{p.nameMl}</p>}
      <p className="serif mt-2 text-[19px] italic text-ink">{p.parents}</p>
      {p.about && <p className="mx-auto mt-5 max-w-[40ch] text-[15.5px] leading-[1.9] text-muted">{p.about}</p>}
      <div className="mx-auto my-6 h-px w-16 bg-gold/40" aria-hidden="true" />
      <address className="mx-auto flex max-w-[34ch] items-start justify-center gap-2 text-[13.5px] not-italic leading-relaxed text-muted/90">
        <IHome className="mt-[3px] h-[14px] w-[14px] shrink-0 text-gold" />{p.address}
      </address>
      {p.siblings && <p className="mt-3 text-[13.5px] text-muted/90"><span className="text-gold">{p.siblingsLabel || 'With love from'}</span> · {p.siblings}</p>}
    </motion.article>
  )
}

export function Families() {
  const { config } = useSite()
  const { first, second } = useCouple()
  const [lb, setLb] = useState<number | null>(null)
  const people = [first, second]
  const imgs = people.filter((p) => p.photo).map((p) => ({ src: p.photo!, alt: p.name }))
  return (
    <section className="section tone-light" id="couple" aria-label="Bride and groom">
      <Seam />
      <div className="section-inner">
        <SectionHeading eyebrow={config.families.eyebrow} title={config.families.title} lede={config.families.lede} />
        <div className="relative mx-auto grid max-w-[520px] grid-cols-1 gap-8 md:max-w-[1000px] md:grid-cols-2 md:gap-10">
          <ProfileCard p={first} from="left" onPhoto={() => setLb(imgs.findIndex((x) => x.alt === first.name))} />
          <Reveal className="serif pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block" scale={0.6} dir="none" delay={0.5}>
            <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-kasavu bg-bg text-[30px] italic text-maroon shadow-lg">&amp;</span>
          </Reveal>
          <ProfileCard p={second} from="right" onPhoto={() => setLb(imgs.findIndex((x) => x.alt === second.name))} />
        </div>
      </div>
      <Lightbox images={imgs} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </section>
  )
}
