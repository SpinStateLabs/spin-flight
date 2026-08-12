import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Deal } from '../types'
import { flightProvider } from '../services/flightProvider'
import { useSettings } from '../hooks/useSettings'
import DealCard from '../components/DealCard'
import { STRATEGIES } from '../data/strategies'

export default function Deals() {
  const { homeCity, enabledStrategies } = useSettings()
  const [deals, setDeals] = useState<Deal[]>([])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    flightProvider.getDeals(homeCity).then((d) => {
      if (live) {
        setDeals(d)
        setLoading(false)
      }
    })
    return () => {
      live = false
    }
  }, [homeCity])

  const visible = useMemo(
    () =>
      deals.filter(
        (d) => d.price <= maxPrice && d.strategyIds.every((t) => enabledStrategies.includes(t)),
      ),
    [deals, maxPrice, enabledStrategies],
  )

  const hiddenCount = deals.filter((d) => d.price <= maxPrice).length - visible.length
  const offCount = STRATEGIES.length - enabledStrategies.length

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Hidden deals from {homeCity}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Error fares, flash sales, and hacker-fare routings departing in the next 60 days.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <label className="flex items-center gap-3 text-sm text-slate-300">
          Max price
          <input
            type="range"
            min={200}
            max={1200}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-sky-400"
          />
          <span className="w-14 font-semibold text-sky-400">${maxPrice}</span>
        </label>
        {offCount > 0 && (
          <span className="text-xs text-slate-500">
            {hiddenCount > 0 && <>{hiddenCount} deal{hiddenCount === 1 ? '' : 's'} hidden · </>}
            {offCount} strategy{offCount === 1 ? '' : 's'} off —{' '}
            <Link to="/strategies" className="text-sky-400 hover:underline">
              manage
            </Link>
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500">Scanning fares…</p>
      ) : visible.length === 0 ? (
        <p className="text-slate-500">
          No deals match. Raise the price cap or enable more{' '}
          <Link to="/strategies" className="text-sky-400 hover:underline">
            strategies
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((d) => (
            <DealCard key={d.id} deal={d} />
          ))}
        </div>
      )}
    </div>
  )
}
