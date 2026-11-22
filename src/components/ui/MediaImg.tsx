import { useState, type ImgHTMLAttributes } from 'react'
import { useMedia } from '../../lib/useMedia'

/** <img> that resolves media refs, lazy-loads and fades in once decoded. */
export function MediaImg({ src, className = '', style, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src?: string }) {
  const url = useMedia(src)
  const [loaded, setLoaded] = useState(false)
  if (!url) return <span className={className} style={{ ...style, background: 'var(--bg3)' }} aria-hidden="true" />
  return (
    <img {...rest} src={url} className={className} loading={rest.loading ?? 'lazy'} decoding="async"
      onLoad={(e) => { setLoaded(true); rest.onLoad?.(e) }}
      style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity .7s ease, transform .9s var(--ease)' }} />
  )
}
