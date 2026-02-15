# Quick Reference - Android Build Commands

## Essential Commands

### Initial Setup
```bash
cd client
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Brenton's Marketplace" com.brentons.marketplace
npx cap add android
```

### Development Workflow
```bash
# 1. Build React app
cd client
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio (optional)
npx cap open android
```

### Testing Builds
```bash
# Build APK for local testing
cd client/android
./gradlew assembleRelease

# Install on connected device
adb install app/build/outputs/apk/release/app-release.apk
```

### Production Builds
```bash
# Build AAB for Play Store (required)
cd client/android
./gradlew bundleRelease

# Output location:
# app/build/outputs/bundle/release/app-release.aab
```

### Automated Script
```bash
cd client
./build-android.sh    # Linux/Mac
build-android.bat     # Windows
```

## Version Management

### Update Version
Edit `client/android/app/build.gradle`:
```gradle
versionCode 2          // Increment for each release
versionName "1.1.0"   // Semantic version
```

## Keystore Commands

### Generate Keystore (One Time)
```bash
keytool -genkey -v -keystore brentons-marketplace.keystore \
  -alias brentons-release -keyalg RSA -keysize 2048 -validity 10000
```

### Verify Keystore
```bash
keytool -list -v -keystore brentons-marketplace.keystore
```

## Troubleshooting

### Clean Build
```bash
cd client/android
./gradlew clean
./gradlew bundleRelease
```

### Check Connected Devices
```bash
adb devices
```

### View Logs
```bash
adb logcat | grep -i "brentons"
```

### Uninstall from Device
```bash
adb uninstall com.brentons.marketplace
```

## File Locations

- **Config**: `client/capacitor.config.ts`
- **Build settings**: `client/android/app/build.gradle`
- **Manifest**: `client/android/app/src/main/AndroidManifest.xml`
- **Icons**: `client/android/app/src/main/res/mipmap-*/`
- **APK output**: `client/android/app/build/outputs/apk/release/`
- **AAB output**: `client/android/app/build/outputs/bundle/release/`

## Environment Setup

### Required Environment Variables
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

### Verify Setup
```bash
java -version    # Should show Java 11+
node -v          # Should show Node 14+
echo $ANDROID_HOME  # Should show Android SDK path
```

## Common Issues

**"Android SDK not found"**
- Install Android Studio or command-line tools
- Set ANDROID_HOME environment variable

**"JAVA_HOME not set"**
- Install Java 11 or higher
- Set JAVA_HOME to JDK location

**"Build failed: signingConfig"**
- Create gradle.properties with keystore config
- Verify keystore file exists and passwords are correct

**"React build not found"**
- Run `npm run build` in client directory first
- Verify build/ directory exists

**"Module not found" errors**
- Run `npm install` in client directory
- Check that all dependencies are installed

## API Configuration

### Production Setup
1. Copy `client/.env.android.example` to `client/.env.production.local`
2. Edit and set production API URL:
   ```
   REACT_APP_API_URL=https://your-server.com/api
   REACT_APP_SOCKET_URL=https://your-server.com
   ```
3. Rebuild React app: `npm run build`
4. Sync: `npx cap sync android`

### Important Notes
- Never use `localhost` or `127.0.0.1` in Android builds
- Always use HTTPS for production (not HTTP)
- Test with production API before submitting to Play Store

## Pre-Release Checklist

Before building for Play Store:
- [ ] Update version code and name
- [ ] Configure production API URLs
- [ ] Replace placeholder icons with branded assets
- [ ] Test on multiple devices
- [ ] Verify signing configuration
- [ ] Check AndroidManifest.xml permissions

## Resources

- Full Guide: `../GOOGLE-PLAY-DEPLOYMENT.md`
- Deployment Checklist: `../PLAY-STORE-CHECKLIST.md`
- Quick Build Guide: `./ANDROID-BUILD.md`
- Capacitor Docs: https://capacitorjs.com/docs/
