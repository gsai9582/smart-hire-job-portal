import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        keyword: filters.keyword,
        category: filters.category,
        type: filters.type,
        location: filters.location
      };
      const res = await jobAPI.getAll(params);
      setJobs(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(name, value);
    else newParams.delete(name);
    setSearchParams(newParams);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container page" style={{ paddingTop: '100px' }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Discover Your Next Opportunity</h1>
          <p className="section-sub">Showing {jobs.length} of {total} jobs matches your criteria</p>
        </div>

        <div className="jobs-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-title">Filters</div>
            
            <div className="filter-group">
              <label className="filter-label">Search Keyword</label>
              <input 
                type="text" 
                name="keyword"
                className="form-control" 
                placeholder="e.g. React, Manager" 
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select 
                name="category"
                className="form-control" 
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Job Type</label>
              <label className="filter-option">
                <input type="radio" name="type" value="" checked={filters.type === ''} onChange={handleFilterChange} />
                <span>All Types</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="type" value="full-time" checked={filters.type === 'full-time'} onChange={handleFilterChange} />
                <span>Full-time</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="type" value="part-time" checked={filters.type === 'part-time'} onChange={handleFilterChange} />
                <span>Part-time</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="type" value="internship" checked={filters.type === 'internship'} onChange={handleFilterChange} />
                <span>Internship</span>
              </label>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input 
                type="text" 
                name="location"
                className="form-control" 
                placeholder="City or Remote" 
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <button 
              className="btn btn-secondary w-full" 
              onClick={() => {
                setFilters({ keyword: '', category: '', type: '', location: '' });
                setSearchParams({});
              }}
            >
              Clear All Filters
            </button>
          </aside>

          {/* Jobs List */}
          <div className="jobs-content">
            {loading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="card text-center" style={{ padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 className="auth-title">No jobs found</h3>
                <p className="text-muted">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
                
                {/* Pagination Placeholder */}
                {total > 10 && (
                  <div className="flex justify-center mt-8" style={{ gap: '8px' }}>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                    <button className="btn btn-primary btn-sm">{page}</button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      disabled={page * 10 >= total}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
