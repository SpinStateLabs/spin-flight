# SpinFlight ✈️

The flight hacker's toolkit — hidden deals, price tracking, cheap date grids, true-cost airport
comparison, free stopover programs, and the full flight-hacking playbook with honest risk ratings.

Built with **React + Vite + Tailwind**, wrapped with **Capacitor** for the Play Store, deployed to
**Netlify** for the web. One codebase, both targets.

## Features

| Tab | What it does |
| --- | --- |
| **Deals** | Feed of error fares, flash sales, and hacker-fare routings from your home city, filtered to the techniques you've enabled |
| **Tracker** | Watch routes with a target price; 30-day sparkline history and Tue/Wed repricing tips (free tier: 2 routes, Pro: unlimited) |
| **Dates** | The 10 cheapest round-trip date combos for a route/month — Tue/Wed departures, redeyes, and the exact delta vs. peak weekend pricing |
| **Airports** | Every airport within ~3h of home, ranked by *true* cost: fare + gas + parking + your time |
| **Stopovers** | Free stopover programs (Turkish, Icelandair, Qatar, Singapore, TAP, Emirates, Finnair) incl. who pays for your hotel |
| **Guide** | Flight Hacking 101 — every technique explained and honestly risk-rated |
| **⚙️ Techniques** | The user picks which tactics the app surfaces — from clean date shifting to hidden-city/fuel dumps. Risky ones ship OFF by default and always carry risk warnings |
| **Pro** | Freemium upsell: $4.99/mo or $39/yr (demo stub — see Monetization) |

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
```

Data is currently a deterministic **mock provider** so the whole app is clickable with zero API keys.
Phase 2 swaps in a real API behind `src/services/flightProvider.ts` (one interface, no UI changes).

## Deploy — Web (Netlify)

`netlify.toml` is committed (build command, publish dir, SPA redirect). Either:

1. **Git-connected (recommended):** In Netlify → *Add new site → Import an existing project* → pick this
   repo. Netlify reads `netlify.toml`; every push to the production branch deploys.
2. **CLI:** `npm run build && npx netlify-cli deploy --prod --dir=dist`

Set environment variables in Netlify → *Site settings → Environment variables* (see `.env.example`):
`VITE_TP_MARKER`, `VITE_KIWI_AFFIL_ID`.

## Deploy — Android / Play Store (Capacitor)

Requires Android Studio + JDK 17 locally.

```bash
npm run build
npx cap add android      # first time only — generates android/
npx cap sync android
npx cap open android     # opens Android Studio
```

Then in Android Studio: **Build → Generate Signed Bundle (AAB)** with your upload keystore, and upload
the AAB in [Play Console](https://play.google.com/console) ($25 one-time developer fee).

Play Store checklist:
- App identity is set in `capacitor.config.ts` (`com.spinstatelabs.spinflight`)
- Provide a privacy policy URL (host it on the Netlify site, e.g. `/privacy`)
- Data-safety form: the demo build stores everything locally (no data collected); update when alerts/accounts land
- Content rating questionnaire: informational travel app

## Monetization

1. **Affiliate commissions (live path):** every booking link routes through
   `src/services/affiliate.ts`, which attaches your affiliate markers. Sign up at
   [Travelpayouts](https://www.travelpayouts.com) (Aviasales/WayAway, ~1.1–2% of bookings) and
   [Kiwi Tequila](https://tequila.kiwi.com), then set the env vars.
2. **Pro subscription (scaffolded):** free tier limits (2 tracked routes) and the Pro paywall page are
   built. The `isPro` flag is a local demo stub — production wires **Stripe** (web) and
   **Google Play Billing** (Android) as the entitlement source.
3. **Ads:** deliberately not included in v1 to protect the premium feel; AdMob can slot into the free
   tier later if EPC data justifies it.

## Phase 2 roadmap

- [ ] Live prices: `TravelpayoutsProvider` implementing `FlightProvider` (free API + affiliate revenue)
- [ ] Real alerts: small backend (Supabase/Firebase) + push notifications via Capacitor
- [ ] Stripe + Google Play Billing entitlements replacing the Pro stub
- [ ] AI travel-hacker assistant (Claude API) as a Pro feature
- [ ] Privacy policy + terms pages (required for Play Store)

## Compliance notes

Gray-area techniques (hidden-city, throwaway, fuel dumping, currency arbitrage) are **off by default**,
clearly risk-labeled, and presented as information — the app never books or automates them. Affiliate
deep links are only generated for conventional bookings, keeping affiliate-program ToS intact.
