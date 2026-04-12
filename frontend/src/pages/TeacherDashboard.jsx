import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Save, AlertTriangle, TrendingUp, BarChart as BarChartIcon, Activity } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [subject, setSubject] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [statuses, setStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ historical_trend: [], distribution: [], present_pct: 0, total_students: 0 });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ department: '', year: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [filters, subject, selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes/my');
      const classData = Array.isArray(res.data) ? res.data : [];
      setClasses(classData);
      if (classData.length > 0 && !selectedClassId) {
        setSelectedClassId(classData[0].id);
      }
    } catch (err) {
      console.error('Failed to load teacher classes:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedClassId) {
        if (subject) params.subject = subject;
        const res = await api.get(`/classes/${selectedClassId}/students`, { params });
        const studentData = Array.isArray(res.data) ? res.data : [];
        setStudents(studentData);
        const initial = {};
        studentData.forEach(s => initial[s.id] = s.attendance_status || 'Present');
        setStatuses(initial);
      } else {
        if (filters.department) params.department = filters.department;
        if (filters.year) params.year = parseInt(filters.year);
        if (subject) params.subject = subject;
        const res = await api.get('/students', { params });
        const studentData = Array.isArray(res.data) ? res.data : [];
        setStudents(studentData);
        const initial = {};
        studentData.forEach(s => initial[s.id] = s.attendance_status || 'Present');
        setStatuses(initial);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "System Error: Unable to sync student ledger.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats', { params: { subject } });
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  const updateStatus = (id, status) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    if (!subject && !subjectInput) {
      setMessage({ type: 'error', text: 'Please enter a subject name' });
      return;
    }
    const effectiveSubject = subject || subjectInput;
    try {
      const payload = Object.entries(statuses).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        subject: effectiveSubject,
        status: status
      }));
      await api.post('/mark-attendance', payload);
      setMessage({ type: 'success', text: 'Attendance submitted successfully!' });
      await fetchStudents();
      fetchStats(); // Refresh stats after submission
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit attendance' });
    }
  };

  const filteredStudents = students.filter(s => 
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSessionStats = {
    present: Object.values(statuses).filter(s => s === 'Present').length,
    absent: Object.values(statuses).filter(s => s === 'Absent').length,
    excused: Object.values(statuses).filter(s => s === 'Excused').length,
    total: students.length
  };

  if (loading && students.length === 0) return <div className="text-center py-20 text-textMuted font-mono animate-pulse uppercase tracking-widest leading-loose">authorizing <br/>biometric roster...</div>;

  return (
    <div className="py-6 space-y-8 pb-14 animate-fade-in">
      
      {/* KPI & Analytics Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Attendance Flux */}
        <div className="lg:col-span-2 card bg-surface/80 border-none p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Attendance Flux</p>
              <h3 className="text-xl font-bold text-white">Historical Trends</h3>
            </div>
            <TrendingUp className="text-primary opacity-50" size={20} />
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.historical_trend}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2c4a9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e2c4a9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10}} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1a1918', border: '1px solid #333', borderRadius: '8px', fontSize: '10px'}}
                  itemStyle={{color: '#e2c4a9'}}
                />
                <Area type="monotone" dataKey="rate" stroke="#e2c4a9" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric 2: Session Distribution */}
        <div className="card bg-surface/80 border-none p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-1">Session Split</p>
              <h3 className="text-xl font-bold text-white">Subject Reach</h3>
            </div>
            <Activity className="text-textMuted opacity-50" size={20} />
          </div>

          <div className="h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution.length > 0 ? stats.distribution : [{name: 'Empty', value: 100}]}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  {stats.distribution.length === 0 && <Cell fill="#222" />}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{stats.present_pct}%</span>
                <span className="text-[8px] uppercase tracking-wider text-textMuted font-bold">Present</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
             <div className="bg-[#141312] p-2 rounded-lg border border-border/30">
                <p className="text-[8px] uppercase text-textMuted font-bold">Roster Size</p>
                <p className="text-sm font-bold text-white">{stats.total_students}</p>
             </div>
             <div className="bg-[#141312] p-2 rounded-lg border border-border/30">
                <p className="text-[8px] uppercase text-textMuted font-bold">Status</p>
                <p className={`text-[9px] font-bold ${stats.status === 'OPTIMAL' ? 'text-primary' : 'text-danger'}`}>{stats.status}</p>
             </div>
          </div>
        </div>

      </div>

      {/* Controls & Subject Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <div className="card bg-surface/80 border-none space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-textMuted font-bold mb-3 ml-1">Class Roster</label>
              <select
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(e.target.value ? parseInt(e.target.value) : null)}
                className="input-field"
              >
                <option value="">All Students</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-textMuted font-bold mb-3 ml-1">Current Subject</label>
              <input 
                type="text" 
                value={subjectInput} 
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="e.g. Design Studio IV" 
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setSubject(subjectInput.trim())}
                className="btn-secondary w-full py-3 mt-3 text-[10px] tracking-[0.2em]"
              >
                APPLY SUBJECT
              </button>
            </div>
            
            <div className="space-y-4 pt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold border-b border-border/50 pb-2">Filter Roster</p>
              <div className="grid grid-cols-1 gap-4">
                <select 
                  className="input-field py-3"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <option value="">All Departments</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                </select>
                <select 
                  className="input-field py-3"
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                >
                  <option value="">All Academic Years</option>
                  {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em]">
              <Save size={16} />
              COMMIT ROSTER
            </button>

            {message && (
              <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest leading-relaxed ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                {message.text}
              </div>
            )}
          </div>
          
          <div className="card bg-primary/5 border-primary/20 p-6">
             <div className="flex items-center gap-3 mb-4 text-primary">
                <Activity size={20} />
                <h4 className="font-bold text-sm">Session Intel</h4>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-textMuted">Marked Today</span>
                   <span className="text-white font-mono">{currentSessionStats.present + currentSessionStats.absent + currentSessionStats.excused}</span>
                </div>
                <div className="h-1 w-full bg-[#141312] rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${( (currentSessionStats.present + currentSessionStats.absent + currentSessionStats.excused) / (students.length || 1) ) * 100}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <div className="rounded-xl bg-[#0b2f16] text-success p-2 text-center">Present {currentSessionStats.present}</div>
                  <div className="rounded-xl bg-[#2f0b0b] text-danger p-2 text-center">Absent {currentSessionStats.absent}</div>
                  <div className="rounded-xl bg-[#1f1f1f] text-textMuted p-2 text-center">Excused {currentSessionStats.excused}</div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search biometric roster..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface/80 border border-border/50 rounded-2xl pl-12 pr-4 py-4 text-sm text-textMain placeholder-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div key={student.id} className="flex flex-col items-center justify-center p-6 bg-surface/40 border border-border/20 rounded-2xl hover:border-primary/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <BarChartIcon size={12} className="text-primary" />
                </div>
                
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#141312] border border-border/50 mb-4 transition-transform group-hover:scale-105 duration-300">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.user.name}&backgroundColor=e2c4a9&textColor=141312`} 
                    alt={student.user.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-4 border-[#141312] translate-x-1/4 translate-y-1/4
                    ${statuses[student.id] === 'Present' ? 'bg-primary' : statuses[student.id] === 'Absent' ? 'bg-danger' : 'bg-textMuted'}`} 
                  ></div>
                </div>
                
                <div className="text-center mb-3 space-y-2">
                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{student.user.name}</h3>
                  <p className="text-[10px] uppercase text-textMuted tracking-wider font-bold">{student.department} • YEAR {student.year}</p>
                  <div className="text-[10px] text-textMuted uppercase tracking-[0.14em] font-bold flex items-center justify-center gap-2">
                    <span className="text-success">P {student.present_count}</span>
                    <span className="text-danger">A {student.absent_count}</span>
                    <span className="text-textMuted">E {student.excused_count}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full">
                  {['Present', 'Absent', 'Excused'].map((stat) => (
                    <button 
                      key={stat}
                      onClick={() => updateStatus(student.id, stat)}
                      className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all
                        ${statuses[student.id] === stat 
                          ? 'bg-primary text-[#141312] shadow-lg shadow-primary/10 scale-105 z-10' 
                          : 'bg-[#141312] text-textMuted border border-border/50 hover:bg-border/30'}`}
                    >
                      {stat[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
               <AlertTriangle size={48} className="mx-auto text-border mb-4" />
               <p className="text-textMuted font-bold uppercase tracking-widest text-xs">No matching biometric records found</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;
