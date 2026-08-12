import { createContext, useContext, type ReactNode } from 'react'
import { TECHNIQUES } from '../data/techniques'
import { useLocalStorage } from './useLocalStorage'

interface Settings {
  homeCity: string
  setHomeCity: (code: string) => void
  enabledTechniques: string[]
  toggleTechnique: (id: string) => void
  isEnabled: (id: string) => boolean
  isPro: boolean
  setPro: (v: boolean) => void
}

const defaultEnabled = TECHNIQUES.filter((t) => t.defaultOn).map((t) => t.id)

const SettingsContext = createContext<Settings | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [homeCity, setHomeCity] = useLocalStorage('sf.homeCity', 'ATL')
  const [enabledTechniques, setEnabled] = useLocalStorage<string[]>('sf.techniques', defaultEnabled)
  // Pro flag is a local stub; Phase 2 replaces it with Stripe (web) and
  // Google Play Billing (Android) entitlement checks.
  const [isPro, setPro] = useLocalStorage('sf.pro', false)

  const toggleTechnique = (id: string) =>
    setEnabled((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  const isEnabled = (id: string) => enabledTechniques.includes(id)

  return (
    <SettingsContext.Provider
      value={{ homeCity, setHomeCity, enabledTechniques, toggleTechnique, isEnabled, isPro, setPro }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
