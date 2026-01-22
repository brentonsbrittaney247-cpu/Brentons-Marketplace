# 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

## ✅ Accounts Created
- [ ] GitHub account (https://github.com)
- [ ] MongoDB Atlas account (https://cloud.mongodb.com)
- [ ] Render account (https://render.com)
- [ ] Stripe account (https://stripe.com)
- [ ] Shippo account (https://goshippo.com)

## ✅ Software Installed
- [ ] Git (https://git-scm.com/download/win)
- [ ] Node.js (should already be installed)

## ✅ Information Ready to Copy
Prepare a text file with these values before deployment:

```
=== MONGODB ===
Connection String: mongodb+srv://username:password@cluster.mongodb.net/brentons-marketplace
Database Name: brentons-marketplace

=== STRIPE ===
Secret Key: sk_test_...

=== SHIPPO ===
API Key: shippo_test_...

=== JWT SECRET ===
Random String (32+ chars): [Generate using PowerShell command below]

=== GITHUB ===
Repository URL: https://github.com/YOUR_USERNAME/brentons-marketplace
```

## Generate JWT Secret
Run in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## ✅ Repository Setup
- [ ] Git initialized locally
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is PUBLIC (required for Render free tier)

## ✅ MongoDB Atlas Setup
- [ ] Cluster created (M0 free tier)
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0 (allow from anywhere)
- [ ] Connection string obtained and tested

## ✅ Render Setup
- [ ] Signed up and connected GitHub account
- [ ] Blueprint deployed from render.yaml
- [ ] Both services created (API + Frontend)
- [ ] Environment variables added to API service:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] STRIPE_SECRET_KEY
  - [ ] SHIPPO_API_KEY
  - [ ] CLIENT_URL
- [ ] Environment variable added to Frontend service:
  - [ ] REACT_APP_API_URL
- [ ] Services deployed successfully
- [ ] Build logs checked for errors

## ✅ Testing
- [ ] Frontend URL loads: https://brentons-marketplace.onrender.com
- [ ] API health check works: https://brentons-marketplace-api.onrender.com/health
- [ ] Can register new user (with profile photo)
- [ ] Can create listing
- [ ] Can view listings
- [ ] Real-time updates working

## 🎯 Quick Start Command
```bash
cd C:\marketplace-app
start-deployment.bat
```

Then follow the on-screen instructions and DEPLOY-GUIDE.md!

---

**Total Time Estimate:** 30-45 minutes
**Cost:** $0 (all free tiers)
**Support:** See DEPLOYMENT.md for troubleshooting
