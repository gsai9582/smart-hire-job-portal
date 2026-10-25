import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo">⚡ JobPortal</div>
          <p className="auth-tagline">Enter your email to receive a password reset link.</p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h2 className="auth-title">Check Your Email</h2>
            <p className="text-muted">We have sent instructions to reset your password to {email}.</p>
            <button className="btn btn-secondary w-full mt-8" onClick={() => setSent(false)}>Try another email</button>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-muted mt-8">
          Remember your password? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
