/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TP_MARKER?: string
  readonly VITE_KIWI_AFFIL_ID?: string
  readonly VITE_FLIGHT_PROVIDER?: string
  readonly VITE_STRIPE_LINK_MONTHLY?: string
  readonly VITE_STRIPE_LINK_YEARLY?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
