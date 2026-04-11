import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, Bell, Globe, Moon, Database, LogOut, ChevronRight, User as UserIcon, Save, Edit3, X } from 'lucide-react';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
     name: user?.name || '',
     department: user?.department || '',
     year: user?.year || '',
     subject: user?.subject || ''
  });
  const [saving, setSaving] = useState(false);
  
  if (!user) return <div className="text-center py-20 text-textMuted font-mono animate-pulse">ESTABLISHING SECURE CONNECTION...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...formData };
      if (payload.year) payload.year = parseInt(payload.year);
      
      const res = await api.put('/users/me', payload);
      setUser(prev => ({ ...prev, ...res.data }));
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const displayData = {
     name: user.name || "System User",
     role: user.role?.toUpperCase() || "ACCESS MEMBER",
     id: `VT-${user.id || '0000'}-${user.role?.[0]?.toUpperCase() || 'U'}`,
     joined: "JAN 2024",
     avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}&backgroundColor=e2c4a9&textColor=141312`
  };

  return (
    <div className="py-6 space-y-6 pb-20 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="bg-surface rounded-xl p-4 flex justify-center items-center relative border border-border">
         <div className="w-full h-48 bg-[#1e1d1c] rounded-lg flex items-center justify-center overflow-hidden">
             <img src={displayData.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-primary/20 shadow-2xl" />
         </div>
         <button 
           onClick={() => isEditing ? handleSave() : setIsEditing(true)}
           disabled={saving}
           className={`absolute -bottom-4 right-4 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95
             ${isEditing ? 'bg-primary text-[#141312]' : 'bg-surface border border-border text-textMuted'}`}
         >
            {saving ? <div className="w-4 h-4 border-2 border-[#141312] border-t-transparent rounded-full animate-spin"></div> : 
             isEditing ? <Save size={20} /> : <Edit3 size={20} />}
         </button>
         {isEditing && (
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute -bottom-4 right-20 w-12 h-12 bg-surface border border-border rounded-xl shadow-lg flex items-center justify-center text-danger transition-all active:scale-95"
            >
               <X size={20} />
            </button>
         )}
      </div>

      <div className="pt-2">
         <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2">{displayData.role}</p>
         
         {isEditing ? (
            <input 
               className="text-3xl font-bold bg-transparent border-b border-primary/30 w-full text-white tracking-tight mb-6 focus:outline-none focus:border-primary"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
               placeholder="Enter Name"
            />
         ) : (
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">{displayData.name}</h1>
         )}
         
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-3">
               <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mb-1">Account ID</p>
               <p className="text-sm font-semibold text-white tracking-wider">{displayData.id}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-3">
               <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mb-1">Status</p>
               <p className="text-sm font-semibold text-primary tracking-wider">ACTIVE</p>
            </div>
         </div>
      </div>

      {/* Conditionally reveal more edit fields */}
      {isEditing && (
         <div className="card bg-surface/50 border-primary/20 space-y-4 animate-slide-up">
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Profile Credentials</p>
            {user.role === 'student' ? (
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[9px] text-textMuted uppercase block mb-1">Dept</label>
                     <input className="input-field text-xs py-2" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-[9px] text-textMuted uppercase block mb-1">Year</label>
                     <input type="number" className="input-field text-xs py-2" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                  </div>
               </div>
            ) : user.role === 'teacher' ? (
               <div>
                  <label className="text-[9px] text-textMuted uppercase block mb-1">Assigned Subject</label>
                  <input className="input-field text-xs py-2" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
               </div>
            ) : null}
         </div>
      )}

      {/* Main Settings Blocks */}
      <div className="space-y-4 pt-4">
         
         {/* Identity Card */}
         <div className="card bg-surface/80 p-5 group cursor-pointer hover:bg-surface border-border">
            <div className="flex justify-between items-start mb-3">
               <div className="w-8 h-8 rounded bg-[#332b22] text-[#e2c4a9] flex items-center justify-center">
                  <UserIcon size={16} />
               </div>
               <div className="text-textMuted"><ChevronRight size={18} /></div>
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">Identity Details</h3>
            <p className="text-xs text-textMuted leading-relaxed">{user.email}</p>
         </div>

         {/* Security Card */}
         <div className="card bg-surface/80 p-5 group cursor-pointer hover:bg-surface border-border">
            <div className="flex justify-between items-start mb-3">
               <div className="w-8 h-8 rounded bg-border text-textMuted flex items-center justify-center">
                  <ShieldCheck size={16} />
               </div>
               <span className="text-[9px] uppercase tracking-widest font-bold bg-primary text-[#141312] px-2 py-0.5 rounded-sm">Verified</span>
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">System Permissions</h3>
            <p className="text-xs text-textMuted leading-relaxed">Level 4 Clearance - Authorized for subject {user.role === 'teacher' ? (user.subject || 'All') : 'attendance'}.</p>
         </div>

      </div>

      {/* Preferences List */}
      <div className="pt-4">
         <h4 className="font-bold text-white mb-4 text-lg">Preferences</h4>
         
         <div className="bg-surface border border-border rounded-xl divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group">
               <div className="flex items-center gap-4">
                  <Globe size={18} className="text-textMuted" />
                  <div>
                     <p className="text-sm font-semibold text-white">Interface Locale</p>
                     <p className="text-xs text-textMuted mt-0.5">English (Automatic)</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-textMuted group-hover:text-white transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group">
               <div className="flex items-center gap-4">
                  <Moon size={18} className="text-textMuted" />
                  <div>
                     <p className="text-sm font-semibold text-white">Dynamic Theme</p>
                     <p className="text-xs text-textMuted mt-0.5">Om Onyx (Stable)</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-textMuted group-hover:text-white transition-colors" />
            </button>
         </div>
      </div>

      {/* Terminate Session */}
      <button onClick={logout} className="w-full py-4 bg-surface border border-border rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors mt-6">
         <LogOut size={16} /> Terminate Session
      </button>

      <p className="text-center text-[9px] uppercase tracking-widest text-textMuted font-semibold mt-8 pb-4">
         Build 2.4.1 • {new Date().getFullYear()} Om Automatic Attendance
      </p>

    </div>
  );
};

export default Profile;
