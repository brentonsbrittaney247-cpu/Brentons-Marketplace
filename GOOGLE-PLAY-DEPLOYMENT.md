# Google Play Store Deployment Guide

## Overview
This guide provides step-by-step instructions for building and publishing Brenton's Marketplace to the Google Play Store.

## Prerequisites

### Required Software
1. **Node.js** (v14 or higher) - Already installed
2. **Java Development Kit (JDK)** (v11 or higher)
   ```bash
   # Check if Java is installed
   java -version
   
   # Install OpenJDK 11 (Ubuntu/Debian)
   sudo apt update
   sudo apt install openjdk-11-jdk
   
   # Set JAVA_HOME
   export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
   ```

3. **Android Studio** or **Android SDK Command-line Tools**
   - Download from: https://developer.android.com/studio
   - Or install command-line tools: https://developer.android.com/studio#command-tools
   
4. **Android SDK Platform 33 or higher**
   ```bash
   # Using sdkmanager (from Android SDK)
   sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
   ```

### Environment Variables
Add these to your `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## Step 1: Build the React App

```bash
cd client
npm install
npm run build
```

This creates an optimized production build in `client/build/`.

## Step 2: Sync Capacitor

After building the React app, sync it with the Android project:

```bash
cd client
npx cap sync android
```

This copies the web assets to the Android project and updates native dependencies.

## Step 3: Configure App Icons

### Replace Placeholder Icons
The app currently uses placeholder icons. Replace them with your branded icons:

1. **Create high-resolution icons** (1024x1024px recommended)
   - Use the purple-to-pink gradient (#6B4BA6 to #D84A7E)
   - Add gold accents (#C9A962)
   - Ensure the icon works well at small sizes

2. **Generate Android icon assets**
   - Use Android Studio's Image Asset Studio, or
   - Use online tools like [MakeAppIcon](https://makeappicon.com/)
   - Generate all required densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)

3. **Replace icons in Android project**
   ```bash
   # Icon locations:
   client/android/app/src/main/res/mipmap-*/ic_launcher.png
   client/android/app/src/main/res/mipmap-*/ic_launcher_round.png
   ```

### Update Splash Screen (Optional)
Edit: `client/android/app/src/main/res/values/styles.xml`

## Step 4: Configure App Details

### Update Version Information
Edit `client/android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.brentons.marketplace"
    minSdkVersion 22  // Minimum Android 5.1
    targetSdkVersion 33  // Target latest stable Android
    versionCode 1  // Increment for each release
    versionName "1.0.0"  // Semantic version
}
```

### Update App Name (if needed)
Edit `client/android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">Brenton's Marketplace</string>
```

## Step 5: Generate Signing Key

For production releases, you need to sign your app:

```bash
# Generate a keystore
keytool -genkey -v -keystore brentons-marketplace.keystore \
  -alias brentons-release -keyalg RSA -keysize 2048 -validity 10000

