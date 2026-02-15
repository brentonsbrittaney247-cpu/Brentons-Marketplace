# Android Build Instructions

## Quick Start

### 1. Build the Web App
```bash
npm run build
```

### 2. Sync with Android
```bash
npx cap sync android
```

### 3. Open in Android Studio (Optional)
```bash
npx cap open android
```

### 4. Build APK for Testing
```bash
cd android
./gradlew assembleRelease
```

### 5. Build AAB for Play Store
```bash
cd android
./gradlew bundleRelease
```

## Output Locations

- **APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`

## Before Building for Production

1. Configure signing keys (see main deployment guide)
2. Update version numbers in `android/app/build.gradle`
3. Replace placeholder icons with branded assets
4. Test thoroughly on physical devices

## Configuration Files

- `capacitor.config.ts` - Capacitor configuration
- `android/app/build.gradle` - Android build settings
- `android/app/src/main/AndroidManifest.xml` - App permissions and components

## Common Issues

**Build fails**: Ensure Java 11+ is installed
**App crashes**: Check that API URLs are production-ready (not localhost)
**Signing errors**: Verify keystore configuration in gradle.properties

For detailed instructions, see: `../GOOGLE-PLAY-DEPLOYMENT.md`
