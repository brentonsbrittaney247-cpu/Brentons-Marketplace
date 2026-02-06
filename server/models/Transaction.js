const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  sellingFee: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['visa', 'paypal', 'cashapp', 'apple-pay'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingLabel: {
    url: String,
    trackingNumber: String,
    labelId: String
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  isReturned: {
    type: Boolean,
    default: false
  },
  returnFee: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate selling fee based on sale price
transactionSchema.pre('save', function(next) {
  if (!this.sellingFee) {
    this.sellingFee = this.salePrice >= 100 ? 4.24 : 2.89;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
