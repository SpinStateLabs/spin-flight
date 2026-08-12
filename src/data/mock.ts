import type { City, Deal, DateCombo, NearbyAirport, PricePoint, StopoverProgram } from '../types'

// ---------------------------------------------------------------------------
// Deterministic mock data layer. Everything here is generated from a seeded
// RNG so the app is fully clickable without a flight API. Phase 2 swaps this
// out behind the FlightProvider interface (src/services/flightProvider.ts).
// ---------------------------------------------------------------------------

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const HOME_CITIES: City[] = [
  { code: 'ATL', name: 'Atlanta', region: 'Southeast US' },
  { code: 'NYC', name: 'New York', region: 'Northeast US' },
  { code: 'LAX', name: 'Los Angeles', region: 'West Coast US' },
  { code: 'ORD', name: 'Chicago', region: 'Midwest US' },
  { code: 'DFW', name: 'Dallas', region: 'South US' },
  { code: 'DEN', name: 'Denver', region: 'Mountain US' },
  { code: 'MIA', name: 'Miami', region: 'Southeast US' },
  { code: 'SEA', name: 'Seattle', region: 'Pacific Northwest US' },
]

interface Destination {
  city: string
  code: string
  country: string
  base: number
}

const DESTINATIONS: Destination[] = [
  { city: 'Reykjavik', code: 'KEF', country: 'Iceland', base: 420 },
  { city: 'Dublin', code: 'DUB', country: 'Ireland', base: 480 },
  { city: 'Lisbon', code: 'LIS', country: 'Portugal', base: 520 },
  { city: 'Madrid', code: 'MAD', country: 'Spain', base: 540 },
  { city: 'Paris', code: 'CDG', country: 'France', base: 580 },
  { city: 'London', code: 'LHR', country: 'United Kingdom', base: 560 },
  { city: 'Rome', code: 'FCO', country: 'Italy', base: 600 },
  { city: 'Istanbul', code: 'IST', country: 'Türkiye', base: 640 },
  { city: 'Athens', code: 'ATH', country: 'Greece', base: 620 },
  { city: 'Cancún', code: 'CUN', country: 'Mexico', base: 320 },
  { city: 'Mexico City', code: 'MEX', country: 'Mexico', base: 300 },
  { city: 'San José', code: 'SJO', country: 'Costa Rica', base: 380 },
  { city: 'Bogotá', code: 'BOG', country: 'Colombia', base: 360 },
  { city: 'Lima', code: 'LIM', country: 'Peru', base: 460 },
  { city: 'Tokyo', code: 'NRT', country: 'Japan', base: 850 },
  { city: 'Seoul', code: 'ICN', country: 'South Korea', base: 880 },
  { city: 'Bangkok', code: 'BKK', country: 'Thailand', base: 780 },
  { city: 'Singapore', code: 'SIN', country: 'Singapore', base: 820 },
  { city: 'Doha', code: 'DOH', country: 'Qatar', base: 760 },
  { city: 'Marrakech', code: 'RAK', country: 'Morocco', base: 620 },
]

const AIRLINES = [
  'TAP Air Portugal', 'Icelandair', 'Turkish Airlines', 'Norse Atlantic',
  'French Bee', 'Aer Lingus', 'LEVEL', 'Condor', 'Copa Airlines',
  'Avianca', 'Volaris', 'ZIPAIR', 'Qatar Airways', 'PLAY',
]

const BOOKING_SITES = [
  'Aviasales', 'Kiwi.com', 'Skyscanner', 'Momondo', 'Airline direct', 'Google Flights',
]

