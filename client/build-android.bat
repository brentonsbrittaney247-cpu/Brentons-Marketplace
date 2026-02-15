@echo off
REM Build script for Android release (Windows)
REM This script builds the React app and creates an Android release build

echo ================================
echo Brenton's Marketplace - Android Build
echo ================================
echo.

REM Check if we're in the right directory
if not exist "capacitor.config.ts" (
    echo Error: Must run from client directory
    echo Usage: cd client ^&^& build-android.bat
    exit /b 1
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed
    exit /b 1
)

REM Check for Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Java is not installed
    echo Please install Java 11 or higher
    exit /b 1
)

echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo.
echo Step 2: Building React app...
call npm run build
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

if not exist "build" (
    echo Error: Build directory not created
    exit /b 1
)

echo.
echo Step 3: Syncing with Android...
call npx cap sync android
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo.
echo Step 4: Building Android release...
cd android

echo.
echo Select build type:
echo 1) APK (for testing)
echo 2) AAB (for Play Store)
set /p build_choice="Enter choice (1 or 2): "

if "%build_choice%"=="1" (
    echo Building APK...
    call gradlew.bat assembleRelease
    echo.
    echo ✅ Build complete!
    echo 📦 APK location: android\app\build\outputs\apk\release\app-release.apk
) else if "%build_choice%"=="2" (
    echo Building AAB...
    call gradlew.bat bundleRelease
    echo.
    echo ✅ Build complete!
    echo 📦 AAB location: android\app\build\outputs\bundle\release\app-release.aab
) else (
    echo Invalid choice
    exit /b 1
)

echo.
echo Next steps:
echo - Test the build on a physical device
echo - Upload to Google Play Console
echo - See GOOGLE-PLAY-DEPLOYMENT.md for detailed instructions

pause
