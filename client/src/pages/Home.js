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
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a1330 0%, #2d1b47 50%, #3d2357 100%)', padding: '40px', color: '#f0f0f0'}}>
      <h1 style={{fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent', textAlign: 'center', marginBottom: '30px', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))'}}>Browse Listings</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '15px', marginBottom: '10px', background: '#2d1b47', border: '2px solid #6B4BA6', borderRadius: '8px', color: '#f0f0f0', fontSize: '1rem' }}
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

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '30px'}}>
        {listings.map(listing => (
          <Link
            key={listing._id}
            to={`/listing/${listing._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{background: 'linear-gradient(135deg, #2d1b47 0%, rgba(107, 75, 166, 0.5) 100%)', border: '2px solid #6B4BA6', borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.4s', boxShadow: '0 8px 24px rgba(107, 75, 166, 0.4)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #C9A962 0%, #FFD700 50%, #C9A962 100%)'}}></div>
              {listing.images[0] && (
                <img src={listing.images[0]} alt={listing.title} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px'}} />
              )}
              <h3 style={{color: '#FFD700', fontSize: '1.3rem', marginBottom: '10px'}}>{listing.title}</h3>
              <p style={{color: '#f0f0f0', marginBottom: '15px'}}>{listing.description.substring(0, 100)}...</p>
              
              {listing.listingType === 'buy-now' ? (
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#C9A962'}}>${listing.price.toFixed(2)}</p>
              ) : (
                <>
                  <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#D84A7E'}}>Current Bid: ${listing.currentBid.toFixed(2)}</p>
                  <p style={{ fontSize: '0.9rem', color: '#9B7EC9' }}>
                    {formatTimeRemaining(listing.auctionEndTime)}
                  </p>
                </>
              )}
              
              <p style={{ fontSize: '0.9rem', marginTop: '15px', color: '#E85C8F' }}>
                Seller: {listing.seller.username} ⭐ {listing.seller.rating.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {listings.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#9B7EC9' }}>
          No listings found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}

export default Home;
