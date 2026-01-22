# Brenton's Marketplace

A premium marketplace platform featuring a stunning purple-to-pink gradient theme with gold accents. Supporting both Buy-It-Now and Auction listings with integrated payments, messaging, reviews, and automated shipping labels.

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
