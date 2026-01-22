@echo off
color 0E
echo.
echo ============================================================
echo   BRENTON'S MARKETPLACE - SIMPLE DEPLOYMENT (NO GIT NEEDED)
echo ============================================================
echo.
echo Git is NOT installed on your system.
echo.
echo EASIEST OPTION - Install Git (2 minutes):
echo.
echo 1. Click this link: https://git-scm.com/download/win
echo    (Opens in browser - direct download)
echo.
echo 2. Run the installer - click Next/Next/Install
echo    (Use all default settings)
echo.
echo 3. Close and reopen this terminal
echo.
echo 4. Run: start-deployment.bat
echo.
echo ============================================================
echo   ALTERNATIVE - Deploy WITHOUT Git (Railway)
echo ============================================================
echo.
echo Railway lets you deploy by dragging a folder!
echo.
echo 1. Visit: https://railway.app
echo 2. Sign up (free)
echo 3. Click "New Project"
echo 4. Choose "Deploy from GitHub repo" OR "Empty Project"
echo 5. Connect this folder
echo.
echo Then run: setup-railway.bat
echo.
echo ============================================================
echo   OR - Manual Upload to Render
echo ============================================================
echo.
echo 1. Create account at: https://render.com
echo 2. Click "New +" → "Web Service"
echo 3. Choose "Public Git repository"
echo 4. Paste: [We'll create this after you get GitHub]
echo.
echo ============================================================
echo.
echo 💡 RECOMMENDED: Just install Git (it's quick and easy!)
echo    Download: https://git-scm.com/download/win
echo.
pause
start https://git-scm.com/download/win
