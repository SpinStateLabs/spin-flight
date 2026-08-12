import { NavLink, Outlet } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { HOME_CITIES } from '../data/mock'

const NAV = [
  { to: '/deals', label: 'Deals', icon: '✈️' },
  { to: '/tracker', label: 'Tracker', icon: '📉' },
  { to: '/dates', label: 'Dates', icon: '📅' },
  { to: '/airports', label: 'Airports', icon: '🛫' },
  { to: '/stopovers', label: 'Stopovers', icon: '🏝️' },
  { to: '/guide', label: 'Guide', icon: '🎓' },
]

export default function Layout() {
  const { homeCity, setHomeCity, isPro } = useSettings()

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <NavLink to="/deals" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <img src="/plane.svg" alt="" className="h-7 w-7 rounded-lg" />
            <span>
              Ai<span className="text-sky-400">2</span>Fly
            </span>
          </NavLink>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              Home
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-200"
              >
                {HOME_CITIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </label>

            <NavLink
              to="/strategies"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-slate-500"
              title="Choose which strategies Ai2Fly uses"
            >
              ⚙️ Strategies
            </NavLink>

            <NavLink
              to="/pro"
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                isPro
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                  : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
              }`}
            >
              {isPro ? '★ Pro' : 'Go Pro'}
            </NavLink>
          </div>
        </div>

        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${
                  isActive ? 'bg-slate-800 text-sky-300' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <span className="mr-1">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>
          Ai2Fly by Spin State Labs · Prices are simulated demo data (live API coming in Phase 2).
        </p>
        <p className="mt-1">
          Some strategies violate airline contracts of carriage — each carries its risk rating. Fly informed.
        </p>
        <p className="mt-1">
          🤖 AI agent?{' '}
          <NavLink to="/agents" className="text-sky-400 hover:underline">
            Connect to Ai2Fly
          </NavLink>{' '}
          · <a href="/llms.txt" className="hover:underline">llms.txt</a> ·{' '}
          <a href="/api/index.json" className="hover:underline">JSON API</a> · <code>/mcp</code>
        </p>
      </footer>
    </div>
  )
}
