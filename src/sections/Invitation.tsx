import { Backdrop, Ornament, Reveal, RevealItem, TextReveal } from '../components/ui/Reveal'
import { JasmineStrand } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'

/** The formal invitation wording from both families. */
export function Invitation() {
  const { config } = useSite()
  const { first, second } = useCouple()
  const inv = config.invitation
  return (
    <section className="section tone-light weave" id="invitation" aria-label="Invitation">
      <Backdrop src={config.backdrops.invitation} sepia distance={60} />
      <div className="section-inner max-w-[760px]">
        <Reveal distance={14}><div className="eyebrow">{inv.eyebrow}</div></Reveal>
        <TextReveal as="p" text={inv.inviteMl} className="ml mt-1 text-[clamp(24px,4.6vw,38px)] !font-semibold text-maroon" />
        <JasmineStrand className="mx-auto mt-5 h-6 w-[200px]" />
        <Reveal stagger={0.14} className="mt-4">
          <RevealItem><p className="serif text-[clamp(20px,3vw,26px)] italic text-gold">{inv.lead}</p></RevealItem>
          {inv.hosts.map((h, i) => (
            <RevealItem key={i}>
              {i > 0 && <p className="my-2 text-[11px] uppercase tracking-[.34em] text-gold">{inv.hostsJoiner}</p>}
              <p className="serif text-[clamp(22px,3.6vw,32px)] font-normal leading-snug text-ivory">{h}</p>
            </RevealItem>
          ))}
          <RevealItem>
            <p className="mx-auto mt-7 max-w-[46ch] whitespace-pre-line text-[clamp(15px,1.7vw,17px)] leading-[1.9] text-muted">{inv.request}</p>
          </RevealItem>
        </Reveal>
        <div className="my-12">
          <TextReveal as="p" text={`${first.fullName || first.name}`} className="serif text-[clamp(40px,8vw,72px)] font-normal leading-none text-maroon" />
          {first.nameMl && <Reveal delay={0.2} distance={8}><p className="ml mt-1 text-[18px] text-gold">{first.nameMl}</p></Reveal>}
          <Reveal delay={0.3} distance={10}><p className="serif my-3 text-[clamp(22px,4vw,32px)] italic text-gold2">{inv.withWord}</p></Reveal>
          <TextReveal as="p" text={`${second.fullName || second.name}`} className="serif text-[clamp(40px,8vw,72px)] font-normal leading-none text-maroon" delay={0.2} />
          {second.nameMl && <Reveal delay={0.35} distance={8}><p className="ml mt-1 text-[18px] text-gold">{second.nameMl}</p></Reveal>}
        </div>
        <Reveal delay={0.2}><p className="mx-auto max-w-[44ch] whitespace-pre-line text-[clamp(15px,1.7vw,17px)] leading-[1.9] text-muted">{inv.closing}</p></Reveal>
        <Ornament className="mt-12" />
      </div>
    </section>
  )
}
