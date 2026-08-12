/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TP_MARKER?: string
  readonly VITE_KIWI_AFFIL_ID?: string
  readonly VITE_FLIGHT_PROVIDER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
