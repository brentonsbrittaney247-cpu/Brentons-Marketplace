import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = [
  { value: 'home-garden', label: 'Home & Garden' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel-men', label: 'Apparel - Men' },
  { value: 'apparel-women', label: 'Apparel - Women' },
  { value: 'apparel-baby-kids', label: 'Apparel - Baby/Kids' },
  { value: 'apparel-juniors', label: 'Apparel - Juniors' },
  { value: 'sports-outdoors', label: 'Sports & Outdoors' },
  { value: 'collectables', label: 'Collectables' },
  { value: 'pets', label: 'Pets' },
  { value: 'adult-weird', label: 'Adult/Weird Stuff' }
];

function Home() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState('');
  const [listingType, setListingType] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchListings();
  }, [category, listingType, search]);

  const fetchListings = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (listingType) params.listingType = listingType;
      if (search) params.search = search;

      const response = await api.get('/listings', { params });
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div>
      <h1>Browse Listings</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        <div className="category-filter">
          <button
            className={!category ? 'active' : ''}
            onClick={() => setCategory('')}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={category === cat.value ? 'active' : ''}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="category-filter">
          <button
            className={!listingType ? 'active' : ''}
            onClick={() => setListingType('')}
          >
            All Types
          </button>
          <button
            className={listingType === 'buy-now' ? 'active' : ''}
            onClick={() => setListingType('buy-now')}
          >
            Buy Now
          </button>
          <button
            className={listingType === 'auction' ? 'active' : ''}
            onClick={() => setListingType('auction')}
          >
            Auction
          </button>
        </div>
      </div>

      <div className="listing-grid">
        {listings.map(listing => (
          <Link
            key={listing._id}
            to={`/listing/${listing._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="listing-card">
              {listing.images[0] && (
                <img src={listing.images[0]} alt={listing.title} />
              )}
              <h3>{listing.title}</h3>
              <p>{listing.description.substring(0, 100)}...</p>
              
              {listing.listingType === 'buy-now' ? (
                <p><strong>${listing.price.toFixed(2)}</strong></p>
              ) : (
                <>
                  <p><strong>Current Bid: ${listing.currentBid.toFixed(2)}</strong></p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {formatTimeRemaining(listing.auctionEndTime)}
                  </p>
                </>
              )}
              
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                Seller: {listing.seller.username} ⭐ {listing.seller.rating.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {listings.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>
          No listings found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}

export default Home;
