import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">⚡ JobPortal</div>
            <p className="footer-desc">Your trusted platform for finding the best career opportunities across India and beyond.</p>
          </div>
          <div>
            <h4 className="footer-title">For Job Seekers</h4>
            <ul className="footer-links">
              <li><Link to="/jobs" className="footer-link">Browse Jobs</Link></li>
              <li><Link to="/profile" className="footer-link">Upload Resume</Link></li>
              <li><Link to="/jobs" className="footer-link">Career Advice</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">For Recruiters</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">Post a Job</Link></li>
              <li><Link to="/dashboard" className="footer-link">Browse Candidates</Link></li>
              <li><Link to="/dashboard" className="footer-link">Pricing Plans</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-links">
              <li className="footer-link">📧 hello@jobportal.com</li>
              <li className="footer-link">📞 +91 98765 43210</li>
              <li className="footer-link">📍 Bengaluru, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 JobPortal. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="footer-link" style={{ cursor: 'pointer' }}>Privacy</span>
            <span className="footer-link" style={{ cursor: 'pointer' }}>Terms</span>
            <span className="footer-link" style={{ cursor: 'pointer' }}>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
