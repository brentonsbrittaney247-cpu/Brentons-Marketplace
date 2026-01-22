import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/my');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <img
          src={user.profilePhoto}
          alt={user.username}
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h3>{user.username}</h3>
          <p>Rating: ⭐ {user.rating.toFixed(1)} ({user.reviewCount} reviews)</p>
          <p>{user.email}</p>
        </div>
      </div>

      <h3>My Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <div>
          {transactions.map(tx => (
            <div key={tx._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
              <h4>{tx.listing.title}</h4>
              <p>Sale Price: ${tx.salePrice.toFixed(2)}</p>
              <p>Selling Fee: ${tx.sellingFee.toFixed(2)}</p>
              <p>Status: {tx.paymentStatus}</p>
              {tx.shippingLabel && (
                <p>Tracking: {tx.shippingLabel.trackingNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
