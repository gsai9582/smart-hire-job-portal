import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const formatSalary = (sal) => {
    if (!sal || !sal.min) return 'Not disclosed';
    const fmt = (n) => n >= 100000 ? `${(n/100000).toFixed(1)}L` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n;
    return `₹${fmt(sal.min)} – ₹${fmt(sal.max)} / ${sal.period || 'yr'}`;
  };

  return (
    <div className={`job-card ${job.isFeatured ? 'featured' : ''}`} onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="flex gap-3 items-center" style={{ marginBottom: '14px' }}>
        <div className="job-logo">🏢</div>
        <div>
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company?.name || 'Unknown Company'}</div>
        </div>
      </div>
      <div className="job-meta">
        <div className="job-tag">📍 {job.location?.city || 'Remote'}</div>
        <div className="job-tag">🕒 {job.type || 'Full-time'}</div>
        <div className="job-tag">💼 {job.experience || 'Not specified'}</div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="job-salary">{formatSalary(job.salary)}</div>
        <div className="text-xs text-muted">2 days ago</div>
      </div>
    </div>
  );
}
