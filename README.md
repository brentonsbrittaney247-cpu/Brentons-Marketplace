# Brenton's Marketplace

A premium marketplace platform featuring a stunning purple-to-pink gradient theme with gold accents. Supporting both Buy-It-Now and Auction listings with integrated payments, messaging, reviews, and automated shipping labels.

**Available on**: Web & Android (Google Play Store ready)

## Features

- **Listing Types**: Buy-It-Now and Auction (24h or 72h duration)
- **Fee Structure**: 
  - Items under $100: $2.89 selling fee
  - Items $100+: $4.24 selling fee
  - Returns: $3 buyer fee
- **Payment Methods**: Visa, PayPal, CashApp, Apple Pay
- **Messaging**: Direct buyer-seller communication
- **Reviews**: User rating system
- **Shipping**: Automated prepaid label generation via Shippo
- **Categories**: Home & Garden, Electronics, Apparel (Men/Women/Baby/Kids/Juniors), Sports & Outdoors, Collectables, Pets, Adult/Weird Stuff

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Frontend**: React, Socket.IO Client
- **Payments**: Stripe (Visa/Apple Pay), PayPal SDK, CashApp API
- **Shipping**: Shippo API

## Setup

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. Start MongoDB locally or use MongoDB Atlas

4. Run development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
brentons-marketplace/
├── server/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, validation, error handling
│   ├── services/       # Business logic (payments, shipping, auctions)
│   ├── utils/          # Helpers
│   └── index.js        # Express server entry
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page-level components
│   │   ├── services/   # API client
│   │   ├── context/    # React context (auth, socket)
│   │   └── App.js
│   └── package.json
└── package.json
```

## API Endpoints

See individual route files in `server/routes/` for detailed endpoint documentation.

## Android App / Google Play Store

The marketplace is available as an Android app using Capacitor to wrap the React web app.

### Quick Build
```bash
cd client
./build-android.sh    # Linux/Mac
build-android.bat     # Windows
```

### Documentation
- **Full deployment guide**: See [GOOGLE-PLAY-DEPLOYMENT.md](./GOOGLE-PLAY-DEPLOYMENT.md)
- **Quick build instructions**: See [client/ANDROID-BUILD.md](./client/ANDROID-BUILD.md)

### Requirements for Google Play Store
- Android Studio or Android SDK Command-line Tools
- Java 11 or higher
- Signing keystore for release builds

The Android app includes:
- Native Android wrapper using Capacitor
- Progressive Web App (PWA) capabilities
- Optimized for mobile experience
- Support for Android 5.1+ (API 22+)
