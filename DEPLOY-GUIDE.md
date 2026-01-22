# 🚀 Deploy Brenton's Marketplace - Step by Step

## Prerequisites Installation

### 1. Install Git (if not installed)
Download and install from: https://git-scm.com/download/win
- Run the installer with default settings
- Restart your terminal after installation

### 2. Create GitHub Account
If you don't have one: https://github.com/signup

## Deployment Steps

### Step 1: Initialize Git Repository
```bash
cd C:\marketplace-app
git init
git add .
git commit -m "Initial commit - Brenton's Marketplace"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `brentons-marketplace`
3. Keep it **Public** (required for Render free tier)
4. **Don't** initialize with README (we already have files)
5. Click **Create repository**

### Step 3: Push to GitHub
Copy these commands (GitHub will show them too):
```bash
cd C:\marketplace-app
git remote add origin https://github.com/YOUR_USERNAME/brentons-marketplace.git
git branch -M main
git push -u origin main
```

### Step 4: Setup MongoDB Atlas (5 minutes)
1. Go to https://cloud.mongodb.com/
2. Sign up/Login
3. **Create a New Cluster**
   - Choose **M0 Free** tier
   - Select a cloud provider (AWS recommended)
   - Region: Choose closest to you
   - Cluster Name: `brentons-marketplace`
4. **Security Setup**
   - Database Access → Add Database User
     - Username: `brentons_admin`
     - Password: Generate secure password (SAVE IT!)
   - Network Access → Add IP Address
     - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. **Get Connection String**
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `brentons-marketplace`
   - Should look like: `mongodb+srv://brentons_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/brentons-marketplace?retryWrites=true&w=majority`

### Step 5: Get API Keys

#### Stripe (Payment Processing)
1. Go to https://dashboard.stripe.com/register
2. Complete signup
3. Get your **Secret Key**:
   - Dashboard → Developers → API Keys
   - Copy **Secret key** (starts with `sk_test_...`)

#### Shippo (Shipping Labels)
1. Go to https://goshippo.com/
2. Sign up for free account
3. Dashboard → Settings → API
4. Copy your **Test API Token**

#### PayPal (Optional for now)
Can use later - the app has mock implementations ready

### Step 6: Deploy to Render
1. Go to https://render.com/
2. Click **Sign Up** → Continue with GitHub
3. Authorize Render to access your GitHub
4. Click **New +** → **Blueprint**
5. Connect your `brentons-marketplace` repository
6. Render will detect `render.yaml` and show 2 services:
   - `brentons-marketplace-api` (Backend)
   - `brentons-marketplace` (Frontend)
7. Click **Apply**

### Step 7: Add Environment Variables

**For the API service** (brentons-marketplace-api):
1. Go to the API service in Render dashboard
2. Click **Environment** in left sidebar
3. Add these variables:

```
MONGODB_URI = [Your MongoDB connection string from Step 4]
JWT_SECRET = [Generate random 32+ character string]
STRIPE_SECRET_KEY = [Your Stripe secret key from Step 5]
SHIPPO_API_KEY = [Your Shippo API key from Step 5]
CLIENT_URL = https://brentons-marketplace.onrender.com
```

**For the Frontend service** (brentons-marketplace):
1. Go to the frontend service
2. Click **Environment**
3. Add this variable:

```
REACT_APP_API_URL = https://brentons-marketplace-api.onrender.com
```

### Step 8: Manual Deploy (if needed)
If services don't auto-deploy:
1. Go to each service
2. Click **Manual Deploy** → **Deploy latest commit**

### Step 9: Wait for Deployment
- Backend: ~5-10 minutes
- Frontend: ~3-5 minutes
- Watch the logs in Render dashboard

### Step 10: Test Your Live App! 🎉
Visit: `https://brentons-marketplace.onrender.com`

## Generate JWT Secret
Need a secure JWT secret? Run this in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Troubleshooting

### "Build failed"
- Check logs in Render dashboard
- Verify all environment variables are set correctly

### "Application error"
- Check MongoDB connection string (common issue)
- Verify password doesn't have special characters that need encoding

### "Cannot connect to API"
- Verify `REACT_APP_API_URL` is set correctly
- Check API service is running

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL exactly

## Your Live URLs
- **Frontend**: https://brentons-marketplace.onrender.com
- **API**: https://brentons-marketplace-api.onrender.com
- **Health Check**: https://brentons-marketplace-api.onrender.com/health

## Important Notes

⚠️ **Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake
- MongoDB free tier: 512MB storage

💰 **Upgrade to Paid ($7/month per service):**
- Always-on (no sleeping)
- Better performance
- Custom domains

## Need Help?
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- This project's issues: Create issue on your GitHub repo

---

**Estimated Total Time: 30-45 minutes**
**Cost: $0 (all free tiers)**