const DEAL_TECHNIQUES: { ids: string[]; weight: number }[] = [
  { ids: ['error-fares'], weight: 2 },
  { ids: ['flash-sales'], weight: 4 },
  { ids: ['date-shifting'], weight: 5 },
  { ids: ['flash-sales', 'date-shifting'], weight: 3 },
  { ids: ['alt-airports'], weight: 3 },
  { ids: ['stopovers'], weight: 2 },
  { ids: ['split-ticket'], weight: 2 },
  { ids: ['positioning', 'split-ticket'], weight: 1 },
  { ids: ['hidden-city'], weight: 2 },
  { ids: ['throwaway'], weight: 1 },
  { ids: ['fuel-dump'], weight: 1 },
  { ids: ['currency-arbitrage'], weight: 1 },
]

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function weightedPick(rand: () => number): string[] {
  const total = DEAL_TECHNIQUES.reduce((s, d) => s + d.weight, 0)
  let r = rand() * total
  for (const d of DEAL_TECHNIQUES) {
    r -= d.weight
    if (r <= 0) return d.ids
  }
  return DEAL_TECHNIQUES[0].ids
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function generateDeals(originCode: string, count = 24): Deal[] {
  const origin = HOME_CITIES.find((c) => c.code === originCode) ?? HOME_CITIES[0]
  const rand = mulberry32(hashSeed(`deals-${origin.code}`))
  const deals: Deal[] = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    const dest = pick(rand, DESTINATIONS)
    const key = `${dest.code}-${i % 3}`
    if (used.has(key)) continue
    used.add(key)

    const techniqueIds = weightedPick(rand)
    // riskier techniques cut deeper
    const risky = techniqueIds.some((t) =>
      ['hidden-city', 'fuel-dump', 'error-fares', 'throwaway'].includes(t),
    )
    const discount = risky ? 0.35 + rand() * 0.3 : 0.15 + rand() * 0.3
    const normalPrice = Math.round(dest.base * (0.9 + rand() * 0.4))
    const price = Math.round(normalPrice * (1 - discount))

    const departIn = 7 + Math.floor(rand() * 53) // within 60 days
    const tripLen = 5 + Math.floor(rand() * 9)
    const depart = new Date()
    depart.setDate(depart.getDate() + departIn)
    const ret = new Date(depart)
    ret.setDate(ret.getDate() + tripLen)

    const sites = [...BOOKING_SITES].sort(() => rand() - 0.5).slice(0, 2 + Math.floor(rand() * 2))

    deals.push({
      id: `${origin.code}-${dest.code}-${i}`,
      origin: origin.name,
      originCode: origin.code,
      destination: dest.city,
      destinationCode: dest.code,
      country: dest.country,
      price,
      normalPrice,
      currency: 'USD',
      departDate: fmtDate(depart),
      returnDate: fmtDate(ret),
      airline: pick(rand, AIRLINES),
      techniqueIds,
      bookingSites: sites,
      expiresHours: 4 + Math.floor(rand() * 68),
    })
  }
  return deals.sort((a, b) => a.price - b.price)
}

export function generatePriceHistory(origin: string, destination: string, days = 30): PricePoint[] {
  const rand = mulberry32(hashSeed(`hist-${origin}-${destination}`))
  const base = 300 + rand() * 500
  const points: PricePoint[] = []
  let price = base
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    // random walk with occasional drops (airlines reprice Tue/Wed nights)
    const isTueWed = d.getDay() === 2 || d.getDay() === 3
    const drift = (rand() - 0.48) * 40
    const drop = isTueWed && rand() < 0.35 ? -(20 + rand() * 60) : 0
    price = Math.max(base * 0.6, Math.min(base * 1.5, price + drift + drop))
    points.push({ date: fmtDate(d), price: Math.round(price) })
  }
  return points
}

