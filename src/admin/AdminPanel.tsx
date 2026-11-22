import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import type { SiteConfig } from '../config/types'
import { useSite } from '../context/SiteContext'
import type { AdminSession } from '../lib/store/types'
import { IClose } from '../components/ui/Icons'
import { ContactTab, CoupleTab, EventsTab, GalleryTab, MusicTab, RsvpsTab, ShareTab, ThemeTab, WeddingTab, WishesTab, type Up } from './tabs'

const TABS = [
  ['rsvps', 'RSVPs'], ['couple', 'Couple'], ['wedding', 'Date & RSVP'], ['events', 'Events'], ['gallery', 'Gallery'],
  ['music', 'Music'], ['wishes', 'Wishes'], ['contact', 'Stream & contacts'], ['theme', 'Theme'], ['share', 'Share & data'],
] as const
type Tab = (typeof TABS)[number][0]

function Login({ onSession }: { onSession: (s: AdminSession) => void }) {
  const { store } = useSite()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [setup, setSetup] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { store?.needsSetup().then(setSetup) }, [store])
  if (!store) return <p>Connecting…</p>

  if (store.adminMode === 'owner') {
    return (
      <div className="box">
        <p className="m-0 mb-3">This hosted preview uses your claude.ai identity: the invitation’s <b>owner and editors</b> manage it — no password needed.</p>
        <button className="b pri" onClick={async () => { setErr(''); try { onSession(await store.signIn({ password: '' })) } catch (e) { setErr((e as Error).message) } }}>Continue</button>
        {err && <p className="mt-2 text-[#a8352c]">{err}</p>}
      </div>
    )
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr('')
    if (setup && pw !== pw2) return setErr('The passcodes don’t match.')
    setBusy(true)
    try { onSession(await store!.signIn({ email, password: pw })) } catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="box">
      {store.adminMode === 'password' ? (
        <>
          <label className="f"><span>Email</span><input className="in" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="f"><span>Password</span><input className="in" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required /></label>
        </>
      ) : (
        <>
          <p className="mb-3 mt-0 text-[13px] text-[#5d4e36]">
            {setup ? 'Create an admin passcode for this browser (at least 6 characters).' : 'Enter the admin passcode.'}{' '}
            <span className="text-[#8a7652]">Demo mode: data stays in this browser. Connect Supabase for real, multi-device admin login.</span>
          </p>
          <label className="f"><span>Passcode</span><input className="in" type="password" autoComplete={setup ? 'new-password' : 'current-password'} value={pw} onChange={(e) => setPw(e.target.value)} minLength={6} required /></label>
          {setup && <label className="f"><span>Repeat passcode</span><input className="in" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} required /></label>}
        </>
      )}
      {err && <p className="mb-2 text-[#a8352c]" role="alert">{err}</p>}
      <button className="b pri" disabled={busy}>{busy ? 'Checking…' : setup ? 'Create & sign in' : 'Sign in'}</button>
    </form>
  )
}

export default function AdminPanel({ session, onSession, onClose }: { session: AdminSession | null; onSession: (s: AdminSession | null) => void; onClose: () => void }) {
  const { config, setConfig, publish, store, toast } = useSite()
  const saved = useRef<SiteConfig>(config)
  const [draft, setDraft] = useState<SiteConfig>(config)
  const [tab, setTab] = useState<Tab>('rsvps')
  const [busy, setBusy] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved.current)
  const panel = useRef<HTMLDivElement>(null)

  const up: Up = useCallback((fn) => {
    setDraft((d) => { const n = structuredClone(d); fn(n); setConfig(n); return n }) // live preview behind the panel
  }, [setConfig])

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', k); panel.current?.focus()
    return () => window.removeEventListener('keydown', k)
  }) // eslint-disable-line react-hooks/exhaustive-deps

  function close() { if (dirty) setConfig(saved.current); onClose() }
  async function doPublish() {
    setBusy(true)
    try { await publish(draft); saved.current = draft; setDraft(structuredClone(draft)); toast('Published ✓') } catch (e) { toast((e as Error).message) } finally { setBusy(false) }
  }
  function discard() { setConfig(saved.current); setDraft(saved.current) }

  return (
    <motion.div className="fixed inset-0 z-[4000] flex justify-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={close}>
      <motion.div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Invitation admin"
        className="adm flex h-full w-full max-w-[600px] flex-col bg-[#faf7f0] shadow-2xl outline-none"
        initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }} onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center gap-3 border-b border-[#ece3d0] bg-white px-4 py-3">
          <div className="flex-1">
            <div className="text-[15px] font-bold">Invitation admin</div>
            <div className="text-[12px] text-[#8a7652]">{session ? `Signed in · ${session.label}` : 'Sign in to manage the invitation'}{store ? ` · ${store.kind}` : ''}</div>
          </div>
          {session && store?.adminMode !== 'owner' && <button className="b" onClick={async () => { await store?.signOut(); onSession(null) }}>Sign out</button>}
          <button className="b !px-2" onClick={close} aria-label="Close admin"><IClose width={18} height={18} /></button>
        </header>

        {!session ? (
          <div className="flex-1 overflow-y-auto p-4"><Login onSession={onSession} /></div>
        ) : (
          <>
            <nav className="flex gap-1 overflow-x-auto border-b border-[#ece3d0] bg-white px-2 py-2" aria-label="Admin sections">
              {TABS.map(([id, l]) => (
                <button key={id} onClick={() => setTab(id)} aria-current={tab === id}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${tab === id ? 'bg-[#151311] text-[#F1E5CC]' : 'text-[#6d5a3a] hover:bg-[#f4edd9]'}`}>{l}</button>
              ))}
            </nav>
            <div className="flex-1 overflow-y-auto px-4 pb-28 pt-1">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {tab === 'couple' && <CoupleTab d={draft} up={up} />}
                  {tab === 'wedding' && <WeddingTab d={draft} up={up} />}
                  {tab === 'events' && <EventsTab d={draft} up={up} />}
                  {tab === 'gallery' && <GalleryTab d={draft} up={up} />}
                  {tab === 'music' && <MusicTab d={draft} up={up} />}
                  {tab === 'rsvps' && <RsvpsTab d={draft} />}
                  {tab === 'wishes' && <WishesTab d={draft} up={up} />}
                  {tab === 'contact' && <ContactTab d={draft} up={up} />}
                  {tab === 'theme' && <ThemeTab d={draft} up={up} />}
                  {tab === 'share' && <ShareTab d={draft} up={up} />}
                </motion.div>
              </AnimatePresence>
            </div>
            <footer className="absolute bottom-0 right-0 flex w-full max-w-[600px] items-center gap-2 border-t border-[#ece3d0] bg-white/95 px-4 py-3 backdrop-blur">
              <span className="flex-1 text-[12.5px] text-[#8a7652]">{dirty ? 'Unpublished changes — previewing live behind this panel' : 'All changes published'}</span>
              <button className="b" onClick={discard} disabled={!dirty || busy}>Discard</button>
              <button className="b pri" onClick={doPublish} disabled={!dirty || busy}>{busy ? 'Publishing…' : 'Publish'}</button>
            </footer>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
