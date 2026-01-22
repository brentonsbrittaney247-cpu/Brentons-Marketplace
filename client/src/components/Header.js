import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <h1>Brenton's Marketplace</h1>
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/create-listing">Sell</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
