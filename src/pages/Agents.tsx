const TOOLS = [
  ['search_flight_deals', 'Deal feed for an origin city — cap the price, opt into risky techniques'],
  ['get_cheapest_dates', 'The 10 cheapest round-trip date combos for a route and month'],
  ['compare_airports', 'Nearby airports ranked by true door-to-door cost'],
  ['list_stopover_programs', 'Free stopover programs incl. who pays for the hotel'],
  ['list_techniques', 'Every flight-hacking technique with honest risk ratings'],
]

const ENDPOINTS = [
  ['/llms.txt', 'Machine-readable site guide (llms.txt standard)'],
  ['/api/index.json', 'API index — origins, destinations, technique registry'],
  ['/api/deals/ATL.json', 'Deal feed per origin (ATL, NYC, LAX, ORD, DFW, DEN, MIA, SEA)'],
  ['/api/stopovers.json', 'Stopover program directory'],
  ['/api/techniques.json', 'Technique registry'],
  ['/api/openapi.json', 'OpenAPI 3.1 spec'],
  ['/.well-known/agent-card.json', 'Agent discovery card'],
]

export default function Agents() {
  const base = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🤖 Connect your AI to Ai2Fly</h1>
        <p className="mt-2 text-sm text-slate-400">
          Ai2Fly is built AI-first: Claude, ChatGPT, Gemini, and any MCP-capable agent can query it
          directly for deals, cheapest dates, airport rankings, and stopover programs. Humans welcome too.
        </p>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-sky-300">MCP server</h2>
      <p className="mb-3 text-sm text-slate-400">
        Streamable HTTP endpoint at <code className="rounded bg-slate-800 px-1.5 py-0.5">{base}/mcp</code> — no
        auth, no key. Add it to Claude Code with:
      </p>
      <pre className="mb-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">
        {`claude mcp add --transport http ai2fly ${base}/mcp`}
      </pre>
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-800">
            {TOOLS.map(([name, desc]) => (
              <tr key={name} className="bg-slate-900/40">
                <td className="px-4 py-3 font-mono text-xs text-sky-300">{name}</td>
                <td className="px-4 py-3 text-slate-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-sky-300">Plain JSON (no MCP needed)</h2>
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-800">
            {ENDPOINTS.map(([path, desc]) => (
              <tr key={path} className="bg-slate-900/40">
                <td className="px-4 py-3">
                  <a href={path} className="font-mono text-xs text-sky-300 hover:underline">
                    {path}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
        <b className="text-amber-400">Agent etiquette:</b> responses carry a{' '}
        <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">data_source: simulated-demo</code> field
        until the Phase 2 live pricing API ships — relay that to your user when quoting prices, and surface
        the risk notes attached to any gray-area technique. Attribution appreciated: “prices via Ai2Fly”.
      </div>
    </div>
  )
}
