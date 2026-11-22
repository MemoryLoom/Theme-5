import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
import { IChevL, IChevR, IClose } from './Icons'
import { MediaImg } from './MediaImg'

export interface LightboxImage { src: string; alt: string; caption?: string }

/** Full-screen viewer: swipe, arrows, keyboard, focus trap-lite, scroll lock. */
export function Lightbox({ images, index, onClose, onIndex }: { images: LightboxImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const open = index !== null
  const closeRef = useRef<HTMLButtonElement>(null)
  const go = useCallback((d: number) => { if (index === null) return; onIndex((index + d + images.length) % images.length) }, [index, images.length, onIndex])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.classList.add('locked'); closeRef.current?.focus()
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); document.body.classList.remove('locked'); prev?.focus?.() }
  }, [open, go, onClose])

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div className="tone-dark fixed inset-0 z-[5000] flex flex-col items-center justify-center !bg-[rgba(30,20,14,.96)] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Photo viewer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} onClick={onClose}>
          <button ref={closeRef} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold2 transition hover:bg-gold hover:text-bg" onClick={onClose} aria-label="Close"><IClose width={20} height={20} /></button>
          <div className="relative flex h-[76svh] w-full items-center justify-center px-3" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={index} className="flex h-full w-full items-center justify-center"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45, ease: [0.22, 0.8, 0.24, 1] }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
                onDragEnd={(_, i) => { if (i.offset.x < -60) go(1); else if (i.offset.x > 60) go(-1) }}>
                <MediaImg src={images[index].src} alt={images[index].alt} className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl" draggable={false} />
              </motion.div>
            </AnimatePresence>
          </div>
          {(images[index].caption || images[index].alt) && (
            <motion.p key={'c' + index} className="serif mt-4 px-6 text-center text-[clamp(18px,2.4vw,24px)] italic text-champagne" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              {images[index].caption || images[index].alt}
            </motion.p>
          )}
          {images.length > 1 && (
            <div className="mt-3 flex items-center gap-5 text-champagne" onClick={(e) => e.stopPropagation()}>
              <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous photo"><IChevL width={18} height={18} /></button>
              <span className="text-[11px] tracking-[.3em]">{index + 1} / {images.length}</span>
              <button className="icon-btn" onClick={() => go(1)} aria-label="Next photo"><IChevR width={18} height={18} /></button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
