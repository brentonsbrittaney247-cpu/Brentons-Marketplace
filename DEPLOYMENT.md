# Deployment Guide - Brenton's Marketplace

## Prerequisites

1. **MongoDB Atlas Account** (free tier available)
   - Sign up at https://cloud.mongodb.com
   - Create a cluster
   - Get your connection string

2. **API Keys**
   - Stripe: https://dashboard.stripe.com
   - Shippo: https://goshippo.com
   - PayPal: https://developer.paypal.com

## Option 1: Deploy to Render (Recommended - Free Tier)

### Step 1: Prepare Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Brenton's Marketplace"

# Push to GitHub
git remote add origin https://github.com/yourusername/brentons-marketplace.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create both services

### Step 3: Configure Environment Variables

In Render dashboard, for the **API service**:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `SHIPPO_API_KEY`: Your Shippo API key
- `PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal secret
- `CLIENT_URL`: Your frontend URL (e.g., https://brentons-marketplace.onrender.com)

For the **frontend service**:
- `REACT_APP_API_URL`: Your API URL (e.g., https://brentons-marketplace-api.onrender.com)

### Step 4: Update CORS Settings

After deployment, update `server/index.js` with your production frontend URL.

## Option 2: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy
```bash
railway init
railway up
```

### Step 3: Add Environment Variables
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set STRIPE_SECRET_KEY="your_stripe_key"
railway variables set SHIPPO_API_KEY="your_shippo_key"
railway variables set CLIENT_URL="your_frontend_url"
```

## Option 3: Deploy Frontend to Vercel + Backend to Render

### Frontend (Vercel)
```bash
cd client
npm install -g vercel
vercel

# Set environment variable
vercel env add REACT_APP_API_URL
# Enter your backend API URL
```

### Backend (Render)
1. Create a new **Web Service** on Render
2. Connect your repository
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in dashboard

## MongoDB Atlas Setup

1. Create account at https://cloud.mongodb.com
2. **Create Cluster** (free M0 tier)
3. **Database Access**: Create user with password
4. **Network Access**: Add IP `0.0.0.0/0` (allow from anywhere)
5. **Connect**: Get connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `brentons-marketplace`

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created and accessible
- [ ] All environment variables configured
- [ ] CORS configured with production URLs
- [ ] API keys added (Stripe, Shippo, PayPal)
- [ ] Frontend can reach backend API
- [ ] Socket.IO connections working
- [ ] File uploads working (may need cloud storage for production)
- [ ] Test user registration with profile photo
- [ ] Test listing creation
- [ ] Test auction bidding
- [ ] Test messaging

## File Upload Configuration (Production)

For production, consider using cloud storage:
- **AWS S3**
- **Cloudinary**
- **Azure Blob Storage**

Update `server/routes/auth.js` and `server/routes/listings.js` to use cloud storage instead of local filesystem.

## Monitoring & Maintenance

- Check logs in Render/Railway dashboard
- Monitor MongoDB Atlas usage
- Set up error tracking (e.g., Sentry)
- Configure alerts for downtime

## Custom Domain (Optional)

Both Render and Vercel support custom domains:
1. Purchase domain (e.g., brentonsmarketplace.com)
2. Add domain in platform settings
3. Update DNS records as instructed

## Estimated Costs

- **Render Free Tier**: $0/month (services sleep after inactivity)
- **MongoDB Atlas Free**: $0/month (512MB storage)
- **Render Paid**: $7/month per service for always-on
- **Domain**: ~$12/year

## Support

For deployment issues:
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