export function generateDateCombos(originCode: string, destCode: string, month: string): DateCombo[] {
  const rand = mulberry32(hashSeed(`combos-${originCode}-${destCode}-${month}`))
  const dest = DESTINATIONS.find((d) => d.code === destCode) ?? DESTINATIONS[0]
  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()

  // peak = Friday departure / Sunday return pricing for the same month
  const peak = Math.round(dest.base * (1.25 + rand() * 0.2))
  const combos: DateCombo[] = []

  for (let day = 1; day <= daysInMonth - 4; day++) {
    const depart = new Date(y, m - 1, day)
    const tripLen = 6 + Math.floor(rand() * 4)
    const ret = new Date(y, m - 1, day + tripLen)
    if (ret.getMonth() !== m - 1 && ret.getDate() > 6) continue

    const dow = depart.getDay()
    let mult = 1.0
    if (dow === 2 || dow === 3) mult = 0.62 + rand() * 0.1 // Tue/Wed
    else if (dow === 1 || dow === 4) mult = 0.78 + rand() * 0.1
    else if (dow === 6) mult = 0.9 + rand() * 0.1
    else mult = 1.0 + rand() * 0.15 // Fri/Sun peak

    const redeye = rand() < 0.4
    if (redeye) mult -= 0.06

    const price = Math.round(dest.base * mult)
    combos.push({
      depart: fmtDate(depart),
      return: fmtDate(ret),
      departDay: DAY_NAMES[dow],
      returnDay: DAY_NAMES[ret.getDay()],
      price,
      redeye,
      vsPeakWeekend: peak - price,
    })
  }
  return combos.sort((a, b) => a.price - b.price).slice(0, 10)
}

