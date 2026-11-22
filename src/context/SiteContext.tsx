import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CONFIG_VERSION, defaultConfig } from '../config/defaultConfig'
import type { SiteConfig } from '../config/types'
import { createStore, type WeddingStore } from '../lib/store'

interface Ctx {
  config: SiteConfig
  /** Replace the live config (admin preview). Does not persist — call `publish`. */
  setConfig: (c: SiteConfig) => void
  publish: (c: SiteConfig) => Promise<void>
  store: WeddingStore | null
  ready: boolean
  guestName: string
  toast: (msg: string) => void
  toastMsg: string
  adminOpen: boolean
  setAdminOpen: (v: boolean) => void
}
const SiteCtx = createContext<Ctx | null>(null)

/** Merge a saved config over defaults so new template fields always exist. */
export function mergeConfig(base: SiteConfig, saved: Partial<SiteConfig> | null): SiteConfig {
  if (!saved) return base
  const out: any = Array.isArray(base) ? [...base] : { ...base }
  for (const [k, v] of Object.entries(saved)) {
    const b = (base as any)[k]
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b) ? mergeConfig(b, v as any) : v
  }
  return out
}

function readGuest(): string {
  try {
    const q = new URLSearchParams(location.search).get('to') || new URLSearchParams(location.search).get('guest')
    if (q) return q.slice(0, 60)
    const h = decodeURIComponent(location.hash.replace(/^#/, ''))
    if (/^to-/i.test(h)) return h.slice(3).replace(/[-_]+/g, ' ').trim().slice(0, 60)
  } catch { /* ignore */ }
  return ''
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [store, setStore] = useState<WeddingStore | null>(null)
  const [ready, setReady] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const guestName = useMemo(readGuest, [])
  const tRef = useRef<number>()

  useEffect(() => {
    let alive = true
    const fallback = window.setTimeout(() => alive && setReady(true), 9000)
    createStore()
      .then(async (s) => {
        if (!alive) return
        setStore(s)
        const saved = await s.loadConfig().catch(() => null)
        // configs saved by an older template version are ignored (content model changed)
        if (alive && saved && saved.version === CONFIG_VERSION) setConfig(mergeConfig(defaultConfig, saved))
      })
      .catch((e) => console.error(e))
      .finally(() => { clearTimeout(fallback); alive && setReady(true) })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const open = () => location.hash === '#admin' && setAdminOpen(true)
    open(); window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])

  const toast = useCallback((m: string) => {
    setToastMsg(m); clearTimeout(tRef.current); tRef.current = window.setTimeout(() => setToastMsg(''), 2800)
  }, [])

  const publish = useCallback(async (c: SiteConfig) => {
    if (!store) throw new Error('Still connecting…')
    await store.saveConfig(c); setConfig(c)
  }, [store])

  const value = useMemo(() => ({ config, setConfig, publish, store, ready, guestName, toast, toastMsg, adminOpen, setAdminOpen }),
    [config, publish, store, ready, guestName, toast, toastMsg, adminOpen])
  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>
}

export function useSite() {
  const c = useContext(SiteCtx); if (!c) throw new Error('useSite outside provider'); return c
}

/** Couple in display order + monogram letters. */
export function useCouple() {
  const { config } = useSite()
  const { groom, bride, order, monogram } = config.couple
  const first = order === 'groom-first' ? groom : bride
  const second = order === 'groom-first' ? bride : groom
  const mono = (monogram?.trim() || (first.name[0] || '') + (second.name[0] || '')).toUpperCase().slice(0, 2)
  return { first, second, groom, bride, mono, names: `${first.name} & ${second.name}` }
}
