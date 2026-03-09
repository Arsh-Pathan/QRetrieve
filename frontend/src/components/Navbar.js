import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">Q</span>
          <span className="brand-text">QRetrieve</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Register
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
