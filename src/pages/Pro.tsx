import { useSettings } from '../hooks/useSettings'

const FREE = [
  'Deal feed with your enabled techniques',
  '2 tracked routes',
  'Cheap date grids & airport optimizer',
  'Flight Hacking 101 guide',
]

const PRO = [
  'Unlimited tracked routes',
  'Instant price-drop alerts (push + email)',
  'Deal feed 1 hour before free users',
  'Stopover trip builder',
  'AI travel-hacker assistant (coming soon)',
  'No ads, ever',
]

export default function Pro() {
  const { isPro, setPro } = useSettings()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          Ai2Fly <span className="text-amber-400">Pro</span>
        </h1>
        <p className="mt-2 text-slate-400">
          One saved flight pays for years of Pro. Serious tools for serious flight hackers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="text-lg font-semibold">Free</div>
          <div className="mt-1 text-3xl font-bold">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {FREE.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-slate-900/50 p-6">
          <div className="text-lg font-semibold text-amber-400">Pro</div>
          <div className="mt-1 text-3xl font-bold">
            $4.99<span className="text-base font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-400">or $39/yr (save 35%)</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {PRO.map((f) => (
              <li key={f}>★ {f}</li>
            ))}
          </ul>
          <button
            onClick={() => setPro(!isPro)}
            className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
              isPro
                ? 'border border-slate-700 text-slate-300 hover:border-slate-500'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isPro ? 'Manage subscription (demo: turn off)' : 'Start Pro — demo unlock'}
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-500">
            Demo build: this toggles Pro locally. Production wires Stripe on web and Google Play Billing on
            Android.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-400">
        <p className="font-semibold text-slate-300">How Ai2Fly makes money</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <b>Booking commissions:</b> deal links carry affiliate markers (Aviasales/Travelpayouts, Kiwi) —
            you pay nothing extra; the booking site shares its margin.
          </li>
          <li>
            <b>Pro subscriptions:</b> the alerting infrastructure (push, email, early access) is what the
            subscription funds.
          </li>
        </ul>
      </div>
    </div>
  )
}
