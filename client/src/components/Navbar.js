// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const username = getUsernameFromToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>
        <span role="img" aria-label="money">💸</span> Expense Tracker
      </h2>
      <div className="nav-links">
        <Link to="/">Add Expense</Link>
        <Link to="/list">All Expenses</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <button onClick={handleLogout}>Logout</button>

        {/* ✅ Only render if username exists */}
        {username && (
          <span style={{ color: 'white', marginLeft: '20px' }}>
            Hello, {username}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

