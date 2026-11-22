import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { Wish } from '../config/types'
import { ICamera, IClose, ITrash } from '../components/ui/Icons'
import { MediaImg } from '../components/ui/MediaImg'
import { Reveal, SectionHeading, Seam } from '../components/ui/Reveal'
import { useSite } from '../context/SiteContext'
import { relTime } from '../lib/date'

function WishCard({ w, i, canDelete, onDelete }: { w: Wish; i: number; canDelete: boolean; onDelete: () => void }) {
  return (
    <motion.article layout="position" className="card relative mb-4 break-inside-avoid !rounded-2xl p-6 text-left"
      initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.22, 0.8, 0.24, 1] }}>
      <span className="serif pointer-events-none absolute right-5 top-1 text-[64px] leading-none text-gold/15" aria-hidden="true">”</span>
      <p className="serif m-0 whitespace-pre-line break-words text-[19px] leading-[1.6] text-ink">{w.message}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-[var(--line-soft)] pt-4">
        <div className="avatar !h-10 !w-10 !text-[18px]">{w.photo ? <MediaImg src={w.photo} alt="" /> : (w.name.trim()[0] || '♥').toUpperCase()}</div>
        <div className="min-w-0">
          <h3 className="m-0 truncate text-[14px] font-normal tracking-wide text-ivory">{w.name}</h3>
          <time className="block text-[10px] uppercase tracking-[.22em] text-muted/70" dateTime={w.createdAt}>{relTime(w.createdAt)}</time>
        </div>
      </div>
      {canDelete && !w.id.startsWith('sample-') && (
        <button onClick={onDelete} className="icon-btn absolute right-3 top-3 !h-8 !w-8" aria-label={`Delete wish from ${w.name}`}><ITrash width={13} height={13} /></button>
      )}
    </motion.article>
  )
}

export function Wishes({ isAdmin }: { isAdmin: boolean }) {
  const { config, store, toast } = useSite()
  const c = config.wishes
  const [wishes, setWishes] = useState<Wish[] | null>(null)
  const [loadErr, setLoadErr] = useState('')
  const [shown, setShown] = useState(c.pageSize)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  useEffect(() => {
    if (!store) return
    return store.subscribeWishes((w) => { setWishes(w); setLoadErr('') }, setLoadErr)
  }, [store])

  // real guest wishes first, then the template's sample wishes
  const list = useMemo(() => [
    ...(wishes ?? []),
    ...(c.samples ?? []).map((s, k): Wish => ({ id: 'sample-' + k, name: s.name, message: s.message, createdAt: s.createdAt })),
  ], [wishes, c.samples])

  if (!c.enabled) return null

  const pick = (f?: File) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { setErr('Please choose an image file.'); return }
    if (f.size > 15 * 1024 * 1024) { setErr('That photo is larger than 15 MB.'); return }
    setErr(''); setPhoto(f)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) return setErr('Please add your name.')
    if (msg.trim().length < 2) return setErr('Please write a short wish.')
    if (!store) return
    setBusy(true); setErr('')
    try {
      await store.addWish({ name: name.trim(), message: msg.trim(), photo: photo ?? undefined })
      setMsg(''); setPhoto(null); if (fileRef.current) fileRef.current.value = ''
      toast('Your wish has been sent ♥')
    } catch (x) { setErr((x as Error).message || 'Could not send your wish.') } finally { setBusy(false) }
  }

  async function del(id: string) {
    if (!store) return
    try { await store.deleteWish(id); toast('Wish removed') } catch (x) { toast((x as Error).message) }
  }

  return (
    <section className="section tone-light" id="wishes" aria-label="Wishes wall">
      <Seam />
      <div className="section-inner">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lede={c.lede} />
        <Reveal distance={40}>
          <form onSubmit={submit} noValidate className="card card-corner mx-auto mb-14 max-w-[620px] px-5 py-8 text-left sm:px-9">
            <div className="mb-5 flex items-center gap-4">
              <button type="button" onClick={() => fileRef.current?.click()} className="group relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-gold/40 text-gold2 transition hover:border-gold hover:bg-gold/10" aria-label="Add your photo (optional)">
                {preview ? <img src={preview} alt="Your photo" className="h-full w-full object-cover" /> : <ICamera width={22} height={22} className="transition group-hover:scale-110" />}
              </button>
              <div className="flex-1 text-[14.5px] text-muted">
                {photo ? <span className="inline-flex items-center gap-2 text-champagne">Photo added <button type="button" className="text-gold2" onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = '' }} aria-label="Remove photo"><IClose width={14} height={14} /></button></span>
                  : <>Add your photo <span className="opacity-60">(optional)</span></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
            </div>
            <label className="sr-only" htmlFor="wish-name">Your name</label>
            <input id="wish-name" className="input mb-3" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
            <label className="sr-only" htmlFor="wish-msg">Your wish</label>
            <textarea id="wish-msg" className="textarea !resize-none" rows={4} placeholder={c.placeholder} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={800} />
            <div className="mt-1.5 text-right text-[10px] tracking-[.2em] text-muted/60">{msg.length}/800</div>
            {err && <p className="field-error" role="alert">{err}</p>}
            <button className="btn btn-primary mt-4 w-full !py-[17px]" disabled={busy || !store}>{busy ? 'Sending…' : 'Send your wishes'}</button>
          </form>
        </Reveal>

        <div className="mx-auto max-w-[560px] columns-1 gap-4 md:max-w-[1080px] md:columns-2 lg:columns-3">
          <AnimatePresence initial={false}>
            {list.slice(0, shown).map((w, i) => <WishCard key={w.id} w={w} i={i} canDelete={isAdmin} onDelete={() => del(w.id)} />)}
          </AnimatePresence>
        </div>
        {wishes === null && !loadErr && <div className="py-6"><span className="loader-dots" aria-label="Loading wishes"><span /><span /><span /></span></div>}
        {loadErr && <p className="mt-4 text-[15px] text-muted">{loadErr}</p>}
        {list.length > shown && (
          <motion.button className="btn btn-ghost mt-8 !px-9" onClick={() => setShown((s) => s + c.pageSize)} whileTap={{ scale: 0.96 }}>
            Load more <span className="opacity-60">({list.length - shown})</span>
          </motion.button>
        )}
      </div>
    </section>
  )
}
