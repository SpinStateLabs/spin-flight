import { useEffect, useMemo, useState } from 'react'
import type { DateCombo } from '../types'
import { flightProvider } from '../services/flightProvider'
import { useSettings } from '../hooks/useSettings'
import { DESTINATION_OPTIONS } from '../data/mock'

function monthOptions(): { value: string; label: string }[] {
  const out = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    out.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    })
  }
  return out
}

function fmt(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function CheapDates() {
  const { homeCity } = useSettings()
  const months = useMemo(monthOptions, [])
  const [dest, setDest] = useState('LIS')
  const [month, setMonth] = useState(months[1].value)
  const [combos, setCombos] = useState<DateCombo[]>([])

  useEffect(() => {
    flightProvider.getDateCombos(homeCity, dest, month).then(setCombos)
  }, [homeCity, dest, month])

  const best = combos[0]

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Cheapest date combos</h1>
        <p className="mt-1 text-sm text-slate-400">
          The 10 cheapest round-trip date pairs from {homeCity} — Tuesday/Wednesday departures and redeyes
          vs. what the peak weekend costs.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <label className="text-xs text-slate-400">
          Destination
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            {DESTINATION_OPTIONS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Month
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {best && (
        <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
          <span className="font-semibold text-emerald-400">Best combo:</span>{' '}
          <span className="text-slate-200">
            {best.departDay} {fmt(best.depart)} → {best.returnDay} {fmt(best.return)} at ${best.price}
          </span>
          <span className="text-slate-400"> — ${best.vsPeakWeekend} cheaper than peak weekend dates.</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Depart</th>
              <th className="px-4 py-3">Return</th>
              <th className="px-4 py-3">Redeye</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">vs peak weekend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {combos.map((c, i) => (
              <tr key={c.depart + c.return} className="bg-slate-900/40 hover:bg-slate-900">
                <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className={c.departDay === 'Tue' || c.departDay === 'Wed' ? 'font-semibold text-sky-300' : ''}>
                    {c.departDay}
                  </span>{' '}
                  {fmt(c.depart)}
                </td>
                <td className="px-4 py-3">
                  {c.returnDay} {fmt(c.return)}
                </td>
                <td className="px-4 py-3">{c.redeye ? '🌙 yes' : '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-100">${c.price}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-400">−${c.vsPeakWeekend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
