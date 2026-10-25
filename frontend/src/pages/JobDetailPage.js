import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobAPI.getOne(id);
        setJob(res.data.data);
      } catch (err) {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!resume) {
      toast.error('Please upload a resume');
      return;
    }
    
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      const res = await applicationAPI.apply(id, formData);
      setApplicationResult(res.data);
      setShowModal(false);
      setShowSuccessModal(true);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading job details...</div>;
  if (!job) return null;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container page" style={{ paddingTop: '100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          
          <div className="job-main">
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="flex gap-4 items-center mb-6">
                <div className="job-logo" style={{ width: '64px', height: '64px', fontSize: '28px' }}>🏢</div>
                <div>
                  <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '4px' }}>{job.title}</h1>
                  <div className="text-accent" style={{ fontWeight: 600 }}>{job.company?.name}</div>
                </div>
              </div>

              <div className="job-meta" style={{ marginBottom: '24px' }}>
                <div className="job-tag">📍 {job.location?.city}</div>
                <div className="job-tag">💼 {job.type}</div>
                <div className="job-tag">🎓 {job.experience}</div>
                <div className="job-tag">📅 Posted {new Date(job.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="divider" style={{ margin: '32px 0' }}></div>

              <h3 className="auth-title" style={{ marginBottom: '16px' }}>Description</h3>
              <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '32px' }}>
                {job.description || 'No description provided.'}
              </p>

              <h3 className="auth-title" style={{ marginBottom: '16px' }}>Requirements</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text2)', lineHeight: 1.8 }}>
                {job.requirements?.map((req, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="job-sidebar">
            <div className="card card-elevated" style={{ position: 'sticky', top: '100px' }}>
              <div className="text-center mb-6">
                <div className="text-sm text-muted mb-1">Offered Salary</div>
                <div className="job-salary" style={{ fontSize: '24px' }}>
                  ₹{(job.salary?.min/100000).toFixed(1)}L - {(job.salary?.max/100000).toFixed(1)}L
                </div>
                <div className="text-xs text-muted">Per Year</div>
              </div>

              <button 
                className="btn btn-primary w-full btn-lg" 
                onClick={() => setShowModal(true)}
                disabled={user?.role === 'recruiter'}
              >
                {user?.role === 'recruiter' ? 'Recruiters cannot apply' : 'Apply for this Job'}
              </button>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted">Job Applicants</span>
                  <span className="text-accent font-bold">{job.applicantsCount || 0}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%', background: 'var(--accent)' }}></div>
                </div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }}></div>

              <div className="text-xs text-center text-muted">
                Be among the first few applicants to increase your chances!
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Apply for {job.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea 
                  className="form-control" 
                  placeholder="Tell the recruiter why you are a good fit for this role..."
                  style={{ minHeight: '120px' }}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Resume (PDF)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  required
                />
                <p className="text-xs text-muted mt-2">Max size: 5MB</p>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal text-center" style={{ maxWidth: '400px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h3 className="modal-title" style={{ marginBottom: '12px' }}>Application Successful!</h3>
            <p className="text-muted mb-8">Your application has been received. Check your email for confirmation.</p>
            
            
            <button className="btn btn-secondary w-full" onClick={() => setShowSuccessModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
