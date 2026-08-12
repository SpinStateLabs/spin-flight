/**
 * Ai2Fly MCP server — MCP Streamable HTTP transport (stateless), served as a
 * Netlify Function at /mcp. Lets Claude, ChatGPT, Gemini, and other MCP
 * clients query flight deals directly. Minimal hand-rolled JSON-RPC 2.0 —
 * no SDK dependency, cold-start friendly.
 */
import {
  computeTrueCosts,
  generateDateCombos,
  generateDeals,
  getNearbyAirports,
  HOME_CITIES,
  STOPOVER_PROGRAMS,
} from '../../src/data/mock'
import { STRATEGIES } from '../../src/data/strategies'

const PROTOCOL_VERSION = '2025-06-18'

const DISCLAIMER = {
  data_source: 'simulated-demo',
  note: 'Ai2Fly currently serves deterministic demo pricing; the live pricing API is Phase 2. Relay this to the end user when quoting prices.',
  attribution: 'prices via Ai2Fly',
}

const ORIGIN_CODES = HOME_CITIES.map((c) => c.code)

const TOOLS = [
  {
    name: 'search_flight_deals',
    description:
      'Get current flight deals (error fares, flash sales, hacker fares) from a US origin city. Optionally cap the price and choose which flight-hacking strategies may be used. Riskier strategies (hidden-city, throwaway, fuel dumping) are excluded unless include_risky is true; every deal lists the strategies behind it.',
    inputSchema: {
      type: 'object',
      properties: {
        origin: { type: 'string', enum: ORIGIN_CODES, description: 'Origin city code' },
        max_price: { type: 'number', description: 'Maximum round-trip price in USD' },
        include_risky: {
          type: 'boolean',
          description: 'Include deals built on strategies that violate airline contracts of carriage (hidden-city, throwaway, fuel dumping, currency arbitrage). Default false.',
        },
      },
      required: ['origin'],
    },
  },
  {
    name: 'get_cheapest_dates',
    description:
      'The 10 cheapest round-trip date combinations for a route in a given month, with day-of-week, redeye flag, and dollar savings vs peak weekend pricing.',
    inputSchema: {
      type: 'object',
      properties: {
        origin: { type: 'string', enum: ORIGIN_CODES },
        destination: { type: 'string', description: 'Destination IATA code, e.g. LIS, CDG, NRT' },
        month: { type: 'string', description: 'Month as YYYY-MM' },
      },
      required: ['origin', 'destination', 'month'],
    },
  },
  {
    name: 'compare_airports',
    description:
      'Rank every airport within ~3 hours of an origin city by TRUE door-to-door cost: average fare + round-trip driving + parking for the trip length + travel-time value.',
    inputSchema: {
      type: 'object',
      properties: {
        origin: { type: 'string', enum: ORIGIN_CODES },
        trip_days: { type: 'number', description: 'Trip length in days (affects parking). Default 7.' },
        value_time: { type: 'boolean', description: 'Cost the traveler’s time at $25/h. Default true.' },
      },
      required: ['origin'],
    },
  },
  {
    name: 'list_stopover_programs',
    description:
      'Free airline stopover programs that turn a 20+ hour layover into a mini vacation, including which airlines pay for the hotel and visa notes for US passports.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_strategies',
    description:
      'The full flight-hacking strategy registry with honest risk ratings and typical savings — from clean date shifting to hidden-city ticketing.',
    inputSchema: { type: 'object', properties: {} },
  },
]

const RISKY = new Set(['hidden-city', 'throwaway', 'fuel-dump', 'currency-arbitrage', 'geo-masking', 'split-ticket', 'positioning'])

