import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean data: remove empty strings for optional fields and convert year to number
      const cleanData = { ...formData };
      
      if (cleanData.year === '') {
        delete cleanData.year;
      } else {
        cleanData.year = parseInt(cleanData.year);
      }
      
      if (cleanData.department === '') delete cleanData.department;
      if (cleanData.subject === '') delete cleanData.subject;

      await api.post('/register', cleanData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-10">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h2>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Name</label>
            <input name="name" type="text" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
            <input name="email" type="email" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
            <input name="password" type="password" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Role</label>
            <select name="role" className="input-field" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {formData.role === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Department</label>
                <input name="department" type="text" className="input-field" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Year</label>
                <input name="year" type="number" className="input-field" onChange={handleChange} required />
              </div>
            </div>
          )}

          {formData.role === 'teacher' && (
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Subject</label>
              <input name="subject" type="text" className="input-field" onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-6">Register</button>
        </form>
        <p className="mt-4 text-center text-sm text-textMuted">
          Already have an account? <Link to="/login" className="text-primary hover:text-primaryHover">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
