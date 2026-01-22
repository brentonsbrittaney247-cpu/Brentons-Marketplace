import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    listingType: 'buy-now',
    price: '',
    startingBid: '',
    auctionDuration: '24'
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('listingType', formData.listingType);
      
      if (formData.listingType === 'buy-now') {
        data.append('price', formData.price);
      } else {
        data.append('startingBid', formData.startingBid);
        data.append('auctionDuration', formData.auctionDuration);
      }

      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }

      await api.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Create Listing</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Listing Type</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
          >
            <option value="buy-now">Buy It Now</option>
            <option value="auction">Auction</option>
          </select>
        </div>

        {formData.listingType === 'buy-now' ? (
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Starting Bid ($)</label>
              <input
                type="number"
                name="startingBid"
                value={formData.startingBid}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Auction Duration</label>
              <select
                name="auctionDuration"
                value={formData.auctionDuration}
                onChange={handleChange}
              >
                <option value="24">24 hours</option>
                <option value="72">72 hours</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Images (up to 10)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 10))}
          />
        </div>

        <button type="submit" className="btn">Create Listing</button>
      </form>
    </div>
  );
}

export default CreateListing;
