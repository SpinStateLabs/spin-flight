import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PricePoint, TrackedRoute } from '../types'
import { flightProvider } from '../services/flightProvider'
import { useWatchlist } from '../hooks/useWatchlist'
import { useSettings } from '../hooks/useSettings'
import Sparkline from '../components/Sparkline'

const FREE_ROUTE_LIMIT = 2

function RouteCard({ route, onRemove }: { route: TrackedRoute; onRemove: () => void }) {
  const [history, setHistory] = useState<PricePoint[]>([])

  useEffect(() => {
    flightProvider.getPriceHistory(route.origin, route.destination).then(setHistory)
  }, [route.origin, route.destination])

  const current = history.at(-1)?.price
  const low = history.length ? Math.min(...history.map((p) => p.price)) : undefined
  const hit = current !== undefined && current <= route.targetPrice

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          {route.origin} <span className="text-slate-500">→</span> {route.destination}
        </div>
        <button onClick={onRemove} className="text-xs text-slate-500 hover:text-rose-400">
          Remove
        </button>
      </div>
      <div className="mt-2">
        <Sparkline points={history} />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Now: <span className="font-semibold text-slate-200">${current ?? '—'}</span> · 30d low: ${low ?? '—'}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            hit ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {hit ? `✓ under $${route.targetPrice}` : `target $${route.targetPrice}`}
        </span>
      </div>
    </div>
  )
}

export default function Tracker() {
  const { routes, addRoute, removeRoute } = useWatchlist()
  const { isPro } = useSettings()
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [target, setTarget] = useState('400')

  const atFreeLimit = !isPro && routes.length >= FREE_ROUTE_LIMIT

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (atFreeLimit || origin.length < 3 || dest.length < 3) return
    addRoute(origin, dest, Number(target) || 400)
    setOrigin('')
    setDest('')
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Price tracker</h1>
        <p className="mt-1 text-sm text-slate-400">
          Watch routes, catch the Tue/Wed night repricing drops, and get alerted before flash sales expire.
        </p>
      </div>

      <form onSubmit={submit} className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <label className="text-xs text-slate-400">
          From (IATA)
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            maxLength={3}
            placeholder="ATL"
            className="mt-1 block w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm uppercase text-slate-200"
          />
        </label>
        <label className="text-xs text-slate-400">
          To (IATA)
          <input
            value={dest}
            onChange={(e) => setDest(e.target.value.toUpperCase())}
            maxLength={3}
            placeholder="LIS"
            className="mt-1 block w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm uppercase text-slate-200"
          />
        </label>
        <label className="text-xs text-slate-400">
          Alert under ($)
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
            className="mt-1 block w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          />
        </label>
        <button
          type="submit"
          disabled={atFreeLimit}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-40"
        >
          Track route
        </button>
        {atFreeLimit && (
          <span className="text-xs text-amber-400">
            Free plan tracks {FREE_ROUTE_LIMIT} routes —{' '}
            <Link to="/pro" className="underline">
              go Pro for unlimited
            </Link>
          </span>
        )}
      </form>

      <div className="mb-6 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-sky-300">When do prices actually drop?</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
          <li><b>Tue–Wed, late evening:</b> legacy carriers file fare updates; sales published Monday night go live.</li>
          <li><b>~6–8 weeks out</b> (domestic) and <b>3–5 months out</b> (international) is the statistical sweet spot.</li>
          <li><b>Flash sales</b> usually last 24–72h — a tracked route with a target price is how you catch them.</li>
        </ul>
      </div>

      {routes.length === 0 ? (
        <p className="text-slate-500">No routes tracked yet. Add one above.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} onRemove={() => removeRoute(r.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
