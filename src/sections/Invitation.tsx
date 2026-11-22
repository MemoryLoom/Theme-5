import { useCallback, useRef } from 'react'
import { Backdrop, Ornament } from '../components/ui/Reveal'
import { RollingScroll, SectionFlowerRain } from '../components/ui/RollingScroll'
import { JasmineStrand, MayilpeeliFlute, Nilavilakku } from '../components/decor/Kerala'
import { useCouple, useSite } from '../context/SiteContext'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'
import templeMandapArch from '../assets/photos/temple-mandap-arch.webp'

/**
 * The sacred Guruvayoor temple wedding invitation section ("ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ")
 * using the lovewed.in/aaravwedsaadhya RollingScroll unrolling parchment effect.
 * Text lines reveal directly in sync with the scroll's unrolling progress so there is zero timing lag.
 */
export function Invitation() {
  const { config } = useSite()
  const { first, second } = useCouple()
  const inv = config.invitation
  const cascadeRef = useRef<HTMLDivElement>(null)

  const handleProgress = useCallback((p: number) => {
    if (p > 0.18 && cascadeRef.current && !cascadeRef.current.classList.contains('is-in')) {
      cascadeRef.current.classList.add('is-in')
    }
  }, [])

  let lineIdx = 0
  const lineStyle = () => ({ '--i': lineIdx++ } as React.CSSProperties)

  return (
    <section className="section tone-light weave overflow-hidden" id="invitation" aria-label="Sacred Guruvayoor Invitation">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Backdrop src={config.backdrops.invitation} sepia distance={60} opacity={0.42} />

      {/* Sticky viewport floral garlands & gentle falling temple flowers */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.4s' }} /></span>
          <SectionFlowerRain />
        </div>
      </div>

      <div className="section-inner relative z-10 max-w-[740px]">
        {/* Unrolling Royal Temple Scroll for "ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ" */}
        <RollingScroll variant="ivory" startAt={0.95} distance={0.38} onProgress={handleProgress}>
          <div ref={cascadeRef} className="invite-cascade is-in relative py-2 text-center">
            {/* Subtle Guruvayoor caparisoned temple elephants & arch watermark */}
            <img
              src={templeMandapArch}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto w-[92%] -translate-y-1/2 object-contain opacity-[0.12]"
            />

            <div className="relative z-10 mx-auto max-w-[480px]">
              <p className="invite-cascade__line ml text-[clamp(13.5px,2.5vw,17px)] !font-semibold tracking-wide text-[#5A1A22]" style={lineStyle()}>
                ഓം നമോ ഭഗവതേ വാസുദേവായ · ശ്രീ ഗുരുവായൂരപ്പൻ തുണ
              </p>

              <div className="invite-cascade__line" style={lineStyle()}>
                <MayilpeeliFlute className="mx-auto mt-1.5 h-10 w-26 sm:h-11 sm:w-28" />
              </div>

              <div className="invite-cascade__line" style={lineStyle()}>
                <div className="eyebrow !mb-2 mt-1 !text-[#7A4B1E]">{inv.eyebrow}</div>
              </div>

              <p className="invite-cascade__line ml mt-1 text-[clamp(19px,3.5vw,29px)] !font-semibold leading-snug text-[#5A1A22]" style={lineStyle()}>
                {inv.inviteMl}
              </p>

              <div className="invite-cascade__line" style={lineStyle()}>
                <JasmineStrand className="mx-auto mt-2.5 h-6 w-[190px]" />
              </div>

              <p className="invite-cascade__line serif mt-3 text-[clamp(17.5px,2.6vw,23px)] italic text-[#7A4B1E]" style={lineStyle()}>
                {inv.lead}
              </p>

              {inv.hosts.map((h, i) => (
                <div key={i} className="invite-cascade__line" style={lineStyle()}>
                  {i > 0 && <p className="my-1.5 text-[10px] uppercase tracking-[.3em] text-[#8C6229]">{inv.hostsJoiner}</p>}
                  <p className="serif text-[clamp(19px,3.1vw,27px)] font-medium leading-snug text-[#2B1B12]">{h}</p>
                </div>
              ))}

              <p className="invite-cascade__line mx-auto mt-4 max-w-[42ch] whitespace-pre-line text-[clamp(14px,1.6vw,16px)] leading-[1.8] text-[#4E3829]" style={lineStyle()}>
                {inv.request}
              </p>

              <div className="my-6">
                <p className="invite-cascade__line serif text-[clamp(34px,7vw,58px)] font-medium leading-none text-[#5A1A22]" style={lineStyle()}>
                  {first.fullName || first.name}
                </p>
                {first.nameMl && (
                  <p className="invite-cascade__line ml mt-1 text-[16.5px] text-[#8C6229]" style={lineStyle()}>
                    {first.nameMl}
                  </p>
                )}
                {first.parents && (
                  <p className="invite-cascade__line serif mt-0.5 text-[15px] italic text-[#5B4332]" style={lineStyle()}>
                    ({first.parents})
                  </p>
                )}

                <div className="invite-cascade__line my-3 flex items-center justify-center gap-3" style={lineStyle()}>
                  <span className="h-px w-10 bg-[#A8803E]/50" />
                  <Nilavilakku className="h-7 w-5 text-[#8C6229]" flames={3} />
                  <span className="serif text-[clamp(19px,3.4vw,25px)] italic text-[#7A4B1E]">{inv.withWord}</span>
                  <Nilavilakku className="h-7 w-5 text-[#8C6229]" flames={3} />
                  <span className="h-px w-10 bg-[#A8803E]/50" />
                </div>

                <p className="invite-cascade__line serif text-[clamp(34px,7vw,58px)] font-medium leading-none text-[#5A1A22]" style={lineStyle()}>
                  {second.fullName || second.name}
                </p>
                {second.nameMl && (
                  <p className="invite-cascade__line ml mt-1 text-[16.5px] text-[#8C6229]" style={lineStyle()}>
                    {second.nameMl}
                  </p>
                )}
                {second.parents && (
                  <p className="invite-cascade__line serif mt-0.5 text-[15px] italic text-[#5B4332]" style={lineStyle()}>
                    ({second.parents})
                  </p>
                )}
              </div>

              <p className="invite-cascade__line mx-auto max-w-[42ch] whitespace-pre-line text-[clamp(14px,1.6vw,16px)] leading-[1.8] text-[#4E3829]" style={lineStyle()}>
                {inv.closing}
              </p>

              <div className="invite-cascade__line mt-4" style={lineStyle()}>
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#A8803E]/50 bg-[#FFF8E8]/90 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[.22em] text-[#5A1A22] shadow-sm">
                  <span>✦</span> East Nada Mandapam · Guruvayoor Temple <span>✦</span>
                </div>
              </div>

              <div className="invite-cascade__line" style={lineStyle()}>
                <Ornament className="mt-6" />
              </div>
            </div>
          </div>
        </RollingScroll>
      </div>

      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
