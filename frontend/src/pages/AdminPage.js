import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container page" style={{ paddingTop: '100px' }}>
        <h1 className="dash-title">Admin Dashboard</h1>
        <div className="card mt-8 text-center" style={{ padding: '80px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h3>Admin Panel under maintenance</h3>
          <p className="text-muted">This section is being updated with new administrative tools.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
