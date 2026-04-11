import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, GraduationCap } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: '',
    subject: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const cleanData = { ...formData };
      
      // Intensive Data Cleaning for Pydantic
      if (!cleanData.year || cleanData.year === '') delete cleanData.year;
      else cleanData.year = parseInt(cleanData.year);

      if (!cleanData.department || cleanData.department === '') delete cleanData.department;
      if (!cleanData.subject || cleanData.subject === '') delete cleanData.subject;

      // 1. Register
      await api.post('/register', cleanData);
      
      // 2. Auto-Login
      const role = await login(formData.email, formData.password);
      
      // 3. Navigate
      if (role === 'admin') navigate('/admin');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
      
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      setError(message || err.message || 'Registration failed. Check if email exists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const roles = [
    { id: 'student', label: 'Student', icon: <GraduationCap size={18} /> },
    { id: 'teacher', label: 'Teacher', icon: <User size={18} /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-10">
      <div className="card w-full max-w-lg">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-white mb-2">Initialize Account</h2>
           <p className="text-xs text-textMuted uppercase tracking-[0.2em] font-bold">Select your infrastructure role</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-xs mb-6 animate-shake">
          {error}
        </div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setFormData({ ...formData, role: r.id })}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2
                  ${formData.role === r.id 
                    ? 'bg-primary border-primary text-[#141312] shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-[#141312] border-border/50 text-textMuted hover:border-primary/30'}`}
              >
                {r.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{r.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Full Identity</label>
                <input name="name" type="text" className="input-field" placeholder="Full Name" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Uplink Email</label>
                <input name="email" type="email" className="input-field" placeholder="email@address.com" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Secure Passkey</label>
                <input name="password" type="password" className="input-field" placeholder="••••••••" onChange={handleChange} required />
              </div>
            </div>

            {/* Dynamic Role Fields */}
            <div className="pt-2 animate-fade-in" key={formData.role}>
               {formData.role === 'student' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Department</label>
                      <input name="department" type="text" className="input-field" placeholder="e.g. CS" onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Current Year</label>
                      <input name="year" type="number" className="input-field" placeholder="2024" onChange={handleChange} required />
                    </div>
                 </div>
               )}
               {formData.role === 'teacher' && (
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-textMuted mb-2 ml-1">Core Subject</label>
                    <input name="subject" type="text" className="input-field" placeholder="e.g. Applied Physics" onChange={handleChange} required />
                 </div>
               )}
               {formData.role === 'admin' && (
                 <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider text-center">Admin Node: Root Privileges will be assigned</p>
                 </div>
               )}
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary w-full py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] font-bold ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#141312]/30 border-t-[#141312] rounded-full animate-spin"></div>
                Initializing...
              </>
            ) : (
              <>
                COMPLETE REGISTRATION
              </>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-textMuted">
          Account already active? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
