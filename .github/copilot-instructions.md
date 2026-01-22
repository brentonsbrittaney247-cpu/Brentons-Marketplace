# Brenton's Marketplace - AI Agent Instructions

## Brand Identity

**Theme**: Purple-to-pink gradient with gold accents (matching app icon)
- Primary Purple: `#6B4BA6`
- Primary Pink: `#D84A7E`  
- Gold Accent: `#C9A962`
- Dark Background: `#1a1330` to `#2d1b47` gradient
- Maintain consistent gradient aesthetics throughout all UI components
- Use gold accents for borders, highlights, and CTAs

## Architecture Overview

This is a full-stack marketplace platform with **Node.js/Express backend** and **React frontend**, supporting auction and buy-it-now listings with integrated payments, messaging, and shipping.

### Key Components
- **Backend**: Express REST API with MongoDB, Socket.IO for real-time messaging
- **Frontend**: React SPA with Context API for state management
- **Services**: Payment processing (Stripe, PayPal, CashApp), shipping label generation (Shippo), auction monitoring (node-cron)

### Data Flow
1. User creates listing → stored in MongoDB → displayed on homepage
2. Auction bids → Socket.IO broadcasts → real-time UI updates
3. Purchase/auction win → Transaction created → Payment processed → Shipping label auto-generated
4. Messages → Socket.IO real-time delivery → stored in DB

---

## Critical Business Logic

### Fee Structure (in `server/models/Transaction.js` pre-save hook)
- Items < $100: **$2.89** selling fee
- Items ≥ $100: **$4.24** selling fee  
- Returns: **$3.00** buyer fee (charged on refund)

### Auction System (`server/services/auctionService.js`)
- Cron job runs **every minute** checking for ended auctions
- Duration options: **24h or 72h** (set at listing creation)
- `auctionEndTime` calculated in Listing model pre-save hook
- Winner determined by highest bid → Transaction created with `paymentStatus: 'pending'`
- Payment required **immediately** when auction ends

### Payment & Shipping Workflow (`server/routes/transactions.js`)
1. Buyer initiates payment via `/transactions/:id/pay`
2. `PaymentService.processPayment()` charges via chosen method
3. **Automatically** calls `ShippingService.generateLabel()` after successful payment
4. Label URL + tracking number stored in Transaction

### Profile Photo Requirement
All users **must** provide a profile photo during registration (enforced in `server/models/User.js` and frontend validation)

---

## Development Workflows

### Setup & Run
```bash
# Root: Install all dependencies
npm run install-all

# Configure environment
cp .env.example .env
# Edit .env with API keys (Stripe, PayPal, Shippo, MongoDB URI)

# Development (both servers)
npm run dev

# Production build
npm run build
npm start
```

### Database
- MongoDB connection in `server/index.js`
- Models in `server/models/` use Mongoose schemas
- No migrations - schema changes handled via model updates

### Testing Payments
- Use Stripe test cards: `4242 4242 4242 4242`
- PayPal/CashApp integrations are **mocked** in `paymentService.js` (marked with TODO comments)

---

## Project-Specific Conventions

### Route Structure
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Listings**: `/api/listings`, `/api/listings/:id`, `/api/listings/:id/bid`, `/api/listings/:id/buy`
- **Transactions**: `/api/transactions/my`, `/api/transactions/:id/pay`, `/api/transactions/:id/return`
- **Messages**: `/api/messages`, `/api/messages/listing/:listingId`
- **Reviews**: `/api/reviews`, `/api/reviews/user/:userId`

### Authentication
- JWT tokens stored in `localStorage` on client
- `auth` middleware in `server/middleware/auth.js` validates Bearer tokens
- Token includes user ID, verified against DB on each request

### File Uploads (Multer)
- Profile photos → `uploads/profiles/`
- Listing images → `uploads/listings/`
- Max 10 images per listing (enforced in frontend)

### Category Enum (in both `server/models/Listing.js` and frontend pages)
```javascript
['home-garden', 'electronics', 'apparel-men', 'apparel-women', 
 'apparel-baby-kids', 'apparel-juniors', 'sports-outdoors', 
 'collectables', 'pets', 'adult-weird']
```

### Socket.IO Events
- `join-room` - User joins their room (userId)
- `new-message` - Emitted when message sent, delivered to receiver's room

---

## Integration Points

### External APIs
- **Stripe** (`paymentService.js`): Credit card/Apple Pay processing
- **Shippo** (`shippingService.js`): Generate prepaid shipping labels with tracking
- **PayPal/CashApp**: SDK integrations pending (marked with mock implementations)

### Real-Time Communication
- Socket.IO connection established in `client/src/context/SocketContext.js`
- Server broadcasts to specific user rooms (e.g., `io.to(userId).emit(...)`)
- Messages route uses `req.app.get('io')` to access Socket instance

---

## Key Files & Their Roles

### Backend Core
- `server/index.js` - Express setup, Socket.IO init, auction monitor start
- `server/services/auctionService.js` - Cron job, bid placement, auction finalization
- `server/services/paymentService.js` - Multi-method payment processing, refund logic
- `server/services/shippingService.js` - Shippo integration for label generation
- `server/models/Transaction.js` - Fee calculation in pre-save hook

### Frontend Core
- `client/src/App.js` - Router setup, PrivateRoute wrapper
- `client/src/context/AuthContext.js` - User login/register/logout, token management
- `client/src/context/SocketContext.js` - Socket connection lifecycle
- `client/src/pages/ListingDetail.js` - Bid placement, buy-now, real-time auction timer
- `client/src/pages/Home.js` - Listing grid with category/type filters

---

## Common Tasks

### Adding a New Category
1. Update enum in `server/models/Listing.js`
2. Add to `CATEGORIES` array in `client/src/pages/CreateListing.js` and `Home.js`

### Modifying Fee Structure
Edit pre-save hook in `server/models/Transaction.js` (line ~35)

### Changing Auction Durations
Update enum in `server/models/Listing.js` (line ~61) and dropdown in `client/src/pages/CreateListing.js`

### Adding New Payment Method
1. Add to `paymentMethod` enum in `server/models/Transaction.js`
2. Implement in `PaymentService.processPayment()` switch statement
3. Add UI option in frontend payment forms
