/**
 * Google Analytics 4 integration. Ships dark: nothing loads until
 * VITE_GA_MEASUREMENT_ID (a G-XXXXXXX id) is set at build time.
 *
 * Tracked funnel:
 *   page_view        — every route change (SPA, HashRouter)
 *   affiliate_click  — outbound booking click (site, route, price, live)
 *   begin_checkout   — Stripe payment link clicked (plan)
 *   pro_activated    — returned from Stripe checkout with ?upgraded=pro
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initAnalytics(): void {
  if (!GA_ID) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  // SPA: we send page_view manually on route changes instead
  window.gtag('config', GA_ID, { send_page_view: false })
}

export function track(name: string, params: Record<string, unknown> = {}): void {
  if (GA_ID && window.gtag) window.gtag('event', name, params)
}

export function trackPageView(path: string): void {
  track('page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
