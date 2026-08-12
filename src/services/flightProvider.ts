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

// Phase 2: class TravelpayoutsProvider implements FlightProvider { ... }
// selected via import.meta.env.VITE_FLIGHT_PROVIDER
export const flightProvider: FlightProvider = new MockFlightProvider()
