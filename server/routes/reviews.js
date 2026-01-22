const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { transactionId, revieweeId, rating, comment } = req.body;

    // Verify transaction exists and user is part of it
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const isParticipant = 
      transaction.buyer.toString() === req.user._id.toString() ||
      transaction.seller.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      transaction: transactionId,
      reviewer: req.user._id,
      reviewee: revieweeId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted' });
    }

    const review = new Review({
      transaction: transactionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment
    });

    await review.save();

    // Update reviewee's rating
    const reviewee = await User.findById(revieweeId);
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    reviewee.rating = avgRating;
    reviewee.reviewCount = allReviews.length;
    await reviewee.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'username profilePhoto')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
