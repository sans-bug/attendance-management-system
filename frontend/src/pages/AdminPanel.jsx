import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, AlertTriangle, FileText, CheckCircle2, Fingerprint, Plus, Trash2, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/stats'),
        api.get('/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "System Error: Unable to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to terminate this user's access?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      // Refresh stats in case counts changed
      const statsRes = await api.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert("Error deleting user: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const barData = [
    { name: 'M', value: 40 },
    { name: 'T', value: 55 },
    { name: 'W', value: 90 },
    { name: 'T', value: 75 },
    { name: 'F', value: 60 },
    { name: 'S', value: 30 },
    { name: 'S', value: 20 },
  ];

  if (loading) return <div className="text-center py-20 text-textMuted font-mono animate-pulse">ESTABLISHING ENCRYPTED UPLINK...</div>;
  if (error) return (
    <div className="text-center py-20 px-6 animate-fade-in">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Access Resticted</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6">{error}</p>
       <button onClick={fetchData} className="px-6 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-textMain hover:bg-border transition">Retry Connection</button>
    </div>
  );
  if (!stats) return <div className="text-center py-20 text-danger">GATEWAY TIMEOUT.</div>;

  return (
    <div className="py-6 space-y-6 animate-fade-in pb-20">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">Institutional Dashboard</p>
        <h1 className="text-4xl font-bold font-sans tracking-tight leading-none text-textMain pb-2">Attendance <br/>Overview</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-surface/80 border-none shadow-none relative overflow-hidden p-5">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-2">Total Enrolled</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white">{stats.total_students.toLocaleString()}</span>
          </div>
          <div className="w-8 h-8 rounded bg-[#141312] flex items-center justify-center text-primary mt-2">
             <Users size={16} />
          </div>
        </div>
        <div className="card bg-surface/80 border-none shadow-none relative overflow-hidden p-5">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-2">System Health</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-primary">STABLE</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
             <span className="text-[9px] uppercase tracking-widest text-textMuted font-bold">API Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-surface/80 border-none shadow-none">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-6">Today's Statistics</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textMain font-medium">Present</span>
                <span className="text-textMuted">{stats.present_pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#141312] rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${stats.present_pct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textMain font-medium">Absent</span>
                <span className="text-textMuted">{stats.absent_pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#141312] rounded-full overflow-hidden">
                <div className="h-full bg-border" style={{ width: `${stats.absent_pct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center relative py-4">
             <div className="w-24 h-24 rounded-full border-4 border-surface border-t-primary border-r-primary border-l-primary flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <span className="text-xl font-bold">{Math.round(stats.present_pct)}%</span>
             </div>
             <p className="text-[10px] uppercase tracking-widest text-textMuted mt-4 font-bold tracking-[0.2em]">{stats.status}</p>
          </div>
        </div>

        <div className="card bg-surface/80 border-none shadow-none">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold">User Directory</p>
            <span className="text-[10px] text-textMuted font-bold">{filteredUsers.length} Results</span>
          </div>

          <input 
            type="text" 
            placeholder="Search by name, email or role..." 
            className="input-field mb-6 text-xs py-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar pb-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 bg-[#1e1d1c]/50 p-3 rounded-xl border border-border/20 group hover:border-primary/30 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  u.role === 'admin' ? 'bg-primary/20 text-primary' : 
                  u.role === 'teacher' ? 'bg-[#332b22] text-textMain' : 'bg-border text-textMuted'
                }`}>
                  {u.role === 'admin' ? <Shield size={18} /> : 
                   u.role === 'teacher' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                  <p className="text-[10px] text-textMuted uppercase tracking-wider font-medium">{u.role} • {u.email}</p>
                </div>
                <button 
                  onClick={() => deleteUser(u.id)}
                  className="w-8 h-8 rounded-lg bg-danger/10 text-danger opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-danger hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center py-10 text-xs text-textMuted italic">No matches found in directory.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-surface/80 border-none shadow-none">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold">Weekly Engagement</p>
          <div className="flex bg-[#141312] rounded overflow-hidden text-[10px]">
             <span className="px-3 py-1 text-textMuted uppercase tracking-widest text-[8px] font-bold">Projected</span>
          </div>
        </div>
        <div className="h-32 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                 <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                   {barData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 2 ? '#e2c4a9' : '#333230'} />
                   ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden relative p-6 border border-border mt-4" style={{ background: 'linear-gradient(145deg, #1f1e1c 0%, #141312 100%)' }}>
          <h3 className="text-primary font-bold text-lg leading-tight mb-2">Dynamic <br/>Data Processing <br/>Active</h3>
          <p className="text-xs text-textMuted pr-10">System is processing all credentials and records using dynamic string validation for names and roles.</p>
          <div className="absolute top-4 right-4 text-primary opacity-20">
             <Fingerprint size={64} />
          </div>
      </div>
      
      {/* Dynamic Action Button synced with Registration */}
      <button 
        onClick={() => { window.location.href = '/register' }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-2xl shadow-xl flex items-center justify-center text-[#141312] hover:bg-primaryHover transition transform active:scale-95 z-50"
      >
         <Plus size={32} />
      </button>

    </div>
  );
};

export default AdminPanel;
