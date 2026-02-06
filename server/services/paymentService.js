const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');

class PaymentService {
  // Process payment based on method
  static async processPayment(transactionId, paymentMethod, paymentDetails) {
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    try {
      let result;
      
      switch (paymentMethod) {
        case 'visa':
        case 'apple-pay':
          result = await this.processStripePayment(transaction, paymentDetails);
          break;
        case 'paypal':
          result = await this.processPayPalPayment(transaction, paymentDetails);
          break;
        case 'cashapp':
          result = await this.processCashAppPayment(transaction, paymentDetails);
          break;
        default:
          throw new Error('Invalid payment method');
      }

      transaction.paymentStatus = 'completed';
      await transaction.save();

      return result;
    } catch (error) {
      transaction.paymentStatus = 'failed';
      await transaction.save();
      throw error;
    }
  }

  static async processStripePayment(transaction, paymentDetails) {
    const totalAmount = transaction.salePrice + transaction.sellingFee;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentDetails.paymentMethodId,
      confirm: true,
      metadata: {
        transactionId: transaction._id.toString()
      }
    });

    return { paymentIntent };
  }

  static async processPayPalPayment(transaction, paymentDetails) {
    // PayPal SDK integration would go here
    // For now, return mock success
    return { paypalOrderId: paymentDetails.orderId };
  }

  static async processCashAppPayment(transaction, paymentDetails) {
    // CashApp API integration would go here
    // For now, return mock success
    return { cashAppPaymentId: paymentDetails.paymentId };
  }

  static async processRefund(transactionId) {
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction || transaction.paymentStatus !== 'completed') {
      throw new Error('Invalid transaction for refund');
    }

    // Calculate return fee based on purchase price
    if (transaction.salePrice < 100) {
      // Under $100: $4.24 flat fee
      transaction.returnFee = 4.24;
    } else {
      // $101 or more: 13% of price + shipping costs
      const percentageFee = transaction.salePrice * 0.13;
      transaction.returnFee = percentageFee + (transaction.shippingCost || 0);
    }
    
    transaction.isReturned = true;
    transaction.paymentStatus = 'refunded';
    await transaction.save();

    return transaction;
  }
}

module.exports = PaymentService;
