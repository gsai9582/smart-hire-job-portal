import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';

const CATEGORIES = [
  { name: 'Technology', icon: '💻', count: 1240 },
  { name: 'Design', icon: '🎨', count: 380 },
  { name: 'Marketing', icon: '📊', count: 290 },
  { name: 'Finance', icon: '💰', count: 215 },
  { name: 'Healthcare', icon: '🏥', count: 178 },
  { name: 'Education', icon: '📚', count: 145 },
  { name: 'Sales', icon: '🤝', count: 320 },
  { name: 'HR', icon: '👥', count: 167 },
];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobAPI.getAll({ limit: 6 });
        setJobs(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${search}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="page">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-eyebrow">✨ 5,000+ Companies Trust Us</div>
            <h1 className="hero-title">Find Your<br /><span>Dream Career</span><br />Today</h1>
            <p className="hero-sub">Discover opportunities that match your skills, experience and ambitions. Thousands of jobs updated daily.</p>
            
            <form className="search-bar" onSubmit={handleSearch}>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--text3)', fontSize: '18px' }}>🔍</span>
              <div className="search-divider"></div>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Job title, skill, or company..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="search-btn">Search Jobs</button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-num">12,400+</div><div className="hero-stat-label">Active Jobs</div></div>
              <div className="hero-stat"><div className="hero-stat-num">5,200+</div><div className="hero-stat-label">Companies</div></div>
              <div className="hero-stat"><div className="hero-stat-num">2.4M+</div><div className="hero-stat-label">Job Seekers</div></div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <div className="section-eyebrow">Browse by Category</div>
              <h2 className="section-title">Explore Top Industries</h2>
            </div>
            <div className="category-grid">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="cat-card" onClick={() => navigate(`/jobs?category=${c.name.toLowerCase()}`)}>
                  <div className="cat-icon">{c.icon}</div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c.count.toLocaleString()} openings</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="section-eyebrow">Hot Picks</div>
                <h2 className="section-title" style={{ fontSize: '32px' }}>Featured Jobs</h2>
              </div>
              <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>View All Jobs →</button>
            </div>
            
            {loading ? (
              <div className="text-center">Loading jobs...</div>
            ) : (
              <div className="grid-2">
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container text-center">
            <div className="floating" style={{ fontSize: '52px', marginBottom: '20px' }}>🚀</div>
            <h2 className="section-title" style={{ fontSize: '40px', marginBottom: '16px' }}>Ready to Land Your<br />Dream Job?</h2>
            <p className="section-sub" style={{ marginBottom: '32px', margin: '0 auto 32px' }}>Join 2.4 million job seekers who found their perfect role through JobPortal</p>
            <div className="flex gap-3" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Create Free Account</button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/jobs')}>Browse Jobs</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
