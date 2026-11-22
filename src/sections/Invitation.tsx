import { useEffect, useRef } from 'react'
import { Backdrop, Ornament } from '../components/ui/Reveal'
import { RollingScroll, SectionFlowerRain } from '../components/ui/RollingScroll'
import { JasmineStrand, MayilpeeliFlute, Nilavilakku } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'
import templeGround from '../assets/photos/temple-ground.webp'
import templeMandapArch from '../assets/photos/temple-mandap-arch.webp'

/**
 * The sacred Guruvayoor temple wedding invitation section ("ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ")
 * combining the lovewed.in/aaravwedsaadhya RollingScroll unrolling parchment effect,
 * staggered line-by-line scroll cascade, swaying floral corners, and scroll-linked rising temple courtyard.
 */
export function Invitation() {
  const { config } = useSite()
  const { first, second } = useCouple()
  const inv = config.invitation
  const secRef = useRef<HTMLElement>(null)
  const cascadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sec = secRef.current
    const cas = cascadeRef.current
    if (!sec || !cas) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cas.classList.add('is-in')
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(cas)

    let raf = 0
    const onScroll = () => {
      raf = 0
      const vh = window.innerHeight
      const bottomDist = sec.getBoundingClientRect().bottom - vh
      sec.style.setProperty('--o', String(Math.min(Math.max(bottomDist, 0), vh)))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(onScroll)
    }
    onScroll()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  let lineIdx = 0
  const lineStyle = () => ({ '--i': lineIdx++ } as React.CSSProperties)

  return (
    <section ref={secRef} className="section tone-light weave overflow-hidden !pb-0" id="invitation" aria-label="Sacred Guruvayoor Invitation">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Backdrop src={config.backdrops.invitation} sepia distance={65} opacity={0.45} />

      {/* Sticky viewport floral garlands & gentle falling temple flowers */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.4s' }} /></span>
          <SectionFlowerRain />
        </div>
      </div>

      <div className="section-inner relative z-10 max-w-[760px]">
        {/* Unrolling Royal Temple Scroll for "ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ" */}
        <RollingScroll variant="ivory" startAt={0.9} distance={0.65}>
          <div ref={cascadeRef} className="invite-cascade relative py-2 text-center">
            {/* Subtle Guruvayoor caparisoned temple elephants & arch watermark */}
            <img
              src={templeMandapArch}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto w-[96%] -translate-y-1/2 object-contain opacity-[0.14]"
            />

            <div className="relative z-10">
              <p className="invite-cascade__line ml text-[clamp(14px,2.7vw,17.5px)] !font-semibold tracking-wide text-[#5A1A22]" style={lineStyle()}>
                ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ
              </p>

              <div className="invite-cascade__line" style={lineStyle()}>
                <MayilpeeliFlute className="mx-auto mt-1.5 h-11 w-28" />
              </div>

              <div className="invite-cascade__line" style={lineStyle()}>
                <div className="eyebrow !mb-2 mt-1 !text-[#7A4B1E]">{inv.eyebrow}</div>
              </div>

              <p className="invite-cascade__line ml mt-1 text-[clamp(20px,3.8vw,31px)] !font-semibold leading-snug text-[#5A1A22]" style={lineStyle()}>
                {inv.inviteMl}
              </p>

              <div className="invite-cascade__line" style={lineStyle()}>
                <JasmineStrand className="mx-auto mt-3 h-6 w-[200px]" />
              </div>

              <p className="invite-cascade__line serif mt-3 text-[clamp(18px,2.8vw,24px)] italic text-[#7A4B1E]" style={lineStyle()}>
                {inv.lead}
              </p>

              {inv.hosts.map((h, i) => (
                <div key={i} className="invite-cascade__line" style={lineStyle()}>
                  {i > 0 && <p className="my-1.5 text-[10.5px] uppercase tracking-[.32em] text-[#8C6229]">{inv.hostsJoiner}</p>}
                  <p className="serif text-[clamp(20px,3.3vw,28px)] font-medium leading-snug text-[#2B1B12]">{h}</p>
                </div>
              ))}

              <p className="invite-cascade__line mx-auto mt-5 max-w-[44ch] whitespace-pre-line text-[clamp(14.5px,1.65vw,16.5px)] leading-[1.85] text-[#4E3829]" style={lineStyle()}>
                {inv.request}
              </p>

              <div className="my-7">
                <p className="invite-cascade__line serif text-[clamp(36px,7.5vw,64px)] font-medium leading-none text-[#5A1A22]" style={lineStyle()}>
                  {first.fullName || first.name}
                </p>
                {first.nameMl && (
                  <p className="invite-cascade__line ml mt-1 text-[17px] text-[#8C6229]" style={lineStyle()}>
                    {first.nameMl}
                  </p>
                )}
                {first.parents && (
                  <p className="invite-cascade__line serif mt-0.5 text-[15.5px] italic text-[#5B4332]" style={lineStyle()}>
                    ({first.parents})
                  </p>
                )}

                <div className="invite-cascade__line my-3.5 flex items-center justify-center gap-3.5" style={lineStyle()}>
                  <span className="h-px w-10 bg-[#A8803E]/50" />
                  <Nilavilakku className="h-8 w-5 text-[#8C6229]" flames={3} />
                  <span className="serif text-[clamp(20px,3.6vw,27px)] italic text-[#7A4B1E]">{inv.withWord}</span>
                  <Nilavilakku className="h-8 w-5 text-[#8C6229]" flames={3} />
                  <span className="h-px w-10 bg-[#A8803E]/50" />
                </div>

                <p className="invite-cascade__line serif text-[clamp(36px,7.5vw,64px)] font-medium leading-none text-[#5A1A22]" style={lineStyle()}>
                  {second.fullName || second.name}
                </p>
                {second.nameMl && (
                  <p className="invite-cascade__line ml mt-1 text-[17px] text-[#8C6229]" style={lineStyle()}>
                    {second.nameMl}
                  </p>
                )}
                {second.parents && (
                  <p className="invite-cascade__line serif mt-0.5 text-[15.5px] italic text-[#5B4332]" style={lineStyle()}>
                    ({second.parents})
                  </p>
                )}
              </div>

              <p className="invite-cascade__line mx-auto max-w-[44ch] whitespace-pre-line text-[clamp(14.5px,1.65vw,16.5px)] leading-[1.85] text-[#4E3829]" style={lineStyle()}>
                {inv.closing}
              </p>

              <div className="invite-cascade__line mt-5" style={lineStyle()}>
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#A8803E]/50 bg-[#FFF8E8]/85 px-4 py-1.5 text-[10.5px] font-medium uppercase tracking-[.24em] text-[#5A1A22] shadow-sm">
                  <span>✦</span> East Nada Mandapam · Guruvayoor Temple <span>✦</span>
                </div>
              </div>

              <div className="invite-cascade__line" style={lineStyle()}>
                <Ornament className="mt-7" />
              </div>
            </div>
          </div>
        </RollingScroll>
      </div>

      {/* Scroll-linked Guruvayoor temple courtyard ground with brass Deepastambham lamps & garlands */}
      <div className="invite-ground-wrap" aria-hidden="true">
        <img src={templeGround} alt="" className="mx-auto block w-full max-w-[1280px] object-cover" loading="lazy" decoding="async" />
      </div>
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
