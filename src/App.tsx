import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useCouple, useSite } from './context/SiteContext'
import { useMusic } from './music/MusicContext'
import { MusicControl } from './music/MusicControl'
import { Landing } from './sections/Landing'
import { Hero } from './sections/Hero'
import { Invitation } from './sections/Invitation'
import { Story } from './sections/Story'
import { DateCountdown } from './sections/DateCountdown'
import { Families } from './sections/Families'
import { Gallery } from './sections/Gallery'
import { Events } from './sections/Events'
import { Rsvp } from './sections/Rsvp'
import { LiveStream } from './sections/LiveStream'
import { Contact } from './sections/Contact'
import { Wishes } from './sections/Wishes'
import { Footer } from './sections/Footer'
import type { AdminSession } from './lib/store/types'

const AdminPanel = lazy(() => import('./admin/AdminPanel'))

function useThemeVars() {
  const { config } = useSite()
  useEffect(() => {
    const r = document.documentElement.style
    Object.entries(config.theme).forEach(([k, v]) => { if (typeof v === 'string') r.setProperty('--p-' + k, v) })
    document.title = config.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.meta.description)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', config.theme.brown)
  }, [config.theme, config.meta])
}

function MonoBadge() {
  const { mono } = useCouple()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.85)
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a href="#top" className="mono-badge" aria-label="Back to top"
          initial={{ opacity: 0, y: -12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.8 }} transition={{ duration: 0.4 }}>
          {mono[0]}<span className="mx-px text-[11px] text-kasavu">&amp;</span>{mono[1]}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden="true" className="fixed left-0 right-0 top-0 z-[950] h-[3px] origin-left bg-gradient-to-r from-maroon via-kasavu to-kasavu" style={{ scaleX: x }} />
}

export default function App() {
  const { config, toastMsg, adminOpen, setAdminOpen, store } = useSite()
  const music = useMusic()
  const [opened, setOpened] = useState(false)
  const [landingGone, setLandingGone] = useState(false)
  const [session, setSession] = useState<AdminSession | null>(null)
  useThemeVars()

  useEffect(() => { document.body.classList.toggle('locked', !landingGone && !adminOpen ? true : adminOpen) }, [landingGone, adminOpen])
  useEffect(() => { if (store) store.session().then(setSession).catch(() => {}) }, [store])
  useEffect(() => { if (adminOpen && !landingGone) { setOpened(true); setLandingGone(true) } }, [adminOpen, landingGone])

  const open = () => { setOpened(true); if (config.music.enabled) music.play() }

  return (
    <>
      <a href="#rsvp" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[2000] focus:rounded focus:bg-ivory focus:text-bg focus:px-3 focus:py-2">Skip to RSVP</a>
      <AnimatePresence>{!landingGone && <Landing key="landing" onOpen={open} onDone={() => setLandingGone(true)} />}</AnimatePresence>

      <main id="main" aria-hidden={!landingGone && !opened}>
        <Hero opened={opened} />
        <Invitation />
        <Story />
        <Families />
        <DateCountdown />
        <Events />
        <Gallery />
        <Rsvp />
        <LiveStream />
        <Wishes isAdmin={!!session} />
        <Contact />
      </main>
      <Footer />

      {landingGone && (
        <>
          <MonoBadge />
          <ScrollProgress />
          <MusicControl />
        </>
      )}

      <AnimatePresence>
        {toastMsg && (
          <motion.div key={toastMsg} className="toast" role="status" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>{toastMsg}</motion.div>
        )}
      </AnimatePresence>

      {adminOpen && (
        <Suspense fallback={null}>
          <AdminPanel session={session} onSession={setSession} onClose={() => { setAdminOpen(false); if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search) }} />
        </Suspense>
      )}
    </>
  )
}
