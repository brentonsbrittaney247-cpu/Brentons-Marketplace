# Google Play Store Publishing Checklist

Use this checklist to track your progress through the deployment process.

## Pre-Deployment Preparation

### Development Environment
- [ ] Node.js installed (v14+)
- [ ] Java JDK installed (v11+)
- [ ] Android SDK installed
- [ ] ANDROID_HOME environment variable set
- [ ] Git repository up to date

### App Configuration
- [ ] Production API URL configured in `.env.production.local`
- [ ] Socket.IO URL configured
- [ ] Server deployed and accessible via HTTPS
- [ ] All API endpoints tested and working
- [ ] CORS configured to allow requests from app

### Branding Assets
- [ ] App icon created (1024x1024px)
  - Purple-to-pink gradient (#6B4BA6 to #D84A7E)
  - Gold accents (#C9A962)
  - Looks good at small sizes
- [ ] Android icons generated in all required sizes
- [ ] Icons placed in `client/android/app/src/main/res/mipmap-*/`
- [ ] Feature graphic created (1024x500px)
- [ ] Screenshots captured (min 2, max 8)
  - Homepage with listings
  - Listing detail page
  - User profile
  - Messaging interface
  - Payment flow

## Build Process

### Initial Build
- [ ] Navigate to client directory: `cd client`
- [ ] Install dependencies: `npm install`
- [ ] Build React app: `npm run build`
- [ ] Verify build directory created
- [ ] Sync Capacitor: `npx cap sync android`

### Android Configuration
- [ ] Review `android/app/build.gradle`
  - [ ] versionCode: 1
  - [ ] versionName: "1.0.0"
  - [ ] applicationId: "com.brentons.marketplace"
- [ ] Update app name if needed in `res/values/strings.xml`
- [ ] Check AndroidManifest.xml permissions

### Release Signing
- [ ] Generate keystore: `keytool -genkey -v -keystore brentons-marketplace.keystore ...`
- [ ] **CRITICAL**: Store keystore password securely
- [ ] **CRITICAL**: Store alias password securely
- [ ] **CRITICAL**: Back up keystore file (cannot publish updates without it)
- [ ] Create `gradle.properties` with signing config
- [ ] Add `gradle.properties` and `*.keystore` to `.gitignore`
- [ ] Configure signing in `app/build.gradle`

### Build Release
- [ ] Build AAB: `cd android && ./gradlew bundleRelease`
- [ ] Locate AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Verify AAB file size is reasonable (< 150MB)

### Testing
- [ ] Build APK for testing: `./gradlew assembleRelease`
- [ ] Install on physical device: `adb install app-release.apk`
- [ ] Test app thoroughly:
  - [ ] App launches without crash
  - [ ] Login/registration works
  - [ ] Can view listings
  - [ ] Can create listings
  - [ ] Images upload correctly
  - [ ] Payment flow works
  - [ ] Messaging works
  - [ ] Real-time updates work (auctions, messages)
  - [ ] No security warnings
  - [ ] All features accessible

## Google Play Console Setup

### Account Setup
- [ ] Create Google Play Console account
- [ ] Pay $25 registration fee
- [ ] Complete identity verification
- [ ] Set up merchant account (if selling paid apps/IAPs)

### Create App
- [ ] Click "Create App" in Play Console
- [ ] Enter app details:
  - [ ] App name: Brenton's Marketplace
  - [ ] Default language: English (United States)
  - [ ] App or game: App
  - [ ] Free or paid: Free
- [ ] Accept Developer Program Policies

### Store Listing
- [ ] Main store listing completed:
  - [ ] App name
  - [ ] Short description (80 chars)
  - [ ] Full description
  - [ ] App icon (512x512px)
  - [ ] Feature graphic (1024x500px)
  - [ ] Screenshots uploaded (2-8 per type)
  - [ ] Category: Shopping
  - [ ] Contact email
  - [ ] Privacy policy URL
- [ ] App content completed:
  - [ ] Privacy policy submitted
  - [ ] Ads declaration (None/Contains ads)
  - [ ] Target audience selected
  - [ ] Content rating questionnaire completed
- [ ] Pricing & distribution:
  - [ ] Countries selected
  - [ ] Content guidelines confirmed
  - [ ] Export compliance declared

### App Release

#### Internal Testing (Recommended First)
- [ ] Create internal testing release
- [ ] Upload AAB file
- [ ] Add release notes
- [ ] Add internal testers (emails)
- [ ] Share testing link
- [ ] Collect feedback
- [ ] Fix any issues found
- [ ] Increment version and rebuild if needed

#### Production Release
- [ ] Navigate to Production track
- [ ] Click "Create new release"
- [ ] Upload AAB file (`app-release.aab`)
- [ ] Release name: 1.0.0
- [ ] Release notes written:
  ```
  Initial release of Brenton's Marketplace!
  
  ✨ Features:
  - Buy-It-Now and Auction listings
  - Secure payment processing
  - Direct buyer-seller messaging
  - Automated shipping labels
  - User reviews and ratings
  ```
- [ ] Review release summary
- [ ] Click "Review release"
- [ ] Review all sections one final time
- [ ] Click "Start rollout to Production"

### Submission
- [ ] App submitted for review
- [ ] Review status: Pending
- [ ] Date submitted: __________

## Post-Submission

### Monitoring
- [ ] Check review status daily
- [ ] Respond to any review questions within 24 hours
- [ ] Address any rejection reasons immediately

### After Approval
- [ ] App published date: __________
- [ ] Share Play Store link with stakeholders
- [ ] Monitor crash reports in Play Console
- [ ] Set up automated alerts for crashes
- [ ] Respond to user reviews regularly
- [ ] Plan for updates and improvements

### Marketing
- [ ] Update website with Play Store badge
- [ ] Add "Available on Google Play" to marketing materials
- [ ] Share on social media
- [ ] Email existing users about mobile app

## Update Process (For Future Releases)

- [ ] Increment versionCode in build.gradle
- [ ] Update versionName (semantic versioning)
- [ ] Make code changes
- [ ] Build React app
- [ ] Sync Capacitor
- [ ] Build new AAB
- [ ] Upload to Play Console
- [ ] Write release notes
- [ ] Submit for review

---

## Important Reminders

⚠️ **Critical**:
- NEVER lose your keystore file or passwords
- ALWAYS back up your keystore securely
- CANNOT publish updates without original keystore
- Use HTTPS for all API calls (not HTTP)
- Test thoroughly before each release

✅ **Best Practices**:
- Start with internal testing before production
- Respond to user reviews within 24-48 hours
- Update regularly with bug fixes
- Monitor crash reports and fix issues
- Keep dependencies up to date
- Follow Google Play policies strictly

## Quick Reference Links

- [Google Play Console](https://play.google.com/console/)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Capacitor Docs](https://capacitorjs.com/docs/)
- [Android Developer Guide](https://developer.android.com/guide)

---

**Version**: 1.0
**Last Updated**: February 2026
