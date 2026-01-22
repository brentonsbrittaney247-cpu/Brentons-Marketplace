# Quick Deploy Commands

## One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Manual Deploy Steps

### 1️⃣ Push to GitHub
```bash
# Windows
deploy.bat

# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### 2️⃣ Setup MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string

### 3️⃣ Deploy on Render
1. Visit https://render.com
2. **New +** → **Blueprint**
3. Connect GitHub repo
4. Services auto-created from `render.yaml`

### 4️⃣ Add Environment Variables
In Render dashboard for API service:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/brentons-marketplace
STRIPE_SECRET_KEY=sk_test_...
SHIPPO_API_KEY=shippo_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### 5️⃣ Update Frontend API URL
In Render dashboard for frontend service:
```
REACT_APP_API_URL=https://brentons-marketplace-api.onrender.com
```

## Alternative: Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up

# Add variables
railway variables set MONGODB_URI="..."
railway variables set STRIPE_SECRET_KEY="..."
```

## Test Deployment

Visit your deployed URLs:
- Frontend: `https://brentons-marketplace.onrender.com`
- API Health: `https://brentons-marketplace-api.onrender.com/health`

## Troubleshooting

**Services won't start?**
- Check environment variables are set
- Verify MongoDB connection string
- Check build logs in Render dashboard

**CORS errors?**
- Verify `CLIENT_URL` matches your frontend URL
- Check `REACT_APP_API_URL` in frontend env vars

**File uploads failing?**
- In production, consider using Cloudinary or AWS S3
- Update upload middleware to use cloud storage

## Free Tier Limitations

- **Render Free**: Services sleep after 15min inactivity
- **MongoDB Atlas Free**: 512MB storage limit
- First request after sleep takes ~30s to wake up

Upgrade to Render paid plan ($7/mo per service) for always-on hosting.
