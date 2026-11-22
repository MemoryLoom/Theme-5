import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './fonts.css'
import './index.css'
import App from './App'
import { SiteProvider } from './context/SiteContext'
import { MusicProvider } from './music/MusicContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SiteProvider>
        <MusicProvider>
          <App />
        </MusicProvider>
      </SiteProvider>
    </MotionConfig>
  </StrictMode>,
)
