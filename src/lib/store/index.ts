import { createLocalStore } from './local'
import type { WeddingStore } from './types'

export type { WeddingStore } from './types'

/** Picks the backend: Supabase when configured, the hosted preview runtime when present, else local. */
export async function createStore(): Promise<WeddingStore> {
  const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (url && key) {
    const { createSupabaseStore } = await import('./supabase')
    return createSupabaseStore(url, key)
  }
  if (typeof window !== 'undefined' && window.claude?.use) {
    try {
      const { createHostedStore } = await import('./hosted')
      const s = await createHostedStore()
      if (s) return s
    } catch (e) { console.warn('Hosted store unavailable', e) }
  }
  return createLocalStore()
}
