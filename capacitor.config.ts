import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.studynotes',
  appName: 'Study Notes',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
