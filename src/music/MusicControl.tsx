import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useMusic } from './MusicContext'
import { useSite } from '../context/SiteContext'
import { IMute, IPause, IPlay, IVolume } from '../components/ui/Icons'

export function Eq({ paused }: { paused: boolean }) {
  return <span className={`eq ${paused ? 'paused' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
}

/** Floating music button: tap toggles, the small chip opens volume + track list. */
export function MusicControl() {
  const { config } = useSite()
  const m = useMusic()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', h); window.addEventListener('keydown', k)
    return () => { window.removeEventListener('pointerdown', h); window.removeEventListener('keydown', k) }
  }, [open])
  if (!config.music.enabled || !m.tracks.length) return null

  return (
    <div ref={ref}>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-label="Music settings"
            className="fixed right-[18px] z-[1301] w-[264px] rounded-2xl border border-gold/30 bg-bg2/95 p-4 text-champagne shadow-2xl backdrop-blur-md"
            style={{ bottom: 'calc(76px + env(safe-area-inset-bottom))' }}
            initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.28 }}>
            <div className="mb-3 flex items-center gap-3">
              <button onClick={m.toggle} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-bg transition hover:bg-gold2" aria-label={m.playing ? 'Pause music' : 'Play music'}>
                {m.playing ? <IPause width={18} height={18} /> : <IPlay width={22} height={22} />}
              </button>
              <div className="min-w-0">
                <div className="serif truncate text-[21px] leading-tight text-ivory">{m.track?.title}</div>
                <div className="truncate text-[12.5px] text-muted">{m.track?.subtitle || 'Background music'}</div>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <button onClick={() => m.setMuted(!m.muted)} aria-label={m.muted ? 'Unmute' : 'Mute'} className="text-gold2">
                {m.muted || m.volume === 0 ? <IMute width={18} height={18} /> : <IVolume width={18} height={18} />}
              </button>
              <input type="range" min={0} max={1} step={0.01} value={m.muted ? 0 : m.volume} onChange={(e) => m.setVolume(+e.target.value)} className="w-full" aria-label="Volume" />
            </div>
            {m.tracks.length > 1 && (
              <ul className="space-y-1">
                {m.tracks.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => m.select(t.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[15px] transition ${t.id === m.track?.id ? 'bg-gold/15 text-gold2' : 'hover:bg-ivory/5'}`}>
                      <span className="truncate">{t.title}</span>
                      {t.id === m.track?.id && <Eq paused={!m.playing} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {m.error && <p className="mt-2 text-[13px] text-[#f0a597]">{m.error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button className="fab" onClick={m.toggle} aria-label={m.playing ? 'Pause music' : 'Play music'} aria-pressed={m.playing}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: m.playing ? 1 : 0.7 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <Eq paused={!m.playing} />
      </motion.button>
      <button onClick={() => setOpen((o) => !o)} aria-label="Music settings" aria-expanded={open}
        className="fixed z-[1301] grid h-6 w-6 place-items-center rounded-full border border-gold/50 bg-bg text-[10px] text-gold2 shadow transition hover:bg-gold hover:text-bg"
        style={{ right: 12, bottom: 'calc(54px + env(safe-area-inset-bottom))' }}>⋯</button>
    </div>
  )
}
