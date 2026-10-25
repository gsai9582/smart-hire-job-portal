import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'jobseeker'
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      if (res.success) {
        toast.success('Registration successful! Please verify OTP.');
        navigate('/verify-otp', { state: { email: formData.email, phone: formData.phone } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo">⚡ JobPortal</div>
          <p className="auth-tagline">Start your career journey with us today.</p>
        </div>

        <h2 className="auth-title">Create Account</h2>
        
        <div className="role-tabs">
          <div 
            className={`role-tab ${formData.role === 'jobseeker' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
          >
            <div className="role-icon">👤</div>
            <div className="role-name">Job Seeker</div>
          </div>
          <div 
            className={`role-tab ${formData.role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'recruiter' })}
          >
            <div className="role-icon">🏢</div>
            <div className="role-name">Recruiter</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (with country code)</label>
            <input 
              type="tel" 
              name="phone"
              className="form-control" 
              placeholder="+1234567890" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
