import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.spinstatelabs.ai2fly',
  appName: 'Ai2Fly',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
}

export default config
