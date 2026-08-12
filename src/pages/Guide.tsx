import { Link } from 'react-router-dom'
import { RISK_COLOR, RISK_LABEL, TECHNIQUES } from '../data/techniques'

const PLAYBOOK = [
  {
    title: 'Set the trap before you shop',
    body: 'Track your routes with a target price (Tracker tab) weeks before you intend to buy. Deals come to those who are already watching — most flash sales are gone within 48 hours.',
  },
  {
    title: 'Shop dates, not destinations',
    body: 'If you can move your trip by even one day, the Dates tab pays for itself. Tue/Wed departures + a redeye routinely beat Friday departures by 30–60%.',
  },
  {
    title: 'Widen the map',
    body: 'Check every airport within 3 hours (Airports tab) — but count the drive, parking, and your time honestly. A $60 cheaper fare that costs $110 in parking is not a deal.',
  },
  {
    title: 'Make layovers work for you',
    body: 'A 20-hour layover is a free city if you pick the right airline (Stopovers tab). Turkish, Qatar, and Emirates will even put you in a hotel.',
  },
  {
    title: 'Know the gray zone before you step in it',
    body: 'Hidden-city, throwaway, fuel dumps and point-of-sale tricks save real money and carry real consequences. Read each technique’s risk card and decide with open eyes — never on an airline where you hold status or miles you care about.',
  },
]

export default function Guide() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Flight Hacking 101</h1>
        <p className="mt-1 text-sm text-slate-400">
          The complete playbook behind Ai2Fly — what airlines’ revenue managers hope you never learn,
          including what can go wrong with each trick.
        </p>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-sky-300">The playbook</h2>
      <ol className="mb-8 space-y-3">
        {PLAYBOOK.map((p, i) => (
          <li key={p.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="font-semibold">
              <span className="mr-2 text-sky-400">{i + 1}.</span>
              {p.title}
            </div>
            <p className="mt-1 text-sm text-slate-400">{p.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 text-lg font-semibold text-sky-300">Every technique, honestly rated</h2>
      <div className="space-y-3">
        {TECHNIQUES.map((t) => (
          <details key={t.id} className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
              <span className="font-semibold">{t.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${RISK_COLOR[t.risk]}`}>
                {RISK_LABEL[t.risk]}
              </span>
              <span className="text-xs text-emerald-400">{t.savings}</span>
              <span className="ml-auto text-slate-500 transition group-open:rotate-90">›</span>
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-slate-300">{t.description}</p>
              <p className={t.risk === 'high' ? 'rounded-lg bg-rose-500/10 p-3 text-rose-300' : 'rounded-lg bg-slate-950/60 p-3 text-slate-400'}>
                <b>The catch:</b> {t.riskNotes}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 text-sm text-slate-300">
        Ready to put it to work? Turn techniques on or off in{' '}
        <Link to="/techniques" className="font-semibold text-sky-400 hover:underline">
          ⚙️ Techniques
        </Link>{' '}
        and the deal feed reshapes itself around your risk appetite.
      </div>
    </div>
  )
}