# Enter details when prompted
# IMPORTANT: Save the keystore password and alias password securely!
```

### Configure Signing in Gradle

Create `client/android/gradle.properties` (add to .gitignore):

```properties
RELEASE_STORE_FILE=../../brentons-marketplace.keystore
RELEASE_STORE_PASSWORD=your_keystore_password
RELEASE_KEY_ALIAS=brentons-release
RELEASE_KEY_PASSWORD=your_alias_password
```

Update `client/android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('RELEASE_STORE_FILE')) {
                storeFile file(RELEASE_STORE_FILE)
                storePassword RELEASE_STORE_PASSWORD
                keyAlias RELEASE_KEY_ALIAS
                keyPassword RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 6: Build Release APK/AAB

### Build APK (for testing)
```bash
cd client/android
./gradlew assembleRelease

# Output location:
# client/android/app/build/outputs/apk/release/app-release.apk
```

### Build AAB (for Play Store - REQUIRED)
```bash
cd client/android
./gradlew bundleRelease

# Output location:
# client/android/app/build/outputs/bundle/release/app-release.aab
```

**Note**: Google Play Store requires AAB (Android App Bundle) format for new apps.

## Step 7: Test the Release Build

### Install APK on Device
```bash
adb install client/android/app/build/outputs/apk/release/app-release.apk
```

### Test thoroughly:
- [ ] App launches without errors
- [ ] All features work (login, listings, auctions, payments, messaging)
- [ ] Images load correctly
- [ ] Network requests succeed
- [ ] No security warnings

## Step 8: Prepare Play Store Assets

### Required Assets

1. **App Icons**
   - 512x512px high-res icon (PNG, 32-bit, no transparency)

2. **Feature Graphic**
   - 1024x500px banner image for Play Store listing

3. **Screenshots** (at least 2, max 8 per device type)
   - Phone: 1080x1920px to 7680x4320px
   - 7-inch tablet: 1536x2048px to 7680x4320px (optional)
   - 10-inch tablet: 2048x2732px to 7680x4320px (optional)
   
   **Capture screenshots showing:**
   - Homepage with listings
   - Listing detail page
   - User profile
   - Messaging interface
   - Checkout/payment flow

4. **App Description** (example below)

### Sample Play Store Listing

**Title**: Brenton's Marketplace - Buy & Sell

**Short Description** (80 chars max):
Premium marketplace with auctions and instant buy. Secure payments & shipping.

**Full Description**:
```
🎨 Brenton's Marketplace - Your Premium Buy & Sell Platform

Discover a stunning marketplace experience with our signature purple-pink gradient theme and gold accents. Buy and sell with confidence!

✨ KEY FEATURES:

📦 LISTING OPTIONS
• Buy-It-Now for instant purchases
• Timed Auctions (24h or 72h duration)
• Multiple payment methods (Visa, PayPal, CashApp, Apple Pay)
• Automated prepaid shipping labels

💰 FAIR PRICING
• Items under $100: $2.89 selling fee
• Items $100+: $4.24 selling fee
• Returns: $3 buyer fee

🛍️ SHOP CATEGORIES
• Home & Garden
• Electronics
• Men's, Women's, Kids & Juniors Apparel
• Sports & Outdoors
• Collectables
• Pets
• And more!

💬 DIRECT MESSAGING
Connect with buyers and sellers instantly

⭐ USER REVIEWS
Build trust with verified ratings

🔒 SECURE & RELIABLE
• Protected payments
• Automated shipping
• Buyer and seller protection

Download now and start buying or selling today!
```

**Category**: Shopping

**Content Rating**: Everyone / Teen (based on content policy)

**Privacy Policy URL**: https://yourwebsite.com/privacy

## Step 9: Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console/)
2. Pay one-time registration fee ($25)
3. Complete account verification
4. Set up payment profile for receiving payments

## Step 10: Create App in Play Console

1. Click **"Create App"**
2. Fill in app details:
   - App name: Brenton's Marketplace
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
3. Accept Developer Program Policies

## Step 11: Complete Store Listing

Navigate through all sections in Play Console:

### Main Store Listing
- Upload app icon (512x512px)
- Upload feature graphic (1024x500px)
- Add screenshots
- Enter descriptions
- Set app category
- Add contact details
- Set privacy policy URL

### Content Rating
- Complete questionnaire
- Get content rating certificate

### App Content
- Privacy policy
- Ads declaration
- Target audience
- News apps declaration (if applicable)

### Pricing & Distribution
- Select countries
- Confirm content guidelines
- US export laws compliance

## Step 12: Upload Release

### Production Track
1. Go to **Production** → **Create new release**
2. Upload your **AAB file**: `app-release.aab`
3. Fill in release details:
   - Release name: 1.0.0
   - Release notes:
     ```
     Initial release of Brenton's Marketplace!
     
     Features:
     - Buy-It-Now and Auction listings
     - Secure payment processing
     - Direct messaging
     - Automated shipping labels
     - User reviews and ratings
     ```
4. Save and review

### Internal Testing Track (Recommended First)
Before production, test with internal testers:
1. Go to **Internal testing** → **Create new release**
2. Upload AAB
3. Add testers via email
4. Share the testing link
5. Gather feedback and fix issues

## Step 13: Submit for Review

1. Review all sections for completion
2. Click **"Send for review"**
3. Wait for Google's review (typically 1-7 days)

### Common Rejection Reasons
- Incomplete store listing
- Missing privacy policy
- Icon/screenshot quality issues
- App crashes on launch
- Broken functionality

## Step 14: Monitor & Update

After approval:
- Monitor crash reports in Play Console
- Respond to user reviews
- Update regularly with bug fixes and features
- Increment `versionCode` and `versionName` for each update

## Quick Commands Reference

```bash
# Build React app
cd client && npm run build

# Sync with Android
cd client && npx cap sync android

# Open in Android Studio
cd client && npx cap open android

# Build release AAB
cd client/android && ./gradlew bundleRelease

# Build release APK
cd client/android && ./gradlew assembleRelease

# Install on device
adb install client/android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Build Errors
- Ensure Java 11+ is installed and JAVA_HOME is set
- Run `./gradlew clean` before rebuilding
- Check Android SDK is properly installed

### App Crashes on Launch
- Check server URL is correct (not localhost)
- Verify all API endpoints use HTTPS in production
- Test network connectivity

### Signing Issues
- Verify keystore path in gradle.properties
- Ensure passwords are correct
- Keystore must not be corrupted

## Security Considerations

⚠️ **IMPORTANT**:
- Never commit keystore files to version control
- Keep keystore passwords secure (use password manager)
- Back up keystore file - you cannot release updates without it
- Use HTTPS for all API calls
- Implement certificate pinning for production

## Update Process

For subsequent releases:

1. Update `versionCode` (increment by 1)
2. Update `versionName` (e.g., 1.0.0 → 1.1.0)
3. Build React app: `npm run build`
4. Sync: `npx cap sync android`
5. Build new AAB: `./gradlew bundleRelease`
6. Upload to Play Console as new release
7. Add release notes describing changes
8. Submit for review

## Support

For issues:
- Check [Capacitor Documentation](https://capacitorjs.com/docs/)
- Review [Android Developer Guides](https://developer.android.com/guide)
- Consult [Play Console Help](https://support.google.com/googleplay/android-developer/)

---

**Last Updated**: February 2026
**Capacitor Version**: 6.x
**Target Android SDK**: 33
