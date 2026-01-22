const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');
const AuctionService = require('../services/auctionService');

const upload = multer({ dest: 'uploads/listings/' });

// Create listing
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category, listingType, price, startingBid, auctionDuration } = req.body;

    const listing = new Listing({
      title,
      description,
      category,
      listingType,
      price: listingType === 'buy-now' ? price : undefined,
      startingBid: listingType === 'auction' ? startingBid : undefined,
      currentBid: listingType === 'auction' ? startingBid : undefined,
      auctionDuration: listingType === 'auction' ? auctionDuration : undefined,
      images: req.files.map(f => `/uploads/listings/${f.filename}`),
      seller: req.user._id
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const { category, listingType, search } = req.query;
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (listingType) filter.listingType = listingType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(filter)
      .populate('seller', 'username profilePhoto rating')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'username profilePhoto rating')
      .populate('bids.bidder', 'username');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place bid on auction
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const listing = await AuctionService.placeBid(req.params.id, req.user._id, amount);
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buy now (immediate purchase)
router.post('/:id/buy', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || listing.listingType !== 'buy-now') {
      return res.status(400).json({ error: 'Invalid listing' });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Listing not available' });
    }

    listing.status = 'sold';
    listing.buyer = req.user._id;
    await listing.save();

    const Transaction = require('../models/Transaction');
    const transaction = new Transaction({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller,
      salePrice: listing.price,
      paymentMethod: 'pending',
      paymentStatus: 'pending'
    });

    await transaction.save();

    res.json({ listing, transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
