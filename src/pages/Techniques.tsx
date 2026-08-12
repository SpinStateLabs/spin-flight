import { RISK_COLOR, RISK_LABEL, TECHNIQUES } from '../data/techniques'
import { useSettings } from '../hooks/useSettings'

export default function Techniques() {
  const { enabledTechniques, toggleTechnique } = useSettings()

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Your techniques</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose which tactics SpinFlight uses when surfacing deals. Everything is here — from squeaky-clean
          date shifting to the gray-area stuff — each with an honest risk rating. Riskier techniques ship
          off by default; what you enable is your call.
        </p>
      </div>

      <div className="space-y-3">
        {TECHNIQUES.map((t) => {
          const on = enabledTechniques.includes(t.id)
          return (
            <div
              key={t.id}
              className={`rounded-2xl border p-4 transition ${
                on ? 'border-sky-500/40 bg-slate-900/70' : 'border-slate-800 bg-slate-900/30 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  role="switch"
                  aria-checked={on}
                  aria-label={`Toggle ${t.name}`}
                  onClick={() => toggleTechnique(t.id)}
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                    on ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      on ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{t.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${RISK_COLOR[t.risk]}`}>
                      {RISK_LABEL[t.risk]}
                    </span>
                    <span className="text-xs text-emerald-400">{t.savings}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{t.tagline}</p>
                  <p className="mt-2 text-sm text-slate-300">{t.description}</p>
                  {t.risk !== 'none' && (
                    <p className="mt-2 rounded-lg bg-slate-950/60 p-2.5 text-xs text-amber-300/90">
                      ⚠️ {t.riskNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
