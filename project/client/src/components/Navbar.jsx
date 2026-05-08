import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getGreetingName = (user) => {
  if (!user) return 'User';
  const name = user.name || user.username || user.email || 'User';
  return (name || 'U').split(' ')[0]; // safely get first name
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🌾 CropSense AI</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="welcome-text">Hi, {getGreetingName(user)}</span>
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
