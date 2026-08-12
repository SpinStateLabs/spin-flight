import type { DateCombo, Deal, PricePoint } from '../types'
import { generateDateCombos, generateDeals, generatePriceHistory } from '../data/mock'

/**
 * Abstraction over flight-price data. The whole app talks to this interface,
 * so wiring a real API in Phase 2 (Travelpayouts/Aviasales, Amadeus, Duffel)
 * means adding one class here — no UI changes.
 */
export interface FlightProvider {
  getDeals(originCode: string): Promise<Deal[]>
  getPriceHistory(origin: string, destination: string): Promise<PricePoint[]>
  getDateCombos(originCode: string, destCode: string, month: string): Promise<DateCombo[]>
}

class MockFlightProvider implements FlightProvider {
  async getDeals(originCode: string): Promise<Deal[]> {
    return generateDeals(originCode)
  }
  async getPriceHistory(origin: string, destination: string): Promise<PricePoint[]> {
    return generatePriceHistory(origin, destination)
  }
  async getDateCombos(originCode: string, destCode: string, month: string): Promise<DateCombo[]> {
    return generateDateCombos(originCode, destCode, month)
  }
}

import { LiveFlightProvider } from './liveProvider'

// VITE_FLIGHT_PROVIDER=travelpayouts activates the live provider, which hits
// the /live/* Netlify Function (Travelpayouts proxy) and falls back to the
// mock per-call whenever live data is unavailable.
const mock = new MockFlightProvider()
export const flightProvider: FlightProvider =
  import.meta.env.VITE_FLIGHT_PROVIDER === 'travelpayouts' ? new LiveFlightProvider(mock) : mock
