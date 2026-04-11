import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, AlertTriangle, FileText, CheckCircle2, Fingerprint, Plus, Trash2, Shield, GraduationCap, Briefcase, RefreshCw, Activity, BarChart as BarChartIcon, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';

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
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Role Mismatch: Your account does not have Admin privileges in the database.");
      } else {
        setError(err.response?.data?.detail || "System Error: Unable to sync dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to terminate this user's access?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      // Refresh stats
      const statsRes = await api.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert("System Action Failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe Stats Extraction
  const totalStudents = stats?.total_students || 0;
  const presentPct = stats?.present_pct || 0;
  const statusStr = stats?.status || "SYSTEM IDLE";
  const historicalTrend = stats?.historical_trend || [
    { name: 'M', rate: 0 },
    { name: 'T', rate: 0 },
    { name: 'W', rate: 0 },
    { name: 'T', rate: 0 },
    { name: 'F', rate: 0 }
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
       <RefreshCw className="text-primary animate-spin" size={32} />
       <div className="text-textMuted font-mono text-xs uppercase tracking-[0.3em]">Establishing Admin Uplink...</div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 px-6 animate-fade-in">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Access Resticted</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6 leading-relaxed italic opacity-80">{error}</p>
       <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button onClick={fetchData} className="btn-primary py-3 text-[10px] tracking-widest font-bold uppercase transition">Retry Synchronization</button>
          <button onClick={() => window.location.href = '/login'} className="text-textMuted text-[10px] font-bold uppercase hover:text-white transition">Switch to Active Admin Account</button>
       </div>
    </div>
  );

  return (
    <div className="py-6 space-y-6 animate-fade-in pb-20">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Terminal Control</p>
        <h1 className="text-4xl font-bold tracking-tighter leading-none text-textMain pb-2">Global <br/>Intelligence</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-surface/80 border-none p-5 group hover:bg-surface transition-colors">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-2">Total Enrolled</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white">{totalStudents.toLocaleString()}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#141312] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
             <Users size={16} />
          </div>
        </div>
        
        <div className="card bg-surface/80 border-none p-5 group hover:bg-surface transition-colors">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-2">Daily Flux</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white">{presentPct}%</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#141312] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
             <Activity size={16} />
          </div>
        </div>

        <div className="card bg-surface/80 border-none p-5 lg:col-span-2">
           <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-4">Node Connectivity</p>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#e2c4a9]"></div>
                 <span className="text-xs font-bold text-white tracking-widest uppercase">System Operational</span>
              </div>
              <span className="text-[10px] text-primary font-bold px-2 py-1 bg-primary/10 rounded border border-primary/20">HEALTHY</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Analytics */}
        <div className="card bg-surface/80 border-none p-8">
           <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-1">Engagement Matrix</p>
                <h3 className="text-xl font-bold text-white">Weekly Drift</h3>
              </div>
              <BarChartIcon className="text-textMuted opacity-20" size={32} />
           </div>
           
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={historicalTrend}>
                    <Tooltip 
                      cursor={{fill: '#1a1918'}}
                      contentStyle={{backgroundColor: '#141312', border: '1px solid #333', borderRadius: '8px', fontSize: '10px'}}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {historicalTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === historicalTrend.length - 1 ? '#e2c4a9' : '#222'} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-textMuted uppercase tracking-widest border-t border-border/30 pt-4">
              <span>Avg Stability: {presentPct}%</span>
              <span className="text-primary">{statusStr}</span>
           </div>
        </div>

        {/* User Intelligence Roster */}
        <div className="card bg-surface/80 border-none p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Access Directory</h3>
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-widest">{filteredUsers.length} Nodes</span>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter by credentials..." 
              className="w-full bg-[#141312] border border-border/50 rounded-xl pl-12 pr-4 py-3 text-xs text-textMain placeholder-border/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pb-2">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 bg-[#1e1d1c]/30 p-3 rounded-xl border border-border/10 group hover:border-primary/20 transition-all shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  u.role === 'admin' ? 'bg-primary text-[#141312]' : 
                  u.role === 'teacher' ? 'bg-[#333230] text-textMain' : 'bg-border/20 text-textMuted'
                }`}>
                  {u.role === 'admin' ? <Shield size={18} /> : 
                   u.role === 'teacher' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{u.name}</h4>
                  <p className="text-[9px] text-textMuted uppercase tracking-widest font-bold mt-0.5">{u.role} • {u.email}</p>
                </div>
                <button 
                  onClick={() => deleteUser(u.id)}
                  className="w-8 h-8 rounded-lg text-textMuted hover:bg-danger/20 hover:text-danger opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-10">
                 <p className="text-xs text-textMuted italic uppercase tracking-widest font-bold opacity-30">Zero Matches in Roster</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden relative p-8 border border-border/30 mt-4 group" style={{ background: 'linear-gradient(145deg, #1f1e1c 0%, #141312 100%)' }}>
          <div className="relative z-10">
            <h3 className="text-primary font-bold text-2xl tracking-tighter mb-2 group-hover:tracking-normal transition-all duration-500">Om Intelligence <br/>Active Processing</h3>
            <p className="text-xs text-textMuted max-w-md leading-relaxed">Infrastructure-level data synchronization is active. All biometric records and access keys are being processed with dynamic validation protocols.</p>
          </div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-primary opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
             <Fingerprint size={180} />
          </div>
      </div>
      
      {/* Dynamic Action Button synced with Registration */}
      <button 
        onClick={() => { window.location.href = '/register' }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-2xl shadow-2xl flex items-center justify-center text-[#141312] hover:bg-primaryHover transition transform active:scale-90 z-50 shadow-primary/20"
      >
         <Plus size={32} />
      </button>

    </div>
  );
};

export default AdminPanel;
;
