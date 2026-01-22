const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const PaymentService = require('../services/paymentService');
const ShippingService = require('../services/shippingService');

// Get user transactions
router.get('/my', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    })
      .populate('listing')
      .populate('buyer', 'username profilePhoto')
      .populate('seller', 'username profilePhoto')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails, shippingAddress, billingAddress } = req.body;

    const transaction = await Transaction.findById(req.params.id)
      .populate('listing')
      .populate('seller');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Process payment
    transaction.paymentMethod = paymentMethod;
    await transaction.save();

    const paymentResult = await PaymentService.processPayment(
      transaction._id,
      paymentMethod,
      paymentDetails
    );

    // Generate shipping label automatically after payment
    const sellerAddress = billingAddress; // Would come from seller profile in production
    const shippingLabel = await ShippingService.generateLabel(
      transaction,
      shippingAddress,
      sellerAddress
    );

    transaction.shippingLabel = shippingLabel;
    await transaction.save();

    res.json({ transaction, paymentResult, shippingLabel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process return
router.post('/:id/return', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const refundedTransaction = await PaymentService.processRefund(transaction._id);
    res.json(refundedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
