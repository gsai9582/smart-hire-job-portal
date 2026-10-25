import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">⚡ JobPortal</Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>Find Jobs</Link>
          {token && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
          )}
        </div>
        <div className="nav-actions">
          {token ? (
            <>
              <button className="avatar-btn" title={user?.name}>
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
