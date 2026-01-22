const cron = require('node-cron');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');

class AuctionService {
  // Run every minute to check for ended auctions
  static startAuctionMonitor() {
    cron.schedule('* * * * *', async () => {
      try {
        const endedAuctions = await Listing.find({
          listingType: 'auction',
          status: 'active',
          auctionEndTime: { $lte: new Date() }
        }).populate('bids.bidder');

        for (const auction of endedAuctions) {
          await this.finalizeAuction(auction);
        }
      } catch (error) {
        console.error('Auction monitor error:', error);
      }
    });
  }

  static async finalizeAuction(auction) {
    if (auction.bids.length === 0) {
      // No bids - mark as ended
      auction.status = 'ended';
      await auction.save();
      return;
    }

    // Get highest bidder
    const highestBid = auction.bids.sort((a, b) => b.amount - a.amount)[0];
    
    auction.status = 'sold';
    auction.buyer = highestBid.bidder._id;
    await auction.save();

    // Create transaction - payment required immediately
    const transaction = new Transaction({
      listing: auction._id,
      buyer: highestBid.bidder._id,
      seller: auction.seller,
      salePrice: highestBid.amount,
      paymentMethod: 'pending', // Will be set when buyer pays
      paymentStatus: 'pending'
    });

    await transaction.save();
    
    // In production, trigger notification to buyer to complete payment
    console.log(`Auction ${auction._id} ended. Winner: ${highestBid.bidder._id}`);
  }

  static async placeBid(listingId, bidderId, amount) {
    const listing = await Listing.findById(listingId);

    if (!listing || listing.listingType !== 'auction') {
      throw new Error('Invalid auction listing');
    }

    if (listing.status !== 'active') {
      throw new Error('Auction is not active');
    }

    if (new Date() > listing.auctionEndTime) {
      throw new Error('Auction has ended');
    }

    if (amount <= listing.currentBid) {
      throw new Error('Bid must be higher than current bid');
    }

    listing.bids.push({
      bidder: bidderId,
      amount: amount
    });

    listing.currentBid = amount;
    await listing.save();

    return listing;
  }
}

module.exports = AuctionService;
