import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IMusic } from '../components/ui/Icons'
import { useSite } from '../context/SiteContext'
import { useMusic } from './MusicContext'

const NAV_ITEMS = [
  { id: 'top', label: 'Guruvayoor Sannidhi' },
  { id: 'invitation', label: 'Sacred Invitation' },
  { id: 'story', label: 'Our Story' },
  { id: 'date', label: 'Muhurtham Date' },
  { id: 'events', label: 'Temple Ceremonies' },
  { id: 'gallery', label: 'Temple Gallery' },
  { id: 'rsvp', label: 'RSVP' },
]

/**
 * Floating bottom-right controls (inspired by lovewed FloatingControls):
 * 1) Quick-Jump Section Menu with active glowing gold diamond indicator
 * 2) Music Equalizer & Track/Volume Popover
 */
export function MusicControl() {
  const { config } = useSite()
  const m = useMusic()
  const [musicOpen, setMusicOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [activeId, setActiveId] = useState('top')
  const ref = useRef<HTMLDivElement>(null)

  const updateActive = useCallback(() => {
    const threshold = window.innerHeight * 0.42
    let current = NAV_ITEMS[0].id
    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= threshold) {
        current = item.id
      }
    }
    setActiveId(current)
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; updateActive() })
    }
    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [updateActive])

  useEffect(() => {
    if (!musicOpen && !navOpen) return
    const h = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) { setMusicOpen(false); setNavOpen(false) } }
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMusicOpen(false); setNavOpen(false) } }
    window.addEventListener('pointerdown', h)
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('pointerdown', h); window.removeEventListener('keydown', k) }
  }, [musicOpen, navOpen])

  const jumpTo = (id: string) => {
    setNavOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div ref={ref} className="tone-dark fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-[1300] flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            key="nav-panel"
            aria-label="Quick section navigation"
            className="w-[235px] rounded-[20px_20px_6px_20px] border border-gold/55 bg-[#24140d]/95 p-2.5 text-left shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-3 pb-1.5 pt-1 text-[9.5px] uppercase tracking-[.28em] text-kasavu/80">
              Guruvayoor Sannidhi
            </div>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {NAV_ITEMS.map((item) => {
                const on = activeId === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] uppercase tracking-[.16em] transition ${
                        on ? 'bg-gold/20 text-kasavu font-medium' : 'text-ivory/90 hover:bg-gold/10'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rotate-45 border border-kasavu transition ${
                          on ? 'bg-kasavu shadow-[0_0_10px_#f4d58a]' : ''
                        }`}
                        aria-hidden="true"
                      />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}

        {musicOpen && config.music.enabled && m.track && (
          <motion.div
            key="music-panel"
            role="dialog"
            aria-label="Music controls"
            className="w-[254px] rounded-2xl border border-gold/45 bg-[#24140d]/95 p-4 text-left shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="label !text-[9px]">Sopana Sangeetham</div>
                <div className="serif truncate text-[19px] text-ivory">{m.track.title}</div>
                {m.track.subtitle && <div className="truncate text-[11.5px] text-muted">{m.track.subtitle}</div>}
              </div>
              <button className="btn btn-primary !px-3.5 !py-2 !text-[10px]" onClick={m.toggle}>{m.playing ? 'Pause' : 'Play'}</button>
            </div>
            {m.tracks.length > 1 && (
              <div className="mt-3 space-y-1 border-t border-[var(--line-soft)] pt-2.5">
                {m.tracks.map((t) => (
                  <button key={t.id} onClick={() => m.select(t.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition ${t.id === m.track?.id ? 'bg-gold/20 text-gold2' : 'text-muted hover:text-ivory'}`}>
                    <span className="truncate">{t.title}</span>{t.id === m.track?.id && <span className="text-[10px]">●</span>}
                  </button>
                ))}
              </div>
            )}
            <label className="mt-3 flex items-center gap-2.5 border-t border-[var(--line-soft)] pt-2.5 text-[10px] uppercase tracking-[.2em] text-muted">
              Vol
              <input type="range" min={0} max={1} step={0.05} value={m.volume} onChange={(e) => m.setVolume(+e.target.value)} className="h-1 flex-1 cursor-pointer" aria-label="Music volume" />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-2.5">
        {config.music.enabled && m.track && (
          <button
            type="button"
            className={`fab !static ${m.playing ? '!border-kasavu !bg-kasavu !text-[#2B1B12]' : ''}`}
            onClick={() => {
              if (!m.playing && !musicOpen) m.play()
              setNavOpen(false)
              setMusicOpen((o) => !o)
            }}
            aria-label={m.playing ? 'Music controls (playing)' : 'Play background music'}
            aria-expanded={musicOpen}
          >
            {m.playing ? <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span> : <IMusic width={18} height={18} />}
          </button>
        )}

        <button
          type="button"
          className={`fab !static ${navOpen ? '!border-kasavu !bg-kasavu !text-[#2B1B12]' : ''}`}
          onClick={() => {
            setMusicOpen(false)
            setNavOpen((o) => !o)
          }}
          aria-label={navOpen ? 'Close section menu' : 'Open section menu'}
          aria-expanded={navOpen}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            {navOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  )
}
