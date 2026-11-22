import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSite } from '../context/SiteContext'
import { resolveMedia } from '../lib/media'
import type { Track } from '../config/types'

interface MusicCtx {
  playing: boolean
  track: Track | undefined
  tracks: Track[]
  volume: number
  muted: boolean
  error: string
  /** Must be called from a user gesture the first time (autoplay rules). */
  play: () => Promise<void>
  pause: () => void
  toggle: () => void
  setVolume: (v: number) => void
  setMuted: (m: boolean) => void
  select: (id: string) => void
}
const Ctx = createContext<MusicCtx | null>(null)
const PREF = 'vivaha:music-pref'

export function MusicProvider({ children }: { children: ReactNode }) {
  const { config } = useSite()
  const tracks = config.music.tracks
  const pref = useMemo(() => { try { return JSON.parse(localStorage.getItem(PREF) || '{}') as { v?: number; m?: boolean; id?: string } } catch { return {} } }, [])
  const audio = useRef<HTMLAudioElement | null>(null)
  const [trackId, setTrackId] = useState<string>(config.music.currentId)
  const [playing, setPlaying] = useState(false)
  const [volume, setVol] = useState<number>(pref.v ?? config.music.volume)
  const [muted, setMuted] = useState<boolean>(pref.m ?? false)
  const [error, setError] = useState('')
  const wantPlay = useRef(false)
  const resumeOnVisible = useRef(false)

  // follow the admin-chosen default when the config changes
  useEffect(() => { setTrackId(config.music.currentId) }, [config.music.currentId])

  const track = tracks.find((t) => t.id === trackId) ?? tracks[0]

  if (!audio.current && typeof Audio !== 'undefined') {
    audio.current = new Audio(); audio.current.loop = true; audio.current.preload = 'none'
  }

  useEffect(() => {
    const a = audio.current; if (!a) return
    const on = () => setPlaying(true), off = () => setPlaying(false)
    const err = () => { setPlaying(false); setError('This track could not be played.') }
    a.addEventListener('play', on); a.addEventListener('pause', off); a.addEventListener('error', err)
    return () => { a.removeEventListener('play', on); a.removeEventListener('pause', off); a.removeEventListener('error', err) }
  }, [])

  // load a new source when the track changes; keep playing if we were
  useEffect(() => {
    const a = audio.current; if (!a || !track) return
    let alive = true
    resolveMedia(track.src).then((url) => {
      if (!alive || !url) return
      if (a.src !== url) { a.src = url; a.load() }
      if (wantPlay.current) a.play().catch(() => setPlaying(false))
    })
    return () => { alive = false }
  }, [track?.src]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (audio.current) { audio.current.volume = volume; audio.current.muted = muted } }, [volume, muted])
  useEffect(() => { try { localStorage.setItem(PREF, JSON.stringify({ v: volume, m: muted })) } catch { /* ignore */ } }, [volume, muted])

  // be polite: pause in background tabs, resume when the guest returns
  useEffect(() => {
    const vis = () => {
      const a = audio.current; if (!a) return
      if (document.hidden) { resumeOnVisible.current = !a.paused; a.pause() }
      else if (resumeOnVisible.current) { a.play().catch(() => {}); resumeOnVisible.current = false }
    }
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [])

  const play = useCallback(async () => {
    const a = audio.current; if (!a || !track || !config.music.enabled) return
    wantPlay.current = true; setError('')
    const url = await resolveMedia(track.src)
    if (url && a.src !== url) { a.src = url }
    try { await a.play() } catch { setPlaying(false) }
  }, [track, config.music.enabled])
  const pause = useCallback(() => { wantPlay.current = false; audio.current?.pause() }, [])
  const toggle = useCallback(() => { audio.current && !audio.current.paused ? pause() : play() }, [play, pause])
  const setVolume = useCallback((v: number) => { setVol(Math.max(0, Math.min(1, v))); if (v > 0) setMuted(false) }, [])
  const select = useCallback((id: string) => { wantPlay.current = true; setTrackId(id) }, [])

  useEffect(() => () => { audio.current?.pause() }, [])

  const value = useMemo(() => ({ playing, track, tracks, volume, muted, error, play, pause, toggle, setVolume, setMuted, select }),
    [playing, track, tracks, volume, muted, error, play, pause, toggle, setVolume, select])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMusic() { const c = useContext(Ctx); if (!c) throw new Error('useMusic outside provider'); return c }
