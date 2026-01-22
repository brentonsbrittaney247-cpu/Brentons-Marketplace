@echo off
color 0A
echo.
echo ===============================================
echo   BRENTON'S MARKETPLACE - DEPLOYMENT HELPER
echo ===============================================
echo.

REM Check if Git is installed
where git >nul 2>&1
if errorlevel 1 (
    echo [X] Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Run installer with default settings
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo [✓] Git is installed
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [X] Error: Run this script from the marketplace-app directory
    echo.
    echo Usage: cd C:\marketplace-app
    echo        start-deployment.bat
    echo.
    pause
    exit /b 1
)

echo [✓] In correct directory
echo.

REM Check if git is already initialized
if exist ".git" (
    echo [i] Git repository already initialized
) else (
    echo [*] Initializing Git repository...
    git init
    if errorlevel 1 (
        echo [X] Failed to initialize git
        pause
        exit /b 1
    )
    echo [✓] Git initialized
)

echo.
echo [*] Adding files to git...
git add .
echo [✓] Files staged

echo.
echo [*] Creating initial commit...
git commit -m "Initial commit - Brenton's Marketplace"
if errorlevel 1 (
    echo [i] Commit may have already been created
)

echo.
echo ===============================================
echo   NEXT STEPS - DO THESE MANUALLY
echo ===============================================
echo.
echo 1. CREATE GITHUB REPOSITORY
echo    - Go to: https://github.com/new
echo    - Name: brentons-marketplace
echo    - Make it PUBLIC (required for free hosting)
echo    - Don't add README, .gitignore, or license
echo    - Click "Create repository"
echo.
echo 2. CONNECT TO GITHUB
echo    After creating the repo, run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/brentons-marketplace.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. SETUP MONGODB ATLAS
echo    - Visit: https://cloud.mongodb.com
echo    - Create free M0 cluster
echo    - See DEPLOY-GUIDE.md for detailed steps
echo.
echo 4. DEPLOY ON RENDER
echo    - Visit: https://render.com
echo    - Sign up with GitHub
echo    - New + → Blueprint
echo    - Connect your brentons-marketplace repo
echo    - Add environment variables (see DEPLOY-GUIDE.md)
echo.
echo ===============================================
echo.
echo 📖 For detailed instructions, see: DEPLOY-GUIDE.md
echo.
pause
