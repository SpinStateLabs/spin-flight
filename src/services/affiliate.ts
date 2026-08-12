import type { Deal } from '../types'
import { track } from './analytics'

/**
 * Affiliate monetization layer.
 *
 * Every outbound booking click routes through buildBookingUrl() so an
 * affiliate marker is attached exactly once, in one place. Set your IDs in
 * .env (see .env.example):
 *   VITE_TP_MARKER      — Travelpayouts marker (Aviasales/WayAway links)
 *   VITE_KIWI_AFFIL_ID  — Kiwi.com Tequila affiliate id
 */
const TP_MARKER = import.meta.env.VITE_TP_MARKER ?? 'YOUR_TP_MARKER'
const KIWI_ID = import.meta.env.VITE_KIWI_AFFIL_ID ?? 'YOUR_KIWI_ID'

export function buildBookingUrl(deal: Deal, site: string): string {
  const dep = deal.departDate.replaceAll('-', '')
  const ret = deal.returnDate.replaceAll('-', '')
  switch (site) {
    case 'Aviasales':
      return `https://www.aviasales.com/search/${deal.originCode}${dep.slice(4)}${deal.destinationCode}${ret.slice(4)}1?marker=${TP_MARKER}`
    case 'Kiwi.com':
      return `https://www.kiwi.com/en/search/results/${deal.originCode}/${deal.destinationCode}/${deal.departDate}/${deal.returnDate}?affilid=${KIWI_ID}`
    case 'Skyscanner':
      return `https://www.skyscanner.com/transport/flights/${deal.originCode.toLowerCase()}/${deal.destinationCode.toLowerCase()}/${dep.slice(2)}/${ret.slice(2)}/`
    case 'Momondo':
      return `https://www.momondo.com/flight-search/${deal.originCode}-${deal.destinationCode}/${deal.departDate}/${deal.returnDate}`
    default:
      return `https://www.google.com/travel/flights?q=flights%20from%20${deal.originCode}%20to%20${deal.destinationCode}`
  }
}

export function trackAffiliateClick(deal: Deal, site: string): void {
  track('affiliate_click', {
    site,
    route: `${deal.originCode}-${deal.destinationCode}`,
    price: deal.price,
    live_price: deal.live === true,
    strategies: deal.strategyIds.join(','),
  })
}
