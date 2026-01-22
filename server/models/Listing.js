const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'home-garden',
      'electronics',
      'apparel-men',
      'apparel-women',
      'apparel-baby-kids',
      'apparel-juniors',
      'sports-outdoors',
      'collectables',
      'pets',
      'adult-weird'
    ]
  },
  images: [{
    type: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingType: {
    type: String,
    enum: ['buy-now', 'auction'],
    required: true
  },
  price: {
    type: Number,
    required: function() {
      return this.listingType === 'buy-now';
    }
  },
  startingBid: {
    type: Number,
    required: function() {
      return this.listingType === 'auction';
    }
  },
  currentBid: {
    type: Number,
    default: 0
  },
  auctionDuration: {
    type: Number,
    enum: [24, 72], // hours
    required: function() {
      return this.listingType === 'auction';
    }
  },
  auctionEndTime: {
    type: Date,
    required: function() {
      return this.listingType === 'auction';
    }
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'ended', 'cancelled'],
    default: 'active'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set auction end time on creation
listingSchema.pre('save', function(next) {
  if (this.listingType === 'auction' && !this.auctionEndTime) {
    this.auctionEndTime = new Date(Date.now() + this.auctionDuration * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
