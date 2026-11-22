import { useEffect, useState } from 'react'
import { resolveMedia, resolveMediaSync } from './media'

/** Resolve a media ref (incl. local "idb:" refs) to something usable as src. */
export function useMedia(ref?: string) {
  const [url, setUrl] = useState<string | undefined>(() => resolveMediaSync(ref))
  useEffect(() => {
    let alive = true
    setUrl(resolveMediaSync(ref))
    resolveMedia(ref).then((u) => alive && setUrl(u))
    return () => { alive = false }
  }, [ref])
  return url
}
