/**
 * Live flight-price proxy — Netlify Function at /live/:op.
 *
 * Bridges the frontend (and later the MCP server) to the Travelpayouts Data
 * API while keeping the token server-side. Until TRAVELPAYOUTS_TOKEN is set
 * in the Netlify environment, every call returns { error: 'not-configured' }
 * and the frontend silently falls back to the mock provider.
 *
 * Ops:
 *   GET /live/deals?origin=ATL          — cheapest recent fares from an origin
 *   GET /live/dates?origin=ATL&destination=LIS&month=2026-10 — fares by date
 *
 * Data: Travelpayouts cached prices (crowdsourced from Aviasales searches).
 * These are real observed fares, not live availability — final price is
 * confirmed on the booking site. Responses say so via data_source.
 */

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN ?? ''
const MARKER = process.env.TP_MARKER ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (body: unknown, status = 200, cacheSeconds = 900) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${cacheSeconds}`,
      ...CORS,
    },
  })

const META = {
  data_source: 'travelpayouts-cached',
  note: 'Real observed fares from the Travelpayouts/Aviasales data API (cached search results). Confirm the final price on the booking site.',
  attribution: 'prices via Ai2Fly',
}

async function tp(path: string, params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams({ ...params, currency: 'usd', token: TOKEN })
  const res = await fetch(`https://api.travelpayouts.com${path}?${qs}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`travelpayouts ${path} -> ${res.status}`)
  return res.json()
}

function searchLink(origin: string, destination: string, depart: string, ret: string): string {
  const d = depart.slice(8, 10) + depart.slice(5, 7)
  const r = ret ? ret.slice(8, 10) + ret.slice(5, 7) : ''
  const base = `https://www.aviasales.com/search/${origin}${d}${destination}${r}1`
  return MARKER ? `${base}?marker=${MARKER}` : base
}

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dow = (iso: string) => DAY[new Date(iso.slice(0, 10) + 'T12:00:00Z').getUTCDay()]

async function deals(origin: string) {
  // v2 latest: cheapest fares seen recently for each destination from origin
  const data = await tp('/v2/prices/latest', {
    origin,
    limit: '30',
    period_type: 'year',
    one_way: 'false',
    sorting: 'price',
  })
  const rows: any[] = data?.data ?? []
  const prices = rows.map((r) => r.value).sort((a: number, b: number) => a - b)
  const median = prices.length ? prices[Math.floor(prices.length / 2)] : 0

  return {
    ...META,
    origin,
    count: rows.length,
    deals: rows.map((r, i) => {
      const depart = String(r.depart_date ?? '')
      const ret = String(r.return_date ?? '')
      const day = depart ? dow(depart) : ''
      const strategyIds: string[] = []
      if (median && r.value <= median * 0.75) strategyIds.push('flash-sales')
      if (day === 'Tue' || day === 'Wed') strategyIds.push('date-shifting')
      return {
        id: `${origin}-${r.destination}-${i}`,
        origin,
        originCode: origin,
        destination: r.destination,
        destinationCode: r.destination,
        country: '',
        price: Math.round(r.value),
        normalPrice: Math.max(Math.round(r.value), median),
        currency: 'USD',
        departDate: depart,
        returnDate: ret,
        airline: r.gate ?? 'multiple',
        strategyIds,
        bookingSites: ['Aviasales', 'Google Flights'],
        bookingUrl: depart ? searchLink(origin, r.destination, depart, ret) : undefined,
        expiresHours: 24,
        live: true,
      }
    }),
  }
}

async function dates(origin: string, destination: string, month: string) {
  // v3 prices_for_dates: observed fares for a route across a month
  const data = await tp('/aviasales/v3/prices_for_dates', {
    origin,
    destination,
    departure_at: month,
    one_way: 'false',
    limit: '100',
    sorting: 'price',
  })
  const rows: any[] = data?.data ?? []
  const combos = rows
    .filter((r) => r.departure_at && r.return_at)
    .map((r) => ({
      depart: String(r.departure_at).slice(0, 10),
      return: String(r.return_at).slice(0, 10),
      departDay: dow(r.departure_at),
      returnDay: dow(r.return_at),
      price: Math.round(r.price),
      redeye: false,
      vsPeakWeekend: 0,
    }))
  const peak = combos
    .filter((c) => c.departDay === 'Fri' || c.departDay === 'Sun')
    .reduce((m, c) => Math.max(m, c.price), 0)
  for (const c of combos) c.vsPeakWeekend = peak ? peak - c.price : 0
  combos.sort((a, b) => a.price - b.price)
  return { ...META, origin, destination, month, combos: combos.slice(0, 10) }
}

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (!TOKEN) {
    return json({ error: 'not-configured', note: 'Set TRAVELPAYOUTS_TOKEN in the Netlify environment to enable live prices.' }, 503, 60)
  }

  const url = new URL(req.url)
  const op = url.pathname.split('/').pop()
  const origin = (url.searchParams.get('origin') ?? 'ATL').toUpperCase().slice(0, 3)

  try {
    if (op === 'deals') return json(await deals(origin))
    if (op === 'dates') {
      const destination = (url.searchParams.get('destination') ?? '').toUpperCase().slice(0, 3)
      const month = url.searchParams.get('month') ?? ''
      if (!/^[A-Z]{3}$/.test(destination) || !/^\d{4}-\d{2}$/.test(month)) {
        return json({ error: 'destination (IATA) and month (YYYY-MM) required' }, 400, 0)
      }
      return json(await dates(origin, destination, month))
    }
    return json({ error: `unknown op: ${op}` }, 404, 0)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'upstream error' }, 502, 0)
  }
}

export const config = { path: '/live/:op' }
