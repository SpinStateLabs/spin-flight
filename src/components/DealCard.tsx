import type { Deal } from '../types'
import { buildBookingUrl, trackAffiliateClick } from '../services/affiliate'
import TechniqueBadge from './TechniqueBadge'

function fmtDay(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function DealCard({ deal }: { deal: Deal }) {
  const pct = Math.round((1 - deal.price / deal.normalPrice) * 100)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">
            {deal.origin} <span className="text-slate-500">→</span> {deal.destination}
          </div>
          <div className="text-sm text-slate-400">
            {deal.country} · {deal.airline}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {fmtDay(deal.departDate)} – {fmtDay(deal.returnDate)} · round trip
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-sky-400">${deal.price}</div>
          <div className="text-xs text-slate-500 line-through">${deal.normalPrice}</div>
          <div className="text-xs font-semibold text-emerald-400">−{pct}%</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {deal.techniqueIds.map((id) => (
          <TechniqueBadge key={id} id={id} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {deal.bookingSites.map((site) => (
          <a
            key={site}
            href={buildBookingUrl(deal, site)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackAffiliateClick(deal, site)}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            {site} ↗
          </a>
        ))}
        <span className="ml-auto text-[11px] text-amber-400/80">
          ⏳ ~{deal.expiresHours}h left
        </span>
      </div>
    </div>
  )
}
