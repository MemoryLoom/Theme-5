/**
 * Media helpers: image compression + a tiny IndexedDB blob store used in local mode.
 * A "media ref" is any string usable as src: http(s) url, data: url, blob: url,
 * or "idb:<key>" (local mode) which is resolved to an object URL at runtime.
 */

export async function compressImage(file: Blob, maxSide = 1600, quality = 0.84): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  const bmp = await loadBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bmp as CanvasImageSource, 0, 0, w, h)
  return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b || file), 'image/jpeg', quality))
}

async function loadBitmap(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) { try { return await createImageBitmap(file) } catch { /* fallback */ } }
  return await new Promise((res, rej) => {
    const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file)
  })
}

export const blobToDataUrl = (b: Blob) =>
  new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(b) })

// ---------- IndexedDB (local mode) ----------
const DB = 'vivaha-media', STORE = 'blobs'
let dbp: Promise<IDBDatabase> | null = null
function idb(): Promise<IDBDatabase> {
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore(STORE)
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
  })
  return dbp
}
export async function idbPut(key: string, blob: Blob) {
  const db = await idb()
  await new Promise<void>((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(blob, key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}
export async function idbGet(key: string): Promise<Blob | undefined> {
  const db = await idb()
  return await new Promise((res, rej) => { const q = db.transaction(STORE).objectStore(STORE).get(key); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
}
export async function idbDel(key: string) {
  const db = await idb()
  await new Promise<void>((res) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(key); tx.oncomplete = () => res(); tx.onerror = () => res() })
}

const urlCache = new Map<string, string>()
export async function resolveMedia(ref?: string): Promise<string | undefined> {
  if (!ref) return undefined
  if (!ref.startsWith('idb:')) return ref
  if (urlCache.has(ref)) return urlCache.get(ref)
  try {
    const b = await idbGet(ref.slice(4)); if (!b) return undefined
    const u = URL.createObjectURL(b); urlCache.set(ref, u); return u
  } catch { return undefined }
}
export const resolveMediaSync = (ref?: string) => (ref && ref.startsWith('idb:') ? urlCache.get(ref) : ref)
