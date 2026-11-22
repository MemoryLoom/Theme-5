/** Save a generated file. Uses the hosted-preview downloads capability when present,
 *  otherwise a normal browser download. Returns false if the viewer declined / it failed. */
export async function saveFile(filename: string, data: string, mime = 'text/plain'): Promise<boolean> {
  try {
    const dl = window.claude ? await withTimeout(window.claude.use('downloads'), 4000) : null
    if (dl) { await dl.save({ filename, data }); return true }
  } catch { /* fall through */ }
  try {
    const url = URL.createObjectURL(new Blob([data], { type: mime }))
    const a = document.createElement('a')
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    return true
  } catch { return false }
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch {
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok
    } catch { return false }
  }
}

export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))])
}

export const uid = () =>
  (crypto as any).randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

export function toCsv(rows: (string | number | boolean | undefined)[][]) {
  return rows.map((r) => r.map((c) => {
    const s = c === undefined ? '' : String(c)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }).join(',')).join('\n')
}
