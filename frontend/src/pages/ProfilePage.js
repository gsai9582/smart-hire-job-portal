import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container page" style={{ paddingTop: '100px' }}>
        <div className="profile-header">
          <div className="flex gap-6 items-end">
            <div className="profile-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-sub">{user?.email} • {user?.role}</p>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3 className="auth-title" style={{ marginBottom: '20px' }}>Personal Info</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.name}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.email}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.location || 'Not set'}</div>
            </div>
          </div>

          <div className="card">
            <h3 className="auth-title" style={{ marginBottom: '20px' }}>Skills & Experience</h3>
            <div className="form-group">
              <label className="form-label">Skills</label>
              <div className="tag-list">
                {user?.skills?.length ? user.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                )) : <span className="text-muted">No skills added yet</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <div className="form-control" style={{ background: 'var(--surface)' }}>{user?.experience || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
