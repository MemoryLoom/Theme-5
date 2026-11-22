import { Backdrop, Ornament, Reveal, RevealItem, TextReveal } from '../components/ui/Reveal'
import { JasmineStrand, MayilpeeliFlute, MuralCorner, Nilavilakku } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'

/** The formal Guruvayoor temple wedding invitation scroll from both families. */
export function Invitation() {
  const { config } = useSite()
  const { first, second } = useCouple()
  const inv = config.invitation
  return (
    <section className="section tone-light weave" id="invitation" aria-label="Invitation">
      <Backdrop src={config.backdrops.invitation} sepia distance={60} />
      <div className="section-inner max-w-[820px]">
        <div className="card relative overflow-hidden px-6 py-12 sm:px-14 sm:py-16">
          <div className="kasavu-band absolute inset-x-0 top-0 !h-[10px]" aria-hidden="true" />
          <div className="kasavu-band absolute inset-x-0 bottom-0 !h-[10px]" aria-hidden="true" />
          <MuralCorner className="absolute left-3 top-4 h-16 w-16" />
          <MuralCorner className="absolute right-3 top-4 h-16 w-16 scale-x-[-1]" />
          <MuralCorner className="absolute bottom-4 left-3 h-16 w-16 scale-y-[-1]" />
          <MuralCorner className="absolute bottom-4 right-3 h-16 w-16 scale-[-1]" />

          <Reveal distance={10} dir="none">
            <p className="ml text-[14px] tracking-wide text-maroon/85">ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ</p>
            <MayilpeeliFlute className="mx-auto mt-2 h-12 w-32" />
          </Reveal>
          <Reveal distance={14}><div className="eyebrow mt-2">{inv.eyebrow}</div></Reveal>
          <TextReveal as="p" text={inv.inviteMl} className="ml mt-1 text-[clamp(22px,4.2vw,34px)] !font-semibold text-maroon" />
          <JasmineStrand className="mx-auto mt-5 h-6 w-[220px]" />

          <Reveal stagger={0.14} className="mt-5">
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

          <div className="my-10">
            <TextReveal as="p" text={`${first.fullName || first.name}`} className="serif text-[clamp(40px,8vw,70px)] font-normal leading-none text-maroon" />
            {first.nameMl && <Reveal delay={0.15} distance={8}><p className="ml mt-1.5 text-[18px] text-gold">{first.nameMl}</p></Reveal>}
            {first.parents && <Reveal delay={0.2} distance={8}><p className="serif mt-1 text-[16.5px] italic text-muted">({first.parents})</p></Reveal>}

            <Reveal delay={0.28} distance={10} className="my-4 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gold/40" />
              <Nilavilakku className="h-9 w-6 text-gold" flames={3} />
              <span className="serif text-[clamp(22px,4vw,30px)] italic text-gold2">{inv.withWord}</span>
              <Nilavilakku className="h-9 w-6 text-gold" flames={3} />
              <span className="h-px w-12 bg-gold/40" />
            </Reveal>

            <TextReveal as="p" text={`${second.fullName || second.name}`} className="serif text-[clamp(40px,8vw,70px)] font-normal leading-none text-maroon" delay={0.2} />
            {second.nameMl && <Reveal delay={0.35} distance={8}><p className="ml mt-1.5 text-[18px] text-gold">{second.nameMl}</p></Reveal>}
            {second.parents && <Reveal delay={0.4} distance={8}><p className="serif mt-1 text-[16.5px] italic text-muted">({second.parents})</p></Reveal>}
          </div>

          <Reveal delay={0.2}>
            <p className="mx-auto max-w-[46ch] whitespace-pre-line text-[clamp(15px,1.7vw,17px)] leading-[1.9] text-muted">{inv.closing}</p>
            <div className="mx-auto mt-6 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-bg3/70 px-5 py-2 text-[11px] uppercase tracking-[.28em] text-maroon">
              <span>✦</span> East Nada Mandapam · Guruvayoor Sri Krishna Temple <span>✦</span>
            </div>
          </Reveal>
          <Ornament className="mt-10" />
        </div>
      </div>
    </section>
  )
}
