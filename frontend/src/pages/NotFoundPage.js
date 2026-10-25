import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container page text-center" style={{ paddingTop: '150px' }}>
        <div style={{ fontSize: '100px', marginBottom: '24px' }}>404</div>
        <h1 className="hero-title">Page Not Found</h1>
        <p className="hero-sub" style={{ margin: '0 auto 40px' }}>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
      </main>
      <Footer />
    </div>
  );
}
