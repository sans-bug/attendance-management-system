import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Save, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('');
  const [statuses, setStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ department: '', year: '' });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.year) params.year = parseInt(filters.year);

      const res = await api.get('/students', { params });
      setStudents(res.data);
      // Initialize statuses
      const initial = {};
      res.data.forEach(s => initial[s.id] = 'Present');
      setStatuses(initial);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "System Error: Unable to sync student ledger.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, status) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    if (!subject) {
      setMessage({ type: 'error', text: 'Please enter a subject name' });
      return;
    }
    try {
      const payload = Object.entries(statuses).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        subject,
        status: status
      }));
      await api.post('/mark-attendance', payload);
      setMessage({ type: 'success', text: 'Attendance submitted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit attendance' });
    }
  };

  const filteredStudents = students.filter(s => 
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: Object.values(statuses).filter(s => s === 'Present').length,
    absent: Object.values(statuses).filter(s => s === 'Absent').length,
    excused: Object.values(statuses).filter(s => s === 'Excused').length,
    total: students.length
  };

  const progress = stats.total > 0 ? Math.round(((stats.present + stats.absent + stats.excused) / stats.total) * 100) : 0;

  if (loading) return <div className="text-center py-20 text-textMuted font-mono animate-pulse uppercase tracking-widest leading-loose">authorizing <br/>biometric roster...</div>;

  if (error) return (
    <div className="text-center py-24 px-6 animate-fade-in">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Access Resticted</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6">{error}</p>
       <button onClick={fetchStudents} className="px-6 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-textMain hover:bg-border transition">Retry Authorization</button>
    </div>
  );

  return (
    <div className="py-6 space-y-6 pb-14 animate-fade-in">
      {/* Subject Input moved up */}
      <div className="card bg-surface/80 border-none space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-2">Target Subject</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Advanced Structural Systems" 
            className="input-field"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
             <label className="block text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-2">Dept.</label>
             <select 
               className="input-field py-2 text-xs"
               value={filters.department}
               onChange={(e) => setFilters({...filters, department: e.target.value})}
             >
                <option value="">All Departments</option>
                <option value="Architecture">Architecture</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
             </select>
          </div>
          <div>
             <label className="block text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-2">Year</label>
             <select 
               className="input-field py-2 text-xs"
               value={filters.year}
               onChange={(e) => setFilters({...filters, year: e.target.value})}
             >
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
             </select>
          </div>
        </div>
      </div>

      {/* Progress Header */}
      <div className="card bg-surface/80 border-none shadow-none relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </div>
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mb-1">Session Progress</p>
            <h2 className="text-2xl font-bold text-white flex items-baseline gap-2">
              {stats.present + stats.absent + stats.excused} of {stats.total} Marked
            </h2>
          </div>
          <div className="text-2xl font-bold text-textMain tracking-tight">{progress}<span className="text-sm text-textMuted">%</span></div>
        </div>
        
        <div className="h-1 w-2/3 bg-border rounded-full overflow-hidden mt-4 mb-4 relative z-10">
           <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex gap-4 text-[9px] uppercase tracking-wider text-textMuted font-semibold relative z-10">
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {stats.present} Present</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accentAbsent"></div> {stats.absent} Absent</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accentExcused"></div> {stats.excused} Excused</span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>
          {message.text}
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search student roster..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-textMain placeholder-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Roster List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-textMuted">Syncing records...</div>
        ) : filteredStudents.map(student => (
          <div key={student.id} className="flex flex-col items-center justify-center p-6 bg-surface/40 border border-border/20 rounded-2xl hover:border-primary/40 transition-all group">
             
             <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-border">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.user.name}&backgroundColor=e2c4a9&textColor=141312`} 
                  alt={student.user.name} 
                  className="w-full h-full object-cover" 
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#141312] translate-x-1/4 translate-y-1/4
                  ${statuses[student.id] === 'Present' ? 'bg-primary' : statuses[student.id] === 'Absent' ? 'bg-accentAbsent' : 'bg-accentExcused'}`} 
                ></div>
             </div>
             
             <div className="text-center">
                <h3 className="font-semibold text-white">{student.user.name}</h3>
                <p className="text-[10px] uppercase text-textMuted tracking-wider mt-0.5 font-medium">{student.department} • Year {student.year}</p>
             </div>
             
             <div className="flex gap-2 w-full justify-center">
                <button 
                  onClick={() => updateStatus(student.id, 'Present')}
                  className={`flex flex-col items-center justify-center w-12 h-10 rounded text-xs gap-1 transition-colors
                    ${statuses[student.id] === 'Present' ? 'bg-primary text-[#141312] font-bold' : 'bg-surface text-textMuted border border-border'}`}
                >
                  <CheckCircle2 size={12} className={statuses[student.id] === 'Present' ? '' : 'opacity-60'} /> P
                </button>
                <button 
                  onClick={() => updateStatus(student.id, 'Absent')}
                  className={`flex flex-col items-center justify-center w-12 h-10 rounded text-xs gap-1 transition-colors
                    ${statuses[student.id] === 'Absent' ? 'bg-accentAbsent text-[#141312] font-bold' : 'bg-surface text-textMuted border border-border'}`}
                >
                  <XCircle size={12} className={statuses[student.id] === 'Absent' ? '' : 'opacity-60'} /> A
                </button>
                <button 
                  onClick={() => updateStatus(student.id, 'Excused')}
                  className={`flex flex-col items-center justify-center w-12 h-10 rounded text-xs gap-1 transition-colors
                    ${statuses[student.id] === 'Excused' ? 'bg-accentExcused text-[#141312] font-bold' : 'bg-surface text-textMuted border border-border'}`}
                >
                  <Clock size={12} className={statuses[student.id] === 'Excused' ? '' : 'opacity-60'} /> E
                </button>
             </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="btn-primary w-full mt-8 flex items-center justify-center gap-2">
         <Save size={16} />
         SUBMIT ATTENDANCE ROSTER
      </button>

    </div>
  );
};

export default TeacherDashboard;
