import { createClient } from '@supabase/supabase-js'
import type { Rsvp, SiteConfig, Wish } from '../../config/types'
import { compressImage } from '../media'
import { uid } from '../files'
import { cleanText, type WeddingStore } from './types'

/**
 * Production store. Run supabase/schema.sql once in your project's SQL editor,
 * create the admin user in Authentication, then add that user's id to public.admins.
 * Guests never get table access: RSVPs go through security-definer RPCs keyed by a
 * random per-device secret, wishes are insert-only, everything else needs an admin JWT.
 */
export function createSupabaseStore(url: string, key: string): WeddingStore {
  const sb = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })
  const BUCKET = 'media'
  const deviceKey = (() => {
    try { const k = localStorage.getItem('vivaha:device-key'); if (k) return k; const n = uid() + uid(); localStorage.setItem('vivaha:device-key', n); return n } catch { return uid() + uid() }
  })()
  const fail = (e: { message?: string } | null) => { if (e) throw new Error(e.message || 'Request failed') }
  const toRsvp = (r: any): Rsvp => ({
    id: r.id, name: r.name, attending: r.attending, events: r.events || {}, needsRooms: r.needs_rooms, rooms: r.rooms,
    checkIn: r.check_in ?? undefined, checkOut: r.check_out ?? undefined, notes: r.notes ?? '', createdAt: r.created_at, updatedAt: r.updated_at,
  })
  const isAdmin = async () => {
    const { data } = await sb.auth.getSession(); if (!data.session) return false
    const { data: ok } = await sb.rpc('is_admin'); return !!ok
  }

  async function upload(file: Blob, folder: string) {
    const ext = file.type.includes('png') ? 'png' : file.type.includes('jpeg') ? 'jpg' : file.type.includes('webp') ? 'webp' : file.type.includes('mpeg') ? 'mp3' : file.type.split('/')[1] || 'bin'
    const path = `${folder}/${Date.now()}-${uid().slice(0, 8)}.${ext}`
    const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
    fail(error)
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  return {
    kind: 'supabase',
    adminMode: 'password',
    describe: 'Supabase — RSVPs, wishes and media are stored in your Supabase project.',

    async loadConfig() {
      const { data, error } = await sb.from('site_config').select('data').eq('id', 1).maybeSingle()
      if (error) { console.warn(error); return null }
      return (data?.data as SiteConfig) ?? null
    },
    async saveConfig(c) {
      const { error } = await sb.from('site_config').upsert({ id: 1, data: c, updated_at: new Date().toISOString() }); fail(error)
    },

    async myRsvp() {
      const { data, error } = await sb.rpc('get_my_rsvp', { p_device_key: deviceKey })
      if (error || !data || (Array.isArray(data) && !data.length)) return null
      return toRsvp(Array.isArray(data) ? data[0] : data)
    },
    async submitRsvp(r) {
      const { data, error } = await sb.rpc('submit_rsvp', {
        p_device_key: deviceKey, p_name: cleanText(r.name, 80), p_attending: r.attending, p_events: r.events,
        p_needs_rooms: r.needsRooms, p_rooms: r.rooms, p_check_in: r.checkIn || null, p_check_out: r.checkOut || null, p_notes: cleanText(r.notes ?? '', 600),
      })
      fail(error)
      return toRsvp(Array.isArray(data) ? data[0] : data)
    },
    async listRsvps() {
      const { data, error } = await sb.from('rsvps').select('*').order('updated_at', { ascending: false }); fail(error)
      return (data || []).map(toRsvp)
    },
    async deleteRsvp(id) { const { error } = await sb.from('rsvps').delete().eq('id', id); fail(error) },

    subscribeWishes(cb, onError) {
      let alive = true
      const load = async () => {
        const { data, error } = await sb.from('wishes').select('id,name,message,photo_url,created_at').order('created_at', { ascending: false }).limit(500)
        if (!alive) return
        if (error) { onError?.(error.message); return }
        cb((data || []).map((w: any): Wish => ({ id: w.id, name: w.name, message: w.message, photo: w.photo_url ?? undefined, createdAt: w.created_at })))
      }
      load()
      const ch = sb.channel('wishes-feed').on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => load()).subscribe()
      return () => { alive = false; sb.removeChannel(ch) }
    },
    async addWish(w) {
      const photo_url = w.photo ? await upload(await compressImage(w.photo, 420, 0.8), 'wishes') : null
      const { error } = await sb.from('wishes').insert({ name: cleanText(w.name, 60), message: cleanText(w.message, 800), photo_url }); fail(error)
    },
    async deleteWish(id) { const { error } = await sb.from('wishes').delete().eq('id', id); fail(error) },

    async uploadMedia(file, kind) {
      if (!(await isAdmin())) throw new Error('Sign in as an admin to upload.')
      return upload(kind === 'image' ? await compressImage(file) : file, kind === 'image' ? 'images' : 'audio')
    },

    async session() {
      const { data } = await sb.auth.getSession()
      if (!data.session || !(await isAdmin())) return null
      return { label: data.session.user.email ?? 'Admin' }
    },
    async needsSetup() { return false },
    async signIn({ email, password }) {
      const { data, error } = await sb.auth.signInWithPassword({ email: (email || '').trim(), password }); fail(error)
      if (!(await isAdmin())) { await sb.auth.signOut(); throw new Error('This account is not an admin for this invitation.') }
      return { label: data.user?.email ?? 'Admin' }
    },
    async signOut() { await sb.auth.signOut() },
  }
}
