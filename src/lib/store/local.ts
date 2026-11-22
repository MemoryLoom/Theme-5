import type { Rsvp, SiteConfig, Wish } from '../../config/types'
import { compressImage, blobToDataUrl, idbPut } from '../media'
import { uid } from '../files'
import { cleanText, sortRsvps, sortWishes, type WeddingStore } from './types'

const K = { config: 'vivaha:config', rsvps: 'vivaha:rsvps', wishes: 'vivaha:wishes', mine: 'vivaha:my-rsvp', pass: 'vivaha:passcode', sess: 'vivaha:admin-session' }

const read = <T,>(k: string, fb: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb } catch { return fb } }
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { throw new Error('Browser storage is full or unavailable.') } }

async function pbkdf2(pass: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 150_000, hash: 'SHA-256' }, key, 256)
  return btoa(String.fromCharCode(...new Uint8Array(bits)))
}

/** Browser-only store. Data never leaves this device — good for previews and offline demos. */
export function createLocalStore(): WeddingStore {
  const listeners = new Set<(w: Wish[]) => void>()
  const emit = () => { const w = sortWishes(read<Wish[]>(K.wishes, [])); listeners.forEach((l) => l(w)) }
  window.addEventListener('storage', (e) => { if (e.key === K.wishes) emit() })

  return {
    kind: 'local',
    adminMode: 'passcode',
    describe: 'Local demo mode — data is saved in this browser only. Connect Supabase (see README) to collect RSVPs and wishes from every guest.',

    async loadConfig() { return read<SiteConfig | null>(K.config, null) },
    async saveConfig(c) { write(K.config, c) },

    async myRsvp() {
      const id = read<string | null>(K.mine, null); if (!id) return null
      return read<Rsvp[]>(K.rsvps, []).find((r) => r.id === id) ?? null
    },
    async submitRsvp(input) {
      const all = read<Rsvp[]>(K.rsvps, [])
      const mineId = read<string | null>(K.mine, null)
      const now = new Date().toISOString()
      const existing = all.find((r) => r.id === mineId)
      const rec: Rsvp = { ...input, name: cleanText(input.name, 80), notes: cleanText(input.notes ?? '', 600), id: existing?.id ?? uid(), createdAt: existing?.createdAt ?? now, updatedAt: now }
      write(K.rsvps, [rec, ...all.filter((r) => r.id !== rec.id)])
      write(K.mine, rec.id)
      return rec
    },
    async listRsvps() { return sortRsvps(read<Rsvp[]>(K.rsvps, [])) },
    async deleteRsvp(id) { write(K.rsvps, read<Rsvp[]>(K.rsvps, []).filter((r) => r.id !== id)) },

    subscribeWishes(cb) { listeners.add(cb); cb(sortWishes(read<Wish[]>(K.wishes, []))); return () => { listeners.delete(cb) } },
    async addWish(w) {
      const photo = w.photo ? await blobToDataUrl(await compressImage(w.photo, 360, 0.8)) : undefined
      const rec: Wish = { id: uid(), name: cleanText(w.name, 60), message: cleanText(w.message, 800), photo, createdAt: new Date().toISOString() }
      write(K.wishes, [rec, ...read<Wish[]>(K.wishes, [])]); emit()
    },
    async deleteWish(id) { write(K.wishes, read<Wish[]>(K.wishes, []).filter((w) => w.id !== id)); emit() },

    async uploadMedia(file, kind) {
      const blob = kind === 'image' ? await compressImage(file) : file
      const key = uid(); await idbPut(key, blob); return 'idb:' + key
    },

    async session() { try { return sessionStorage.getItem(K.sess) ? { label: 'Admin (this browser)' } : null } catch { return null } },
    async needsSetup() { return !read<{ salt: string; hash: string } | null>(K.pass, null) },
    async signIn({ password }) {
      if (password.length < 6) throw new Error('Passcode must be at least 6 characters.')
      const stored = read<{ salt: string; hash: string } | null>(K.pass, null)
      if (!stored) { const salt = uid(); write(K.pass, { salt, hash: await pbkdf2(password, salt) }) }
      else if ((await pbkdf2(password, stored.salt)) !== stored.hash) {
        await new Promise((r) => setTimeout(r, 700)); throw new Error('Incorrect passcode.')
      }
      try { sessionStorage.setItem(K.sess, '1') } catch { /* ignore */ }
      return { label: 'Admin (this browser)' }
    },
    async signOut() { try { sessionStorage.removeItem(K.sess) } catch { /* ignore */ } },
  }
}
