/// <reference types="vite/client" />
declare module '*.mp3' { const src: string; export default src }
declare module '*.svg' { const src: string; export default src }

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

// Hosted-preview runtime (claude.ai artifacts). Absent everywhere else.
interface Window {
  claude?: { use: (name: string) => Promise<any> }
}
