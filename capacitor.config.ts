import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.tapzy.guardian',
  appName: 'Tapzy Guardian',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: '#6366f1',
      style: 'LIGHT',
    },
  },
};

export default config;
