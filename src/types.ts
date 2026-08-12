export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export interface Strategy {
  id: string
  name: string
  tagline: string
  description: string
  risk: RiskLevel
  riskNotes: string
  savings: string
  defaultOn: boolean
}

export interface City {
  code: string
  name: string
  region: string
}

export interface Deal {
  id: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  country: string
  price: number
  normalPrice: number
  currency: string
  departDate: string
  returnDate: string
  airline: string
  strategyIds: string[]
  bookingSites: string[]
  expiresHours: number
  /** Direct affiliate-tagged booking URL (live provider only). */
  bookingUrl?: string
  /** True when the price came from the live data API rather than the mock. */
  live?: boolean
}

export interface PricePoint {
  date: string
  price: number
}

export interface TrackedRoute {
  id: string
  origin: string
  destination: string
  targetPrice: number
  createdAt: string
}

export interface DateCombo {
  depart: string
  return: string
  departDay: string
  returnDay: string
  price: number
  redeye: boolean
  vsPeakWeekend: number
}

export interface NearbyAirport {
  code: string
  name: string
  driveMiles: number
  driveMinutes: number
  parkingPerDay: number
  avgFare: number
}

export interface StopoverProgram {
  airline: string
  hub: string
  hubCode: string
  city: string
  maxNights: number
  hotelPaid: boolean
  hotelDetails: string
  visaNote: string
  sampleRoute: string
  samplePrice: number
}
