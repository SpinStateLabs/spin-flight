/**
 * Build step: emits the static agent-facing JSON API into dist/api/.
 * Runs after `vite build` (see package.json "build"). Netlify serves these
 * files ahead of the SPA catch-all redirect, so /api/* is pure static JSON.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  DESTINATION_OPTIONS,
  generateDeals,
  HOME_CITIES,
  STOPOVER_PROGRAMS,
} from '../src/data/mock'
import { TECHNIQUES } from '../src/data/techniques'

const OUT = join(process.cwd(), 'dist', 'api')
mkdirSync(join(OUT, 'deals'), { recursive: true })

const meta = {
  app: 'Ai2Fly',
  publisher: 'Spin State Labs',
  generated_at: new Date().toISOString(),
  data_source: 'simulated-demo',
  note: 'Prices are deterministic demo data; the live pricing API is Phase 2. Always relay data_source when quoting prices.',
  docs: '/llms.txt',
  mcp_endpoint: '/mcp',
  attribution: 'prices via Ai2Fly',
}

const write = (rel: string, data: unknown) =>
  writeFileSync(join(OUT, rel), JSON.stringify(data, null, 2))

write('index.json', {
  ...meta,
  endpoints: [
    { path: '/api/deals/{origin}.json', description: 'Deal feed per origin city code' },
    { path: '/api/stopovers.json', description: 'Free stopover program directory' },
    { path: '/api/techniques.json', description: 'Flight-hacking technique registry with risk ratings' },
    { path: '/api/openapi.json', description: 'OpenAPI 3.1 spec' },
  ],
  origins: HOME_CITIES,
  destinations: DESTINATION_OPTIONS,
})

for (const city of HOME_CITIES) {
  write(`deals/${city.code}.json`, {
    ...meta,
    origin: city,
    deals: generateDeals(city.code),
  })
}

write('stopovers.json', { ...meta, programs: STOPOVER_PROGRAMS })
write('techniques.json', { ...meta, techniques: TECHNIQUES })

write('openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Ai2Fly Agent API',
    version: '0.2.0',
    description:
      'Static JSON API for AI agents. Data is simulated demo pricing until the Phase 2 live provider ships. An MCP server with richer query tools is available at POST /mcp.',
  },
  servers: [{ url: '/' }],
  paths: {
    '/api/index.json': {
      get: { summary: 'API index, supported origins and destinations', responses: { '200': { description: 'OK' } } },
    },
    '/api/deals/{origin}.json': {
      get: {
        summary: 'Deal feed for an origin city',
        parameters: [
          {
            name: 'origin',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: HOME_CITIES.map((c) => c.code) },
          },
        ],
        responses: { '200': { description: 'OK' }, '404': { description: 'Unknown origin' } },
      },
    },
    '/api/stopovers.json': {
      get: { summary: 'Free stopover programs', responses: { '200': { description: 'OK' } } },
    },
    '/api/techniques.json': {
      get: { summary: 'Technique registry with risk ratings', responses: { '200': { description: 'OK' } } },
    },
  },
})

console.log(`agent API written to ${OUT}`)
