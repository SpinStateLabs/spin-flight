import { useMemo, useState } from 'react'
import { computeTrueCosts, getNearbyAirports, IRS_MILEAGE_RATE, TIME_VALUE_PER_HOUR } from '../data/mock'
import { useSettings } from '../hooks/useSettings'

export default function Airports() {
  const { homeCity } = useSettings()
  const [tripDays, setTripDays] = useState(7)
  const [valueTime, setValueTime] = useState(true)

  const rows = useMemo(
    () => computeTrueCosts(getNearbyAirports(homeCity), tripDays, valueTime),
    [homeCity, tripDays, valueTime],
  )

  const cheapestSticker = [...rows].sort((a, b) => a.avgFare - b.avgFare)[0]
  const winner = rows[0]

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Airport optimizer</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every airport within a ~3 hour drive of {homeCity}, ranked by <b>true</b> door-to-door cost —
          fare + driving (${IRS_MILEAGE_RATE.toFixed(2)}/mi round trip) + parking + your time (${TIME_VALUE_PER_HOUR}/h).
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
        <label className="flex items-center gap-3 text-slate-300">
          Trip length
          <input
            type="range"
            min={2}
            max={21}
            value={tripDays}
            onChange={(e) => setTripDays(Number(e.target.value))}
            className="accent-sky-400"
          />
          <span className="w-16 font-semibold text-sky-400">{tripDays} days</span>
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={valueTime}
            onChange={(e) => setValueTime(e.target.checked)}
            className="accent-sky-400"
          />
          Count my time as money
        </label>
      </div>

      {winner && cheapestSticker && winner.code !== cheapestSticker.code && (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
          <b className="text-amber-400">Sticker price lies:</b> {cheapestSticker.code} has the lowest fare
          (${cheapestSticker.avgFare}), but after the drive, parking and time, <b>{winner.code}</b> actually
          wins at ${winner.trueCost} all-in.
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Airport</th>
              <th className="px-4 py-3 text-right">Drive</th>
              <th className="px-4 py-3 text-right">Avg fare</th>
              <th className="px-4 py-3 text-right">Gas/wear</th>
              <th className="px-4 py-3 text-right">Parking</th>
              <th className="px-4 py-3 text-right">Time</th>
              <th className="px-4 py-3 text-right">True cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((a, i) => (
              <tr key={a.code} className={i === 0 ? 'bg-emerald-500/5' : 'bg-slate-900/40'}>
                <td className="px-4 py-3">
                  <span className="font-semibold">{a.code}</span>{' '}
                  <span className="text-slate-400">{a.name}</span>
                  {i === 0 && <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">winner</span>}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {a.driveMiles} mi · {a.driveMinutes} min
                </td>
                <td className="px-4 py-3 text-right">${a.avgFare}</td>
                <td className="px-4 py-3 text-right text-slate-400">${a.driveCost}</td>
                <td className="px-4 py-3 text-right text-slate-400">${a.parkingCost}</td>
                <td className="px-4 py-3 text-right text-slate-400">{valueTime ? `$${a.timeCost}` : '—'}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-100">${a.trueCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
