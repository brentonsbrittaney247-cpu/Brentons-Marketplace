#!/bin/bash

# Build script for Android release
# This script builds the React app and creates an Android release build

set -e  # Exit on error

echo "================================"
echo "Brenton's Marketplace - Android Build"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "capacitor.config.ts" ]; then
    echo "Error: Must run from client directory"
    echo "Usage: cd client && ./build-android.sh"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check for Java
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed"
    echo "Please install Java 11 or higher"
    exit 1
fi

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Building React app..."
npm run build

if [ ! -d "build" ]; then
    echo "Error: Build directory not created"
    exit 1
fi

echo ""
echo "Step 3: Syncing with Android..."
npx cap sync android

echo ""
echo "Step 4: Building Android release..."
cd android

# Check what type of build to create
echo ""
echo "Select build type:"
echo "1) APK (for testing)"
echo "2) AAB (for Play Store)"
read -p "Enter choice (1 or 2): " build_choice

case $build_choice in
    1)
        echo "Building APK..."
        ./gradlew assembleRelease
        echo ""
        echo "✅ Build complete!"
        echo "📦 APK location: android/app/build/outputs/apk/release/app-release.apk"
        ;;
    2)
        echo "Building AAB..."
        ./gradlew bundleRelease
        echo ""
        echo "✅ Build complete!"
        echo "📦 AAB location: android/app/build/outputs/bundle/release/app-release.aab"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Next steps:"
echo "- Test the build on a physical device"
echo "- Upload to Google Play Console"
echo "- See GOOGLE-PLAY-DEPLOYMENT.md for detailed instructions"
