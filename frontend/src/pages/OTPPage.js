import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const phone = location.state?.phone;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Invalid session. Please register again.');
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOTP({ email, phone, otp: otp.join('') });
      toast.success('Identity verified successfully! You can now login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <div className="auth-logo">⚡ JobPortal</div>
          <p className="auth-tagline">
            We've sent a 6-digit code to <strong>{phone || email || 'your device'}</strong>
          </p>
        </div>

        <h2 className="auth-title text-center">Verify Identity</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input 
                key={i}
                type="text" 
                className="otp-digit" 
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, i)}
                required
              />
            ))}
          </div>


          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-8">
          Didn't receive the code? <button className="btn btn-ghost btn-sm" style={{ padding: 0, color: 'var(--accent)' }}>Resend Code</button>
        </p>
      </div>
    </div>
  );
}
