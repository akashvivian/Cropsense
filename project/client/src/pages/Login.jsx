import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    if (!isValidEmail(formState.email)) newErrors.email = 'Please enter a valid email address';
    if (formState.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const res = await axios.post(`${apiUrl}/api/auth/login`, formState);
      const userData = res.data.user || res.data;
      const safeUser = {
        name: userData.name || userData.username || userData.email || 'User',
        email: userData.email || '',
        id: userData._id || userData.id || ''
      };
      login(res.data.token, safeUser);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
      <style>{`
        .auth-form-card {
          max-width: 420px;
          margin: auto;
          width: 100%;
          padding: 40px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
        .form-group {
          margin-bottom: 16px;
        }
        form { background: white; }
        label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          color: #2e7d32;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #c8e6c9;
          border-radius: 10px;
          background: #ffffff;
          color: #1b5e20;
          font-size: 14px;
          outline: none;
          transition: 0.2s ease;
          box-sizing: border-box;
        }
        input:focus {
          border-color: #2e7d32;
          box-shadow: 0 0 0 2px rgba(46,125,50,0.2);
        }
        input::placeholder {
          color: #9e9e9e;
          font-size: 13px;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        textarea:-webkit-autofill, 
        select:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #1b5e20 !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
        .custom-btn {
          width: 100%;
          padding: 14px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .custom-btn:hover:not(:disabled) {
          background: #1b5e20;
        }
        .custom-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .err-text {
          color: #c62828;
          font-size: 0.85rem;
          margin-top: 4px;
          display: block;
        }
        .toggle-pwd-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #1b5e20;
          padding: 0;
          height: auto;
        }
      `}</style>
      
      <div className="auth-form-card">
        <h2 style={{ textAlign: 'center', color: '#1b5e20', margin: '0 0 24px', fontSize: '1.8rem', fontWeight: 700 }}>Welcome Back</h2>
        {serverError && <div className="error-banner" style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>{serverError}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formState.email}
              onChange={handleChange}
              autoComplete="new-password"
              spellCheck="false"
              placeholder="Enter your registered email"
            />
            {errors.email && <span className="err-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formState.password}
                onChange={handleChange}
                autoComplete="new-password"
                spellCheck="false"
                placeholder="Enter your password"
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="err-text">{errors.password}</span>}
          </div>

          <button type="submit" className="custom-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Log In'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '14px' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#2e7d32', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
