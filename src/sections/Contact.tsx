import { motion } from 'framer-motion'
import { IHome, INav, IPhone, IWhatsapp } from '../components/ui/Icons'
import { Reveal, RevealItem, SectionHeading, Seam } from '../components/ui/Reveal'
import { useSite } from '../context/SiteContext'
import { addressMapsUrl } from '../lib/calendar'

const pretty = (p: string) => {
  const d = p.replace(/[^\d+]/g, '')
  const m = d.match(/^\+91(\d{5})(\d{5})$/)
  return m ? `+91 ${m[1]} ${m[2]}` : p
}

export function Contact() {
  const { config } = useSite()
  const c = config.contact
  return (
    <section className="section tone-sandal weave" id="contact" aria-label="Contact">
      <Seam />
      <div className="section-inner">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} />
        <div className="mx-auto grid max-w-[560px] gap-6 md:max-w-[1000px] md:grid-cols-[1.15fr_1fr] md:gap-8">
          <Reveal className="flex flex-col gap-3" stagger={0.1}>
            {c.people.map((p) => {
              const tel = p.phone.replace(/[^\d+]/g, '')
              return (
                <RevealItem key={p.name + p.phone}>
                  <motion.div className="card hoverable flex items-center justify-between gap-3 !rounded-2xl px-5 py-4">
                    <div className="min-w-0 text-left">
                      {p.role && <div className="label !text-[9.5px]">{p.role}</div>}
                      <div className="serif mt-0.5 text-[22px] leading-tight text-ivory">{p.name}</div>
                      <a href={`tel:${tel}`} className="mt-0.5 block text-[14px] tracking-wide text-muted transition hover:text-gold2">{pretty(p.phone)}</a>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {p.whatsapp && <a href={`https://wa.me/${tel.replace('+', '')}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${p.name}`} className="icon-btn"><IWhatsapp /></a>}
                      <a href={`tel:${tel}`} aria-label={`Call ${p.name}`} className="icon-btn"><IPhone /></a>
                    </div>
                  </motion.div>
                </RevealItem>
              )
            })}
            {c.note && <RevealItem><p className="mt-1 text-left text-[12.5px] text-muted/75">{c.note}</p></RevealItem>}
          </Reveal>
          {c.residence.address && (
            <Reveal className="card card-corner flex flex-col justify-between p-7 text-left sm:p-9" dir="down" delay={0.15}>
              <div>
                <span className="row-icon !h-12 !w-12"><IHome /></span>
                <div className="label mt-6">{c.residence.label}</div>
                <address className="serif mt-2 whitespace-pre-line text-[clamp(22px,2.6vw,26px)] not-italic leading-snug text-ivory">{c.residence.address}</address>
              </div>
              <a className="btn btn-primary mt-8 w-full" href={addressMapsUrl(c.residence.address.replace(/\(demo address\)/i, ''), c.residence.mapsUrl)} target="_blank" rel="noopener noreferrer"><INav />Get directions</a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
