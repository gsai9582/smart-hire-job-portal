import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = user.role === 'recruiter' ? await jobAPI.getMyJobs() : await applicationAPI.getMyApplications();
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container page" style={{ paddingTop: '100px' }}>
        <div className="dash-header">
          <h1 className="dash-title">Welcome back, {user?.name}</h1>
          <div className="badge badge-purple">{user?.role}</div>
        </div>

        <div className="grid-3 mb-8">
          <div className="stat-card blue">
            <div className="stat-value">{data?.pagination?.total || data?.data?.length || 0}</div>
            <div className="stat-label">{user?.role === 'recruiter' ? 'Active Jobs' : 'Applications'}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-value">{user?.role === 'recruiter' ? '142' : '3'}</div>
            <div className="stat-label">{user?.role === 'recruiter' ? 'Total Applicants' : 'Interviews'}</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-value">Active</div>
            <div className="stat-label">Profile Status</div>
          </div>
        </div>

        <div className="card">
          <h3 className="auth-title" style={{ marginBottom: '20px' }}>
            {user?.role === 'recruiter' ? 'Your Posted Jobs' : 'Your Applications'}
          </h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{user?.role === 'recruiter' ? 'Job Title' : 'Company'}</th>
                  <th>{user?.role === 'recruiter' ? 'Applicants' : 'Job Title'}</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {user?.role === 'recruiter' ? (
                  data?.data?.map(job => (
                    <tr key={job._id}>
                      <td><div className="font-bold">{job.title}</div></td>
                      <td>{job.applicantsCount} Applicants</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  ))
                ) : (
                  data?.data?.map(app => (
                    <tr key={app._id}>
                      <td><div className="font-bold">{app.job?.company?.name || 'Company'}</div></td>
                      <td>{app.job?.title}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td><span className={`badge badge-${app.status === 'rejected' ? 'red' : 'blue'}`}>{app.status}</span></td>
                    </tr>
                  ))
                )}
                {(!data?.data?.length) && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-muted">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
