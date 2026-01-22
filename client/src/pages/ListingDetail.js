import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
      if (response.data.listingType === 'auction') {
        setBidAmount((response.data.currentBid + 1).toFixed(2));
      }
    } catch (err) {
      setError('Failed to load listing');
    }
  };

  const handleBid = async () => {
    try {
      await api.post(`/listings/${id}/bid`, { amount: parseFloat(bidAmount) });
      setMessage('Bid placed successfully!');
      fetchListing();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place bid');
    }
  };

  const handleBuyNow = async () => {
    try {
      await api.post(`/listings/${id}/buy`);
      setMessage('Purchase initiated! Proceed to payment.');
      fetchListing();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to purchase');
    }
  };

  if (!listing) return <div>Loading...</div>;

  const timeRemaining = () => {
    if (listing.listingType !== 'auction') return null;
    
    const now = new Date();
    const end = new Date(listing.auctionEndTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const sellingFee = listing.listingType === 'buy-now' 
    ? (listing.price >= 100 ? 4.24 : 2.89)
    : (listing.currentBid >= 100 ? 4.24 : 2.89);

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      {message && <div style={{ padding: '10px', background: '#d4edda', marginBottom: '20px' }}>{message}</div>}
      {error && <div style={{ padding: '10px', background: '#f8d7da', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {listing.images[0] && (
            <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', borderRadius: '8px' }} />
          )}
        </div>

        <div>
          <h1>{listing.title}</h1>
          <p>Seller: {listing.seller.username} ⭐ {listing.seller.rating.toFixed(1)}</p>
          
          {listing.listingType === 'auction' ? (
            <>
              <div className="auction-timer">
                <div>Current Bid: ${listing.currentBid.toFixed(2)}</div>
                <div>Time Remaining: {timeRemaining()}</div>
              </div>

              {user && listing.status === 'active' && (
                <div style={{ marginTop: '20px' }}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={listing.currentBid + 0.01}
                    step="0.01"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  />
                  <button onClick={handleBid} className="btn" style={{ width: '100%' }}>
                    Place Bid
                  </button>
                </div>
              )}

              {listing.bids.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Bid History</h3>
                  {listing.bids.slice(-5).reverse().map((bid, idx) => (
                    <div key={idx} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                      ${bid.amount.toFixed(2)} - {bid.bidder.username}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ color: '#007bff' }}>${listing.price.toFixed(2)}</h2>
              {user && listing.status === 'active' && (
                <button onClick={handleBuyNow} className="btn" style={{ width: '100%' }}>
                  Buy Now
                </button>
              )}
            </>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <p><strong>Selling Fee:</strong> ${sellingFee.toFixed(2)}</p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              Fee charged when item sells. Returns incur a $3.00 buyer fee.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Description</h2>
        <p>{listing.description}</p>
      </div>
    </div>
  );
}

export default ListingDetail;
