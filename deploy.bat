@echo off
echo 🚀 Deploying Brenton's Marketplace to Render...
echo.

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit - Brenton's Marketplace"
)

REM Check if remote exists
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo ❌ No git remote found!
    echo Please create a GitHub repository and run:
    echo git remote add origin https://github.com/yourusername/brentons-marketplace.git
    echo git push -u origin main
    exit /b 1
)

echo 📤 Pushing to GitHub...
git add .
git commit -m "Deploy: %date% %time%"
git push origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 📋 Next steps:
echo 1. Go to https://render.com
echo 2. Click 'New +' -^> 'Blueprint'
echo 3. Connect your GitHub repository
echo 4. Render will detect render.yaml and set up both services
echo.
echo 🔐 Don't forget to add environment variables in Render dashboard:
echo    - MONGODB_URI
echo    - STRIPE_SECRET_KEY
echo    - SHIPPO_API_KEY
echo    - PAYPAL_CLIENT_ID
echo    - PAYPAL_CLIENT_SECRET
echo.
echo 📚 See DEPLOYMENT.md for detailed instructions
pause