const NEARBY: Record<string, NearbyAirport[]> = {
  ATL: [
    { code: 'ATL', name: 'Hartsfield–Jackson Atlanta', driveMiles: 12, driveMinutes: 25, parkingPerDay: 14, avgFare: 640 },
    { code: 'BHM', name: 'Birmingham–Shuttlesworth', driveMiles: 148, driveMinutes: 140, parkingPerDay: 10, avgFare: 720 },
    { code: 'CLT', name: 'Charlotte Douglas', driveMiles: 245, driveMinutes: 220, parkingPerDay: 12, avgFare: 590 },
    { code: 'GSP', name: 'Greenville–Spartanburg', driveMiles: 154, driveMinutes: 145, parkingPerDay: 9, avgFare: 705 },
  ],
  NYC: [
    { code: 'JFK', name: 'John F. Kennedy Intl', driveMiles: 16, driveMinutes: 45, parkingPerDay: 22, avgFare: 560 },
    { code: 'EWR', name: 'Newark Liberty', driveMiles: 14, driveMinutes: 40, parkingPerDay: 24, avgFare: 545 },
    { code: 'PHL', name: 'Philadelphia Intl', driveMiles: 95, driveMinutes: 105, parkingPerDay: 15, avgFare: 610 },
    { code: 'BDL', name: 'Hartford Bradley', driveMiles: 115, driveMinutes: 120, parkingPerDay: 8, avgFare: 585 },
  ],
  LAX: [
    { code: 'LAX', name: 'Los Angeles Intl', driveMiles: 18, driveMinutes: 45, parkingPerDay: 20, avgFare: 620 },
    { code: 'SNA', name: 'Orange County John Wayne', driveMiles: 40, driveMinutes: 55, parkingPerDay: 17, avgFare: 690 },
    { code: 'ONT', name: 'Ontario Intl', driveMiles: 38, driveMinutes: 50, parkingPerDay: 12, avgFare: 655 },
    { code: 'SAN', name: 'San Diego Intl', driveMiles: 120, driveMinutes: 125, parkingPerDay: 18, avgFare: 640 },
    { code: 'TIJ', name: 'Tijuana (CBX bridge)', driveMiles: 140, driveMinutes: 150, parkingPerDay: 15, avgFare: 480 },
  ],
  ORD: [
    { code: 'ORD', name: "Chicago O'Hare", driveMiles: 17, driveMinutes: 40, parkingPerDay: 20, avgFare: 590 },
    { code: 'MDW', name: 'Chicago Midway', driveMiles: 12, driveMinutes: 30, parkingPerDay: 17, avgFare: 615 },
    { code: 'MKE', name: 'Milwaukee Mitchell', driveMiles: 80, driveMinutes: 90, parkingPerDay: 11, avgFare: 630 },
    { code: 'IND', name: 'Indianapolis Intl', driveMiles: 185, driveMinutes: 175, parkingPerDay: 10, avgFare: 655 },
  ],
  DFW: [
    { code: 'DFW', name: 'Dallas/Fort Worth Intl', driveMiles: 20, driveMinutes: 30, parkingPerDay: 15, avgFare: 650 },
    { code: 'DAL', name: 'Dallas Love Field', driveMiles: 8, driveMinutes: 20, parkingPerDay: 14, avgFare: 680 },
    { code: 'AUS', name: 'Austin–Bergstrom', driveMiles: 195, driveMinutes: 180, parkingPerDay: 13, avgFare: 610 },
    { code: 'IAH', name: 'Houston George Bush', driveMiles: 240, driveMinutes: 215, parkingPerDay: 14, avgFare: 595 },
  ],
  DEN: [
    { code: 'DEN', name: 'Denver Intl', driveMiles: 25, driveMinutes: 35, parkingPerDay: 15, avgFare: 600 },
    { code: 'COS', name: 'Colorado Springs', driveMiles: 75, driveMinutes: 80, parkingPerDay: 9, avgFare: 700 },
    { code: 'ABQ', name: 'Albuquerque Sunport', driveMiles: 450, driveMinutes: 390, parkingPerDay: 8, avgFare: 660 },
  ],
  MIA: [
    { code: 'MIA', name: 'Miami Intl', driveMiles: 8, driveMinutes: 20, parkingPerDay: 17, avgFare: 520 },
    { code: 'FLL', name: 'Fort Lauderdale', driveMiles: 28, driveMinutes: 40, parkingPerDay: 15, avgFare: 495 },
    { code: 'PBI', name: 'West Palm Beach', driveMiles: 70, driveMinutes: 75, parkingPerDay: 13, avgFare: 560 },
    { code: 'MCO', name: 'Orlando Intl', driveMiles: 235, driveMinutes: 205, parkingPerDay: 12, avgFare: 505 },
  ],
  SEA: [
    { code: 'SEA', name: 'Seattle–Tacoma Intl', driveMiles: 14, driveMinutes: 30, parkingPerDay: 18, avgFare: 610 },
    { code: 'PDX', name: 'Portland Intl', driveMiles: 174, driveMinutes: 165, parkingPerDay: 12, avgFare: 640 },
    { code: 'YVR', name: 'Vancouver Intl', driveMiles: 143, driveMinutes: 160, parkingPerDay: 14, avgFare: 570 },
    { code: 'BLI', name: 'Bellingham Intl', driveMiles: 90, driveMinutes: 95, parkingPerDay: 8, avgFare: 665 },
  ],
}

export function getNearbyAirports(originCode: string): NearbyAirport[] {
  return NEARBY[originCode] ?? NEARBY.ATL
}

export const IRS_MILEAGE_RATE = 0.7 // $/mile, covers gas + wear
export const TIME_VALUE_PER_HOUR = 25

export interface AirportTrueCost extends NearbyAirport {
  driveCost: number
  parkingCost: number
  timeCost: number
  trueCost: number
}

export function computeTrueCosts(airports: NearbyAirport[], tripDays: number, valueTime: boolean): AirportTrueCost[] {
  return airports
    .map((a) => {
      const driveCost = Math.round(a.driveMiles * 2 * IRS_MILEAGE_RATE)
      const parkingCost = a.parkingPerDay * tripDays
      const timeCost = valueTime ? Math.round(((a.driveMinutes * 2) / 60) * TIME_VALUE_PER_HOUR) : 0
      return {
        ...a,
        driveCost,
        parkingCost,
        timeCost,
        trueCost: a.avgFare + driveCost + parkingCost + timeCost,
      }
    })
    .sort((x, y) => x.trueCost - y.trueCost)
}

