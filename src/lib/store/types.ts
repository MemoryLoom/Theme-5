import type { Rsvp, SiteConfig, Wish } from '../../config/types'

export type AdminMode = 'password' | 'owner' | 'passcode'
export interface AdminSession { label: string }
export type RsvpInput = Omit<Rsvp, 'id' | 'createdAt' | 'updatedAt'>
export interface WishInput { name: string; message: string; photo?: Blob }

/**
 * Backend abstraction. Three implementations:
 *  - supabase : production (Postgres + RLS + Auth + Storage)
 *  - hosted   : claude.ai hosted preview (shared db, owner/editor = admin)
 *  - local    : browser-only demo (localStorage + IndexedDB, passcode admin)
 */
export interface WeddingStore {
  kind: 'supabase' | 'hosted' | 'local'
  adminMode: AdminMode
  /** Human description for the admin "Data" panel. */
  describe: string

  loadConfig(): Promise<SiteConfig | null>
  saveConfig(c: SiteConfig): Promise<void>

  myRsvp(): Promise<Rsvp | null>
  submitRsvp(r: RsvpInput): Promise<Rsvp>
  listRsvps(): Promise<Rsvp[]>
  deleteRsvp(id: string): Promise<void>

  subscribeWishes(cb: (w: Wish[]) => void, onError?: (msg: string) => void): () => void
  addWish(w: WishInput): Promise<void>
  deleteWish(id: string): Promise<void>

  uploadMedia(file: Blob, kind: 'image' | 'audio'): Promise<string>

  session(): Promise<AdminSession | null>
  /** For passcode mode, `needsSetup()` true means the first sign-in sets the passcode. */
  needsSetup(): Promise<boolean>
  signIn(cred: { email?: string; password: string }): Promise<AdminSession>
  signOut(): Promise<void>
}

export const sortWishes = (w: Wish[]) => [...w].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
export const sortRsvps = (r: Rsvp[]) => [...r].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

export function cleanText(s: string, max: number) {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}
