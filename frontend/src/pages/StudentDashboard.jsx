import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis } from 'recharts';
import { BookOpen, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/get-attendance');
      setAttendance(res.data);
      
      const subjMap = {};
      res.data.forEach(r => {
        if (!subjMap[r.subject]) {
          subjMap[r.subject] = { present: 0, total: 0 };
        }
        subjMap[r.subject].total += 1;
        if (r.status === 'Present') {
          subjMap[r.subject].present += 1;
        }
      });
      
      const sums = Object.keys(subjMap).map(subj => ({
        subject: subj,
        present: subjMap[subj].present,
        total: subjMap[subj].total,
        percentage: Math.round((subjMap[subj].present / subjMap[subj].total) * 100)
      }));
      setSummary(sums);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "System Error: Unable to fetch attendance portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const overallAttendance = summary.length > 0 
    ? Math.round(summary.reduce((acc, curr) => acc + curr.percentage, 0) / summary.length) 
    : 0;

  if (loading) return <div className="text-center py-20 text-textMuted font-mono animate-pulse uppercase tracking-widest">establishing secure link...</div>;

  if (error) return (
    <div className="text-center py-24 px-6 animate-fade-in">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Access Resticted</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6">{error}</p>
       <button onClick={fetchAttendance} className="px-6 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-textMain hover:bg-border transition">Retry Uplink</button>
    </div>
  );

  return (
    <div className="py-6 space-y-6 pb-20 animate-fade-in">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">Student Portfolio</p>
        <h1 className="text-4xl font-bold font-sans tracking-tight leading-none text-textMain pb-2">Academic <br/>Performance</h1>
      </div>

      {/* Hero Stats */}
      <div className="card bg-surface/80 border-none shadow-none relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 p-6">
          <TrendingUp size={64} />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-2">Overall Attendance</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold tracking-tight text-white">{overallAttendance}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#141312] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary" style={{ width: `${overallAttendance}%` }}></div>
        </div>
      </div>

      {/* Grid for small summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="card bg-surface/80 border-none p-4">
            <BookOpen size={16} className="text-primary mb-2" />
            <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold">Subjects</p>
            <p className="text-xl font-bold text-white">{summary.length}</p>
         </div>
         <div className="card bg-surface/80 border-none p-4">
            <Calendar size={16} className="text-textMain mb-2" />
            <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold">Total Sessions</p>
            <p className="text-xl font-bold text-white">{attendance.length}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-surface/80 border-none shadow-none">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-6">Subject Breakdown</p>
          <div className="space-y-6">
            {summary.map((s, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">{s.subject}</h4>
                    <p className="text-[10px] text-textMuted mt-1">{s.present} of {s.total} sessions attended</p>
                  </div>
                  <span className={`text-xs font-bold ${s.percentage < 75 ? 'text-danger' : 'text-primary'}`}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-1 w-full bg-[#141312] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${s.percentage < 75 ? 'bg-danger' : 'bg-primary'}`} 
                    style={{ width: `${s.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {summary.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle size={32} className="text-border mb-2" />
                <p className="text-xs text-textMuted italic">No subject data found yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-surface/80 border-none shadow-none">
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-6">Recent Records</p>
          <div className="space-y-4">
            {attendance.slice(0, 5).map((rec, idx) => (
              <div key={idx} className="flex items-center gap-4 py-1 border-b border-border/30 last:border-0 pb-3 mb-1">
                <div className={`w-2 h-2 rounded-full ${rec.status === 'Present' ? 'bg-primary shadow-[0_0_8px_rgba(226,196,169,0.3)]' : 'bg-border'}`}></div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-white">{rec.subject}</h5>
                  <p className="text-[10px] text-textMuted">{new Date(rec.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${rec.status === 'Present' ? 'text-primary' : 'text-textMuted opacity-50'}`}>
                  {rec.status}
                </span>
              </div>
            ))}
            {attendance.length === 0 && (
               <p className="text-xs text-textMuted text-center py-4">Waiting for initial attendance data.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," 
              + "Subject,Present,Total,Percentage\n"
              + summary.map(e => `${e.subject},${e.present},${e.total},${e.percentage}%`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `attendance_report_${user.name}.csv`);
            document.body.appendChild(link);
            link.click();
          }}
          className="flex-1 bg-surface border border-border py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold text-textMain hover:bg-border transition active:scale-95"
        >
          Export Analytics (.CSV)
        </button>
      </div>

      <div className="rounded-xl overflow-hidden relative p-6 border border-border mt-4" style={{ background: 'linear-gradient(145deg, #1f1e1c 0%, #141312 100%)' }}>
          <h3 className="text-primary font-bold text-lg leading-tight mb-2">Automated <br/>Record Keeping</h3>
          <p className="text-xs text-textMuted pr-10">Your attendance is updated in real-time by your subject teachers through the Om Automatic Attendance portal.</p>
      </div>

    </div>
  );
};

export default StudentDashboard;
