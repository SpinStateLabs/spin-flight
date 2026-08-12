import type { DateCombo, Deal, PricePoint } from '../types'
import type { FlightProvider } from './flightProvider'

/**
 * LiveFlightProvider — talks to the /live/* Netlify Function, which proxies
 * the Travelpayouts data API with the token kept server-side. Any failure
 * (token not configured, upstream down, offline) falls back to the wrapped
 * mock provider so the app never breaks.
 */
export class LiveFlightProvider implements FlightProvider {
  constructor(private fallback: FlightProvider) {}

  private async get<T>(path: string): Promise<T | null> {
    try {
      const res = await fetch(path, { headers: { Accept: 'application/json' } })
      if (!res.ok) return null
      const body = await res.json()
      return body?.error ? null : (body as T)
    } catch {
      return null
    }
  }

  async getDeals(originCode: string): Promise<Deal[]> {
    const live = await this.get<{ deals: Deal[] }>(`/live/deals?origin=${originCode}`)
    if (live?.deals?.length) return live.deals
    return this.fallback.getDeals(originCode)
  }

  async getDateCombos(originCode: string, destCode: string, month: string): Promise<DateCombo[]> {
    const live = await this.get<{ combos: DateCombo[] }>(
      `/live/dates?origin=${originCode}&destination=${destCode}&month=${month}`,
    )
    if (live?.combos?.length) return live.combos
    return this.fallback.getDateCombos(originCode, destCode, month)
  }

  // No historical endpoint on the free data API — history stays simulated
  // until Phase 2 adds our own price-snapshot store.
  async getPriceHistory(origin: string, destination: string): Promise<PricePoint[]> {
    return this.fallback.getPriceHistory(origin, destination)
  }
}
