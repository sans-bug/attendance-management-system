import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const role = await login(email, password);
      // Route based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Network issue: unable to reach the backend. Start the backend server or set VITE_API_URL correctly.');
      } else {
        const detail = err.response?.data?.detail;
        setError(detail || 'Authorization Failed: Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="card w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
           <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">Welcome Back</h2>
           <p className="text-[10px] uppercase tracking-[0.3em] text-textMuted font-bold">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-textMuted mb-2 ml-1">Identity Uplink (Email)</label>
            <input 
              type="email" 
              className="input-field py-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. director@system.com"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-textMuted mb-2 ml-1">Secure Passkey</label>
            <input 
              type="password" 
              className="input-field py-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary w-full py-5 text-xs tracking-[0.3em] font-bold uppercase transition-all
              ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Establish Link'}
          </button>
        </form>
        
        <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-textMuted font-medium">
          New Node? <Link to="/register" className="text-primary font-bold hover:underline">Register Identity</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
