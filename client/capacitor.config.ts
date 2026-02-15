import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brentons.marketplace',
  appName: "Brenton's Marketplace",
  webDir: 'build',
  server: {
    // Configure your production server URL here
    // Example: url: 'https://brentons-marketplace.com'
    // Leave commented for development
    // url: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    cleartext: true // Allow HTTP for development (remove for production)
  },
  android: {
    backgroundColor: '#1a1330',
    allowMixedContent: false // Set to true only if needed for development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1330',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
