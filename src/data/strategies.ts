import type { Strategy } from '../types'

// Every tactic from the "flight hacking" playbook. Users choose which ones the
// app surfaces (Settings → Strategies). Risky ones ship OFF by default and
// always carry their risk notes wherever they appear.
export const STRATEGIES: Strategy[] = [
  {
    id: 'error-fares',
    name: 'Error fares & mistake pricing',
    tagline: 'Airline pricing glitches, published for minutes to hours',
    description:
      'Airlines and OTAs occasionally publish fares with a missing fuel surcharge, a currency slip, or a fat-fingered digit. Book fast, never call the airline, and wait for the ticket to be honored before booking hotels.',
    risk: 'low',
    riskNotes: 'Airlines may cancel and refund an obvious mistake fare. Don’t book non-refundable extras until the ticket is confirmed honored.',
    savings: '40–80% off',
    defaultOn: true,
  },
  {
    id: 'flash-sales',
    name: 'Flash sales & unpublished routes',
    tagline: 'Short-window sales and fares that never hit the big search engines',
    description:
      'Carriers push 24–72 hour sales, often announced only to newsletter subscribers or on regional sites. Some low-cost carriers don’t appear in Google Flights at all — you have to check them directly.',
    risk: 'none',
    riskNotes: 'None — these are ordinary published fares, just short-lived.',
    savings: '20–50% off',
    defaultOn: true,
  },
  {
    id: 'date-shifting',
    name: 'Tue/Wed date shifting & redeyes',
    tagline: 'Same trip, different days, radically different price',
    description:
      'Tuesday and Wednesday departures routinely undercut Friday/Sunday by 30–60%. Redeye departures add another discount. Shifting a 7-day trip by one day can save hundreds.',
    risk: 'none',
    riskNotes: 'None. This is the cleanest lever in the toolkit.',
    savings: '$80–$400 per ticket',
    defaultOn: true,
  },
  {
    id: 'alt-airports',
    name: 'Alternate airports',
    tagline: 'The cheapest airport is not always the closest one',
    description:
      'Airports within a ~3 hour drive can price the same route hundreds apart. The catch: parking, gas, and your time are real costs. Ai2Fly computes the true door-to-door cost, not the sticker price.',
    risk: 'none',
    riskNotes: 'None — just factor the drive honestly.',
    savings: '$50–$300 per trip',
    defaultOn: true,
  },
  {
    id: 'stopovers',
    name: 'Free stopover programs',
    tagline: 'Turn a 20+ hour layover into a free mini vacation',
    description:
      'Turkish, Icelandair, Qatar, Singapore, TAP and others let you stay days in their hub city at no extra airfare — several even pay for your hotel. Two trips for the price of one.',
    risk: 'none',
    riskNotes: 'Check transit visa requirements for the hub country.',
    savings: 'A free extra destination',
    defaultOn: true,
  },
  {
    id: 'split-ticket',
    name: 'Split ticketing',
    tagline: 'Two separate tickets, one cheaper journey',
    description:
      'Booking A→B and B→C as separate tickets often beats the through fare A→C. Works especially well pairing a budget carrier positioning hop with a long-haul deal.',
    risk: 'medium',
    riskNotes: 'Separate tickets mean no protection if the first flight is late — the second carrier owes you nothing. Leave long connection buffers (4h+ domestic, ideally overnight international) and carry on your bags.',
    savings: '10–40% off',
    defaultOn: false,
  },
  {
    id: 'positioning',
    name: 'Positioning flights',
    tagline: 'Fly to where the deal starts',
    description:
      'Great international fares often depart from a hub that isn’t yours. A cheap domestic hop to the deal’s origin city can still leave you far ahead overall.',
    risk: 'low',
    riskNotes: 'Same separate-ticket risk as split ticketing — buffer generously. Consider arriving the night before.',
    savings: '20–50% off long-haul',
    defaultOn: false,
  },
  {
    id: 'hidden-city',
    name: 'Hidden-city ticketing',
    tagline: 'Book past your city, get off at the layover',
    description:
      'A fare from A to C connecting through B is sometimes cheaper than A to B. Hidden-city travelers book A→C and walk out at B. Made famous by Skiplagged — and by the airlines suing them.',
    risk: 'high',
    riskNotes: 'Violates airline contracts of carriage. Checked bags go to the final destination, return legs are auto-cancelled the moment you skip a segment, and airlines can confiscate miles or ban repeat offenders. One-way, carry-on only, never on an airline you hold status with.',
    savings: '20–60% off',
    defaultOn: false,
  },
  {
    id: 'throwaway',
    name: 'Throwaway ticketing',
    tagline: 'Buy a round trip, use only the outbound',
    description:
      'Round trips sometimes price below one-ways on the same route. Throwaway ticketing buys the round trip and simply never flies the return.',
    risk: 'high',
    riskNotes: 'Also breaches contracts of carriage. Lower detection risk than hidden-city (skipping the final segment strands nothing), but frequent-flyer accounts can still be targeted.',
    savings: '10–30% vs one-way',
    defaultOn: false,
  },
  {
    id: 'fuel-dump',
    name: 'Fuel dumping',
    tagline: 'Exotic routings that drop the fuel surcharge',
    description:
      'Adding a seemingly unrelated segment (a “3X”) to an itinerary can strip hundreds of dollars of fuel surcharge from the fare construction. The deep end of fare-construction hacking, traded in coded forum posts.',
    risk: 'high',
    riskNotes: 'Tickets can be cancelled or re-priced when caught, working “dumps” die quickly once shared, and agents may refuse to honor the fare. Strictly experts-only.',
    savings: '$100–$500 in surcharges',
    defaultOn: false,
  },
  {
    id: 'geo-masking',
    name: 'Geo-blocking bypass & IP masking',
    tagline: 'See the fares airlines show other countries',
    description:
      'Airlines and OTAs price the same seat differently by country and geo-block the cheaper storefronts. Browsing through a VPN or proxy from another region — often paired with that country’s point of sale — reveals region-only fares and promotions your home IP never sees.',
    risk: 'medium',
    riskNotes: 'Not illegal, but many airlines’ terms prohibit point-of-sale circumvention; bookings can be re-priced or cancelled if the payment card, billing address, or residency doesn’t match the storefront. Some regional fares legally require local residency. Clear cookies, compare in incognito, and pay with a no-foreign-fee card.',
    savings: '5–25% off',
    defaultOn: false,
  },
  {
    id: 'currency-arbitrage',
    name: 'Currency arbitrage',
    tagline: 'Pay in the currency where the fare is cheapest',
    description:
      'The same seat can price differently on an airline’s Argentinian, Polish, or Japanese site. Booking through a foreign point-of-sale with a no-foreign-fee card sometimes cuts the fare meaningfully.',
    risk: 'medium',
    riskNotes: 'Airlines increasingly geo-block or require local payment cards; some have cancelled point-of-sale-shopped tickets. Exchange-rate movements and card fees can eat the margin.',
    savings: '5–25% off',
    defaultOn: false,
  },
]

export const strategyById = (id: string): Strategy | undefined =>
  STRATEGIES.find((t) => t.id === id)

export const RISK_LABEL: Record<string, string> = {
  none: 'No risk',
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
}

export const RISK_COLOR: Record<string, string> = {
  none: 'bg-emerald-500/15 text-emerald-400',
  low: 'bg-sky-500/15 text-sky-400',
  medium: 'bg-amber-500/15 text-amber-400',
  high: 'bg-rose-500/15 text-rose-400',
}
