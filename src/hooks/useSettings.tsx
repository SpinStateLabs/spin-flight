import { createContext, useContext, useEffect, type ReactNode } from 'react'
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
  // Pro flag lives in localStorage. Stripe Payment Links redirect back with
  // ?upgraded=pro after checkout, which flips it. This is convenience-grade
  // gating for the static site — Phase 2 adds accounts + webhook-verified
  // entitlements (and Google Play Billing on Android).
  const [isPro, setPro] = useLocalStorage('sf.pro', false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'pro') {
      setPro(true)
      params.delete('upgraded')
      const query = params.toString()
      window.history.replaceState(
        null,
        '',
        window.location.pathname + (query ? `?${query}` : '') + window.location.hash,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
