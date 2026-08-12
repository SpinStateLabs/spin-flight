import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.spinstatelabs.spinflight',
  appName: 'SpinFlight',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
}

export default config
