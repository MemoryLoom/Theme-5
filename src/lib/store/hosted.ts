import type { Rsvp, SiteConfig, Wish } from '../../config/types'
import { compressImage, blobToDataUrl } from '../media'
import { uid, withTimeout } from '../files'
import { cleanText, sortRsvps, sortWishes, type WeddingStore } from './types'

/**
 * claude.ai hosted-preview store. Uses the page's shared database; the
 * artifact's owner and editors are admins (no passwords involved).
 * Access rules are declared on the artifact:
 *   site      read view  write admin
 *   rsvps     read admin write admin   + rsvps/{self}  read/write interact
 *   wishes    read view  write admin   + wishes/{self} read view / write interact
 */
export async function createHostedStore(): Promise<WeddingStore | null> {
  const c = window.claude; if (!c?.use) return null
  const [db, user] = await Promise.all([withTimeout(c.use('db'), 8000), withTimeout(c.use('user'), 8000)])
  if (!db) return null
  const assets = await withTimeout(c.use('assets'), 4000).catch(() => null)
  const me: string | null = user ? await user.id().catch(() => null) : null
  const canEdit = async () => { try { return !!(user && (await user.canEdit())) } catch { return false } }
  const deny = (e: any) => {
    if (e?.code === 'invalid_argument') return new Error('This preview only accepts responses from people the invitation is shared with as Contributors.')
    if (e?.code === 'quota_exceeded') return new Error('Storage is full for this invitation.')
    return new Error(e?.message || 'Could not reach the invitation’s database. Please try again.')
  }

  const store: WeddingStore = {
    kind: 'hosted',
    adminMode: 'owner',
    describe: 'Hosted preview — RSVPs and wishes are stored in this invitation’s shared database. The owner and editors are admins.',

    async loadConfig() {
      try { const s = await db.doc('site/config').get(); return s.exists ? ((s.data() as any).config as SiteConfig) : null } catch { return null }
    },
    async saveConfig(cfg) {
      if (!(await canEdit())) throw new Error('Only the owner or editors can publish changes.')
      try { await db.doc('site/config').set({ config: JSON.parse(JSON.stringify(cfg)), updatedAt: new Date().toISOString() }) } catch (e) { throw deny(e) }
    },

    async myRsvp() {
      if (!me) return null
      try { const s = await db.doc('rsvps/' + me).get(); return s.exists ? (s.data() as unknown as Rsvp) : null } catch { return null }
    },
    async submitRsvp(input) {
      if (!me) throw new Error('Please sign in to claude.ai to respond to this preview.')
      const now = new Date().toISOString()
      const prev = await store.myRsvp()
      const rec: Rsvp = { ...input, name: cleanText(input.name, 80), notes: cleanText(input.notes ?? '', 600), id: me, createdAt: prev?.createdAt ?? now, updatedAt: now }
      try { await db.doc('rsvps/' + me).set(JSON.parse(JSON.stringify(rec))) } catch (e) { throw deny(e) }
      return rec
    },
    async listRsvps() {
      const s = await db.collection('rsvps').limit(1000).get()
      return sortRsvps(s.docs.map((d: any) => d.data() as Rsvp))
    },
    async deleteRsvp(id) { try { await db.doc('rsvps/' + id).delete() } catch (e) { throw deny(e) } },

    subscribeWishes(cb, onError) {
      let timer = setTimeout(() => onError?.('Wishes are taking a while to load…'), 10000)
      const un = db.collection('wishes').limit(1000).onSnapshot((snap: any) => {
        if (!snap.metadata.fromCache) clearTimeout(timer)
        const all: Wish[] = []
        snap.docs.forEach((d: any) => ((d.data()?.items as Wish[]) || []).forEach((w) => all.push({ ...w, owner: d.id })))
        cb(sortWishes(all))
      }, (e: any) => { clearTimeout(timer); onError?.(e?.message || 'Wishes could not be loaded.') })
      return () => { clearTimeout(timer); un() }
    },
    async addWish(w) {
      if (!me) throw new Error('Please sign in to claude.ai to leave a wish on this preview.')
      const photo = w.photo ? await blobToDataUrl(await compressImage(w.photo, 320, 0.78)) : undefined
      const ref = db.doc('wishes/' + me)
      const s = await ref.get()
      const items: Wish[] = s.exists ? [...((s.data() as any).items || [])] : []
      items.unshift({ id: uid(), name: cleanText(w.name, 60), message: cleanText(w.message, 800), ...(photo ? { photo } : {}), createdAt: new Date().toISOString() })
      try { await ref.set({ items: items.slice(0, 8) }) } catch (e) { throw deny(e) }
    },
    async deleteWish(id) {
      const s = await db.collection('wishes').limit(1000).get()
      for (const d of s.docs) {
        const items: Wish[] = (d.data() as any).items || []
        if (items.some((w) => w.id === id)) {
          const rest = items.filter((w) => w.id !== id)
          try { rest.length ? await db.doc('wishes/' + d.id).set({ items: rest }) : await db.doc('wishes/' + d.id).delete() } catch (e) { throw deny(e) }
          return
        }
      }
    },

    async uploadMedia(file, kind) {
      const blob = kind === 'image' ? await compressImage(file) : file
      if (assets) { const r = await assets.upload(blob); return r.url || '/_blob/' + r.id }
      if (kind === 'image' && blob.size < 180_000) return blobToDataUrl(blob)
      throw new Error('Uploads are not available in this view.')
    },

    async session() {
      if (!(await canEdit())) return null
      let owner = false; try { owner = !!(await user?.isOwner?.()) } catch { /* ignore */ }
      return { label: owner ? 'Owner' : 'Editor' }
    },
    async needsSetup() { return false },
    async signIn() {
      const s = await store.session()
      if (!s) throw new Error('Only the invitation’s owner and editors can open the admin panel.')
      return s
    },
    async signOut() { /* identity comes from claude.ai */ },
  }
  return store
}
