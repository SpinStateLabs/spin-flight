import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { SettingsProvider } from './hooks/useSettings'
import './index.css'

// HashRouter keeps routing identical on Netlify and inside the Capacitor
// Android WebView (file:// origin has no history API server).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HashRouter>
  </StrictMode>,
)