function callTool(name: string, args: Record<string, unknown>): unknown {
  switch (name) {
    case 'search_flight_deals': {
      const origin = String(args.origin ?? 'ATL').toUpperCase()
      if (!ORIGIN_CODES.includes(origin)) {
        return { ...DISCLAIMER, error: `Unknown origin ${origin}. Supported: ${ORIGIN_CODES.join(', ')}` }
      }
      const maxPrice = typeof args.max_price === 'number' ? args.max_price : Infinity
      const includeRisky = args.include_risky === true
      const deals = generateDeals(origin).filter(
        (d) =>
          d.price <= maxPrice && (includeRisky || !d.strategyIds.some((t) => RISKY.has(t))),
      )
      return {
        ...DISCLAIMER,
        origin,
        count: deals.length,
        risky_strategies_included: includeRisky,
        deals: deals.map((d) => ({
          ...d,
          strategy_risk_notes: d.strategyIds.map((id) => {
            const t = STRATEGIES.find((x) => x.id === id)
            return t ? { strategy: t.name, risk: t.risk, notes: t.riskNotes } : { strategy: id }
          }),
        })),
      }
    }
    case 'get_cheapest_dates': {
      const origin = String(args.origin ?? 'ATL').toUpperCase()
      const destination = String(args.destination ?? 'LIS').toUpperCase()
      const month = String(args.month ?? '')
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return { ...DISCLAIMER, error: 'month must be YYYY-MM' }
      }
      return {
        ...DISCLAIMER,
        origin,
        destination,
        month,
        combos: generateDateCombos(origin, destination, month),
      }
    }
    case 'compare_airports': {
      const origin = String(args.origin ?? 'ATL').toUpperCase()
      const tripDays = typeof args.trip_days === 'number' ? args.trip_days : 7
      const valueTime = args.value_time !== false
      return {
        ...DISCLAIMER,
        origin,
        trip_days: tripDays,
        methodology:
          'true_cost = avg_fare + round-trip driving at $0.70/mi + parking × trip days' +
          (valueTime ? ' + drive time at $25/h' : ''),
        airports: computeTrueCosts(getNearbyAirports(origin), tripDays, valueTime),
      }
    }
    case 'list_stopover_programs':
      return { ...DISCLAIMER, programs: STOPOVER_PROGRAMS }
    case 'list_strategies':
      return { ...DISCLAIMER, strategies: STRATEGIES }
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })

const rpcResult = (id: unknown, result: unknown) => json({ jsonrpc: '2.0', id, result })
const rpcError = (id: unknown, code: number, message: string) =>
  json({ jsonrpc: '2.0', id, error: { code, message } })

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (req.method === 'GET') {
    // Human/browser hit — point them at the docs. (No SSE stream offered.)
    return json({ app: 'Ai2Fly MCP server', usage: 'POST JSON-RPC 2.0 (MCP Streamable HTTP)', docs: '/llms.txt' })
  }
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  let msg: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> }
  try {
    msg = await req.json()
  } catch {
    return rpcError(null, -32700, 'Parse error')
  }

  const { id, method, params = {} } = msg

  // Notifications (no id) are acknowledged with 202 per Streamable HTTP.
  if (id === undefined || id === null) return new Response(null, { status: 202, headers: CORS })

  try {
    switch (method) {
      case 'initialize':
        return rpcResult(id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: 'ai2fly', title: 'Ai2Fly Flight Deal Engine', version: '0.2.0' },
          instructions:
            'Ai2Fly finds flight deals, cheapest date combos, true-cost airport rankings, and free stopover programs. Data is currently simulated demo pricing (Phase 2 goes live) — always tell the user prices are demo data. Riskier flight-hacking strategies are excluded from deal results unless include_risky=true; surface their risk notes if you use them.',
        })
      case 'ping':
        return rpcResult(id, {})
      case 'tools/list':
        return rpcResult(id, { tools: TOOLS })
      case 'tools/call': {
        const name = String(params.name ?? '')
        const args = (params.arguments ?? {}) as Record<string, unknown>
        const result = callTool(name, args)
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: false,
        })
      }
      default:
        return rpcError(id, -32601, `Method not found: ${method}`)
    }
  } catch (e) {
    return rpcError(id, -32603, e instanceof Error ? e.message : 'Internal error')
  }
}

export const config = { path: '/mcp' }