export const STOPOVER_PROGRAMS: StopoverProgram[] = [
  {
    airline: 'Turkish Airlines',
    hub: 'Istanbul',
    hubCode: 'IST',
    city: 'Istanbul, Türkiye',
    maxNights: 2,
    hotelPaid: true,
    hotelDetails: 'Free hotel: 1 night (economy, 4★) or 2 nights (business, 5★) on layovers over 20h. Free Touristanbul city tours on 6–24h layovers.',
    visaNote: 'US passport holders need an e-visa (~$50, online).',
    sampleRoute: 'US → Istanbul (2 nights, hotel paid) → Bangkok',
    samplePrice: 890,
  },
  {
    airline: 'Icelandair',
    hub: 'Reykjavik',
    hubCode: 'KEF',
    city: 'Reykjavik, Iceland',
    maxNights: 7,
    hotelPaid: false,
    hotelDetails: 'Up to 7 nights stopover at no extra airfare on any transatlantic itinerary. Hotel is on you.',
    visaNote: 'No visa for US passports (Schengen).',
    sampleRoute: 'US → Reykjavik (3 nights) → London',
    samplePrice: 540,
  },
  {
    airline: 'Qatar Airways',
    hub: 'Doha',
    hubCode: 'DOH',
    city: 'Doha, Qatar',
    maxNights: 4,
    hotelPaid: true,
    hotelDetails: 'Stopover packages from $14/night at 4★ (from $23 at 5★) — effectively airline-subsidized. Up to 4 nights.',
    visaNote: 'Visa-free entry for US passports (30 days).',
    sampleRoute: 'US → Doha (2 nights, $28 hotel) → Singapore',
    samplePrice: 940,
  },
  {
    airline: 'Singapore Airlines',
    hub: 'Singapore',
    hubCode: 'SIN',
    city: 'Singapore',
    maxNights: 30,
    hotelPaid: false,
    hotelDetails: 'Singapore Stopover Holiday: hotel + unlimited attraction pass bundle from ~$60. Free Changi transit tour on 5.5–24h layovers.',
    visaNote: 'No visa for US passports (90 days).',
    sampleRoute: 'US → Singapore (2 nights) → Bali',
    samplePrice: 1050,
  },
  {
    airline: 'TAP Air Portugal',
    hub: 'Lisbon',
    hubCode: 'LIS',
    city: 'Lisbon or Porto, Portugal',
    maxNights: 10,
    hotelPaid: false,
    hotelDetails: 'Up to 10 nights in Lisbon or Porto at no extra airfare, plus partner discounts and a free bottle of wine at select restaurants.',
    visaNote: 'No visa for US passports (Schengen).',
    sampleRoute: 'US → Lisbon (4 nights) → Rome',
    samplePrice: 610,
  },
  {
    airline: 'Emirates',
    hub: 'Dubai',
    hubCode: 'DXB',
    city: 'Dubai, UAE',
    maxNights: 4,
    hotelPaid: false,
    hotelDetails: 'Dubai Connect: free hotel + meals + visa on qualifying connections of 10–24h. Paid stopover packages otherwise.',
    visaNote: 'Visa on arrival for US passports.',
    sampleRoute: 'US → Dubai (1 night, hotel paid) → Bangkok',
    samplePrice: 980,
  },
  {
    airline: 'Finnair',
    hub: 'Helsinki',
    hubCode: 'HEL',
    city: 'Helsinki, Finland',
    maxNights: 5,
    hotelPaid: false,
    hotelDetails: 'Up to 5 days stopover on Asia/Europe itineraries at no extra airfare.',
    visaNote: 'No visa for US passports (Schengen).',
    sampleRoute: 'US → Helsinki (2 nights) → Tokyo',
    samplePrice: 920,
  },
]

export const DESTINATION_OPTIONS = DESTINATIONS.map((d) => ({
  code: d.code,
  label: `${d.city} (${d.code})`,
}))
