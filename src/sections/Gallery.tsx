import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { IChevL, IChevR } from '../components/ui/Icons'
import { Lightbox } from '../components/ui/Lightbox'
import { MediaImg } from '../components/ui/MediaImg'
import { ImageReveal, Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { useSite } from '../context/SiteContext'
import floralCorner from '../assets/photos/floral-corner.webp'
import templeBorder from '../assets/photos/temple-zari-border.webp'

/**
 * Guruvayoor Sannidhi Gallery: featured slideshow + lovewed-inspired alternating
 * Temple Gopuram Arch & Royal Gold Frame grid with swaying floral corners.
 */
export function Gallery() {
  const { config } = useSite()
  const photos = config.gallery.photos
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [lb, setLb] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const n = photos.length
  const go = useCallback((d: number) => { setDir(d); setI((x) => (x + d + n) % n) }, [n])

  useEffect(() => {
    if (reduce || paused || n < 2 || lb !== null) return
    const t = setInterval(() => go(1), 5600)
    return () => clearInterval(t)
  }, [go, reduce, paused, n, lb])
  useEffect(() => { if (i >= n) setI(0) }, [n, i])
  if (!n) return null
  const cur = photos[i]

  return (
    <section className="section tone-sandal weave overflow-hidden" id="gallery" aria-label="Guruvayoor Temple Photo Gallery">
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--top" />
      <Seam />

      {/* Swaying temple floral garlands in all 4 corners */}
      <div className="sticky-frame-layer" aria-hidden="true">
        <div className="sticky-frame-box">
          <span className="sway-corner sway-corner--tl"><img src={floralCorner} alt="" decoding="async" /></span>
          <span className="sway-corner sway-corner--tr"><img src={floralCorner} alt="" decoding="async" style={{ animationDelay: '-1.3s' }} /></span>
        </div>
      </div>

      <div className="section-inner relative z-10">
        <SectionHeading eyebrow={config.gallery.eyebrow} title={config.gallery.title} lede={config.gallery.lede} />

        <ImageReveal className="mx-auto aspect-[4/5] max-w-[920px] !rounded-[24px] shadow-[0_50px_90px_-50px_rgba(0,0,0,.9)] sm:aspect-[16/10]">
          <div className="relative h-full w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label={`Photo ${i + 1} of ${n}`}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.button key={i} className="g-item absolute inset-0 !rounded-[24px]"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, x: `${dir * 6}%` }} animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, x: `${-dir * 4}%` }} transition={{ duration: 1.1, ease: [0.22, 0.8, 0.24, 1] }}
                drag={n > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
                onDragStart={() => setPaused(true)} onDragEnd={(_, info) => { if (info.offset.x < -50) go(1); else if (info.offset.x > 50) go(-1) }}
                onClick={() => setLb(i)} aria-label={`Open ${cur.caption || cur.alt} full screen`}>
                <MediaImg src={cur.src} alt={cur.alt} className="h-full w-full" draggable={false} loading="eager" />
              </motion.button>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-24 text-left sm:px-9 sm:pb-8">
              <AnimatePresence mode="wait">
                <motion.p key={i} className="serif text-[clamp(19px,2.6vw,28px)] italic text-[#FFF8E8]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6 }}>
                  {cur.caption || cur.alt}
                </motion.p>
              </AnimatePresence>
              <p className="mt-1 text-[10.5px] uppercase tracking-[.3em] text-[#f4d58a]">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
            </div>
          </div>
        </ImageReveal>

        {n > 1 && (
          <Reveal className="mt-7 flex items-center justify-center gap-5" delay={0.2}>
            <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous photo"><IChevL /></button>
            <div className="flex items-center gap-2">
              {photos.map((_, k) => <button key={k} className={`dot ${k === i ? 'on' : ''}`} onClick={() => { setDir(k > i ? 1 : -1); setI(k) }} aria-label={`Show photo ${k + 1}`} aria-current={k === i} />)}
            </div>
            <button className="icon-btn" onClick={() => go(1)} aria-label="Next photo"><IChevR /></button>
          </Reveal>
        )}

        {/* Alternating Temple Arch & Gold Frame Grid (lovewed GallerySection style) */}
        {n > 1 && (
          <ul className="temple-gal-grid mt-14">
            {photos.map((p, k) => (
              <li key={k}>
                <Reveal delay={(k % 3) * 0.12} distance={28} scale={0.96}>
                  <button
                    type="button"
                    className={`temple-gal-frame ${k % 2 === 0 ? 'temple-gal-frame--arch' : ''}`}
                    onClick={() => setLb(k)}
                    aria-label={`Open ${p.caption || p.alt}`}
                  >
                    <span className="temple-gal-pic">
                      <MediaImg src={p.src} alt={p.alt} />
                      {p.caption && (
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C110B]/90 via-[#1C110B]/45 to-transparent px-3 pb-3 pt-10 text-center">
                          <span className="serif block text-[14.5px] italic leading-snug text-[#FFF8E8]">{p.caption}</span>
                        </span>
                      )}
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Lightbox images={photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }))} index={lb} onClose={() => setLb(null)} onIndex={(k) => { setLb(k); setI(k) }} />
      <img src={templeBorder} alt="" className="temple-zari-border temple-zari-border--bottom" />
    </section>
  )
}
