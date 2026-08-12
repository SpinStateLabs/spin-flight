import { STOPOVER_PROGRAMS } from '../data/mock'

export default function Stopovers() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Free stopover programs</h1>
        <p className="mt-1 text-sm text-slate-400">
          Turn a 20+ hour layover into a free mini vacation. These airlines let you stay in their hub city
          at no extra airfare — the ones marked 🏨 even pay for your hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {STOPOVER_PROGRAMS.map((p) => (
          <div key={p.airline} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-lg font-semibold">{p.airline}</div>
                <div className="text-sm text-slate-400">
                  {p.city} ({p.hubCode})
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
                  up to {p.maxNights} night{p.maxNights === 1 ? '' : 's'}
                </span>
                {p.hotelPaid && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    🏨 hotel paid
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-300">{p.hotelDetails}</p>
            <p className="mt-2 text-xs text-slate-500">🛂 {p.visaNote}</p>

            <div className="mt-4 rounded-lg bg-slate-950/60 p-3 text-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">Sample itinerary</div>
              <div className="mt-1 text-slate-200">{p.sampleRoute}</div>
              <div className="mt-1 font-semibold text-sky-400">from ${p.samplePrice} round trip</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
