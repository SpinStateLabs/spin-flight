import { useSettings } from '../hooks/useSettings'

// Stripe Payment Links (Spin State Labs sandbox). Override with live-mode
// links via env vars when the account goes live.
const STRIPE_LINK_MONTHLY =
  import.meta.env.VITE_STRIPE_LINK_MONTHLY ?? 'https://buy.stripe.com/test_fZu14ncCl55g4ZDeIy7EQ00'
const STRIPE_LINK_YEARLY =
  import.meta.env.VITE_STRIPE_LINK_YEARLY ?? 'https://buy.stripe.com/test_8x26oH0TD41c63H9oe7EQ01'

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
          {isPro ? (
            <button
              onClick={() => setPro(false)}
              className="mt-6 w-full rounded-xl border border-slate-700 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
            >
              ★ Pro active — deactivate on this device
            </button>
          ) : (
            <div className="mt-6 space-y-2">
              <a
                href={STRIPE_LINK_MONTHLY}
                className="block w-full rounded-xl bg-amber-500 py-3 text-center font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Go Pro — $4.99/mo
              </a>
              <a
                href={STRIPE_LINK_YEARLY}
                className="block w-full rounded-xl border border-amber-500/50 py-3 text-center font-semibold text-amber-400 transition hover:bg-amber-500/10"
              >
                Yearly — $39 (save 35%)
              </a>
            </div>
          )}
          <p className="mt-3 text-center text-[11px] text-slate-500">
            Secure checkout by Stripe (currently test mode — use card 4242 4242 4242 4242). Android will
            use Google Play Billing.
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
