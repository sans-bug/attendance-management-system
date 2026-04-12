import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    TrendingUp, Calendar, BookOpen, AlertCircle, RefreshCw, 
    Award, Clock, Download, ChevronRight, Activity, Shield
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/stats/me');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Intelligience link failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#e2c4a9', '#8c7e6d', '#5c5449', '#3d3831'];

  if (loading || !stats) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
       <RefreshCw className="text-primary animate-spin" size={32} />
       <div className="text-textMuted font-mono text-[10px] uppercase tracking-[0.3em]">Establishing Identity Uplink...</div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 px-6 animate-fade-in">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6 leading-relaxed italic opacity-80">{error}</p>
       <button onClick={fetchStats} className="btn-primary py-3 px-8 text-[10px] tracking-widest font-bold uppercase transition">Retry Synchronization</button>
    </div>
  );

  const { historical_trend = [], distribution = [], summary = { overall_pct: 0, present_sessions: 0, total_sessions: 0 } } = stats;

  return (
    <div className="py-6 space-y-8 pb-24 animate-fade-in lg:px-6">
      
      {/* Personalized Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Identity Profile</p>
          <h1 className="text-4xl font-bold tracking-tighter leading-none text-textMain">{(user?.name || 'My').split(' ')[0]}'s <br/>Performance</h1>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-surface/50 border border-border/20 p-2 rounded-2xl">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award size={20} />
           </div>
           <div>
              <p className="text-[8px] uppercase tracking-widest text-textMuted font-bold">Rank Tier</p>
              <p className="text-xs font-bold text-white uppercase">Vanguard Elite</p>
           </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overall Attendance Card */}
        <div className="card bg-surface/80 border-none p-8 flex flex-col justify-between group hover:bg-surface transition-all overflow-hidden relative">
          <div className="absolute right-[-10%] bottom-[-10%] opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Activity size={160} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-4">Engagement Rate</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-black tracking-tighter text-white">{summary.overall_pct}%</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Active</span>
            </div>
            <div className="h-2 w-full bg-[#141312] rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${summary.overall_pct}%` }}></div>
            </div>
          </div>
        </div>

        {/* Total Sessions Card */}
        <div className="card bg-surface/80 border-none p-8 flex flex-col justify-between group hover:bg-surface transition-all">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-6">Aggregate Sessions</p>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-bold text-white mb-1">{summary.present_sessions}</p>
                  <p className="text-[9px] uppercase tracking-widest text-primary font-bold">Attended</p>
               </div>
               <div>
                  <p className="text-sm font-bold text-white mb-1">{summary.total_sessions}</p>
                  <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold">Scheduled</p>
               </div>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
             <div className="p-2 bg-[#141312] rounded-lg text-primary"><Calendar size={16} /></div>
             <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Database Sync: Real-time</p>
          </div>
        </div>

        {/* Subject Count Card */}
        <div className="card bg-surface/80 border-none p-8 flex flex-col justify-between group hover:bg-surface transition-all lg:col-span-1 md:col-span-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-6">Curriculum Density</p>
            <p className="text-4xl font-bold text-white">{distribution.length} <span className="text-lg text-textMuted font-normal tracking-tight ml-2">Active Subjects</span></p>
          </div>
          <button className="mt-8 flex items-center justify-between w-full bg-[#141312] p-4 rounded-xl group-hover:bg-[#1a1918] transition-colors">
             <span className="text-[10px] uppercase tracking-widest font-bold text-textMuted">View Curriculum Info</span>
             <ChevronRight size={14} className="text-primary" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Flux Graph */}
        <div className="card bg-surface/80 border-none p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Attendance Flux</h3>
            <div className="p-2 bg-[#141312] rounded-lg text-primary"><TrendingUp size={16} /></div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historical_trend}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2c4a9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e2c4a9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2d2b2a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#8c7e6d', fontSize: 10}}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#141312', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}}
                  itemStyle={{color: '#e2c4a9'}}
                />
                <Area type="monotone" dataKey="rate" stroke="#e2c4a9" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Breakdown */}
        <div className="card bg-surface/80 border-none p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Subject Matrix</h3>
            <div className="p-2 bg-[#141312] rounded-lg text-primary"><BookOpen size={16} /></div>
          </div>
          <div className="space-y-6 max-h-64 overflow-y-auto no-scrollbar pr-2">
            {distribution.map((s, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{s.subject}</h4>
                  <span className={`text-xs font-black ${s.percentage < 75 ? 'text-danger' : 'text-primary'}`}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#141312] rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${s.percentage < 75 ? 'bg-danger/80' : 'bg-primary'}`} 
                     style={{ width: `${s.percentage}%` }}
                   ></div>
                </div>
                <p className="text-[9px] text-textMuted uppercase tracking-widest font-bold mt-2 opacity-60">
                   {s.present} of {s.total} Sessions Logged
                </p>
              </div>
            ))}
            {distribution.length === 0 && (
               <div className="flex flex-col items-center py-12 text-center opacity-40">
                  <Clock size={32} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting First Entry</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button 
           onClick={() => {
             const csvContent = "data:text/csv;charset=utf-8," 
               + "Subject,Attended,Total,Percentage\n"
               + distribution.map(e => `${e.subject},${e.present},${e.total},${e.percentage}%`).join("\n");
             const encodedUri = encodeURI(csvContent);
             const link = document.createElement("a");
             link.setAttribute("href", encodedUri);
             link.setAttribute("download", `Om_Analytics_${(user?.name || 'Student').replace(' ', '_')}.csv`);
             document.body.appendChild(link);
             link.click();
           }}
           className="w-full bg-surface border border-border/40 py-4 rounded-2xl flex items-center justify-center gap-3 group hover:bg-border transition-all active:scale-95"
         >
            <Download size={16} className="text-primary group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-textMain">Export Portfolio (.CSV)</span>
         </button>
         
         <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
               <Shield size={18} />
            </div>
            <p className="text-[10px] text-textMuted font-medium leading-relaxed uppercase tracking-tighter">
               Your biometric data and records are protected by <span className="text-white font-bold">Om Identity Encryption</span>.
            </p>
         </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
