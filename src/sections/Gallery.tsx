import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { IChevL, IChevR } from '../components/ui/Icons'
import { Lightbox } from '../components/ui/Lightbox'
import { MediaImg } from '../components/ui/MediaImg'
import { ImageReveal, Parallax, Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { useSite } from '../context/SiteContext'

// editorial rhythm for the grid: varied aspect ratios, revealed from alternating sides
const SHAPES = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-square']
const FROM = ['bottom', 'top', 'left', 'right', 'bottom', 'top'] as const

/** Featured slideshow (swipe / arrows / dots / autoplay) + clip-revealed grid. Every photo opens full-screen. */
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
    <section className="section tone-sandal weave overflow-hidden" id="gallery" aria-label="Photo gallery">
      <Seam />
      {config.backdrops.gallery && (
        <>
          <Parallax className="pointer-events-none absolute -left-24 top-24 -z-10 hidden w-[340px] opacity-60 md:block" distance={110}>
            <MediaImg src={config.backdrops.gallery} alt="" className="aspect-[3/4] w-full rounded-full object-cover [mask-image:radial-gradient(closest-side,#000_55%,transparent)]" />
          </Parallax>
          <Parallax className="pointer-events-none absolute -right-28 bottom-40 -z-10 w-[260px] opacity-50 md:w-[360px]" distance={140}>
            <MediaImg src={config.backdrops.gallery} alt="" className="aspect-[3/4] w-full -scale-x-100 rounded-full object-cover [mask-image:radial-gradient(closest-side,#000_55%,transparent)]" />
          </Parallax>
        </>
      )}
      <div className="section-inner">
        <SectionHeading eyebrow={config.gallery.eyebrow} title={config.gallery.title} lede={config.gallery.lede} />

        <ImageReveal className="mx-auto aspect-[4/5] max-w-[980px] !rounded-[24px] shadow-[0_50px_90px_-50px_rgba(0,0,0,.9)] sm:aspect-[16/10]">
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-6 pt-24 text-left sm:px-9 sm:pb-8">
              <AnimatePresence mode="wait">
                <motion.p key={i} className="serif text-[clamp(19px,2.6vw,28px)] italic text-ivory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6 }}>
                  {cur.caption || cur.alt}
                </motion.p>
              </AnimatePresence>
              <p className="mt-1 text-[10.5px] uppercase tracking-[.3em] text-gold2">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
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

        {n > 2 && (
          <div className="mx-auto mt-16 columns-2 gap-3 sm:gap-5 md:max-w-[1040px] md:columns-3">
            {photos.map((p, k) => (
              <div key={k} className="mb-3 break-inside-avoid sm:mb-5">
                <ImageReveal className={`${SHAPES[k % SHAPES.length]} !rounded-[16px]`} from={FROM[k % FROM.length]} delay={(k % 3) * 0.12}>
                  <button className="g-item h-full" onClick={() => setLb(k)} aria-label={`Open ${p.caption || p.alt}`}>
                    <MediaImg src={p.src} alt={p.alt} className="h-full w-full" />
                    {p.caption && <span className="g-cap">{p.caption}</span>}
                  </button>
                </ImageReveal>
              </div>
            ))}
          </div>
        )}
      </div>
      <Lightbox images={photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }))} index={lb} onClose={() => setLb(null)} onIndex={(k) => { setLb(k); setI(k) }} />
    </section>
  )
}
