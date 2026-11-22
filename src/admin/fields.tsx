import { useRef, useState, type ReactNode } from 'react'
import { useSite } from '../context/SiteContext'
import { MediaImg } from '../components/ui/MediaImg'
import { ITrash, IUpload } from '../components/ui/Icons'

export function Text({ label, value, onChange, multiline, placeholder, hint, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string; hint?: string; type?: string
}) {
  return (
    <label className="f">
      <span>{label}</span>
      {multiline
        ? <textarea className="in" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={3} />
        : <input className="in" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
      {hint && <small className="mt-1 block text-[12px] text-[#8a7652]">{hint}</small>}
    </label>
  )
}

export function Num({ label, value, onChange, min = 0, max = 999, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="f"><span>{label}</span>
      <input className="in" type="number" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} />
    </label>
  )
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mb-3 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#ece3d0] bg-white px-3 py-2.5">
      <span className="text-[13.5px] font-semibold text-[#4a3d28]">{label}</span>
      <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-accent' : 'bg-[#d8ccb4]'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  )
}

const offsetOf = (iso: string) => iso.match(/([+-]\d{2}:\d{2}|Z)$/)?.[1] ?? '+05:30'
/** Edits an ISO timestamp in its own UTC offset (default IST). */
export function DateTime({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="f"><span>{label} <em className="font-normal not-italic opacity-60">({offsetOf(value)})</em></span>
      <input className="in" type="datetime-local" value={value.slice(0, 16)} onChange={(e) => e.target.value && onChange(e.target.value + ':00' + offsetOf(value))} />
    </label>
  )
}
export function DateOnly({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="f"><span>{label}</span><input className="in" type="date" value={value} onChange={(e) => onChange(e.target.value)} /></label>
}

export function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-[#ece3d0] bg-white px-2 py-1.5">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0" />
      <span className="text-[12.5px] font-semibold text-[#4a3d28]">{label}</span>
      <code className="ml-auto text-[11px] text-[#8a7652]">{value}</code>
    </label>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <><h3>{title}</h3><div className="box">{children}</div></>
}

/** Upload / replace / remove an image; stores a media ref via the active backend. */
export function ImageField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string | undefined) => void }) {
  const { store, toast } = useSite()
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  async function pick(f?: File) {
    if (!f || !store) return
    if (!f.type.startsWith('image/')) return toast('Please choose an image')
    setBusy(true)
    try { onChange(await store.uploadMedia(f, 'image')) } catch (e) { toast((e as Error).message) } finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  return (
    <div className="f mb-3">
      <span className="mb-1 block text-[12px] font-semibold text-[#6d5a3a]">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#ece3d0] bg-[#f4edd9]">{value && <MediaImg src={value} alt="" className="h-full w-full object-cover" />}</div>
        <button type="button" className="b" onClick={() => ref.current?.click()} disabled={busy}><IUpload width={14} height={14} />{busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}</button>
        {value && <button type="button" className="b danger" onClick={() => onChange(undefined)}><ITrash width={14} height={14} />Remove</button>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  )
}

/** Two-step delete without window.confirm (blocked in sandboxed previews). */
export function ConfirmButton({ label = 'Delete', onConfirm, className = 'b danger' }: { label?: string; onConfirm: () => void; className?: string }) {
  const [arm, setArm] = useState(false)
  return arm ? (
    <span className="inline-flex gap-1">
      <button type="button" className="b danger" onClick={() => { setArm(false); onConfirm() }}>Confirm</button>
      <button type="button" className="b" onClick={() => setArm(false)}>Cancel</button>
    </span>
  ) : <button type="button" className={className} onClick={() => setArm(true)}><ITrash width={14} height={14} />{label}</button>
}
