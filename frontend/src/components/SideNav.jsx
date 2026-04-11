import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Fingerprint, User, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SideNav = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const allItems = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", roles: ['admin'] },
    { to: "/cloud", icon: <Cloud size={20} />, label: "Cloud Core", roles: ['student', 'teacher', 'admin'] },
    { to: "/teacher", icon: <Fingerprint size={20} />, label: "Attendance Roster", roles: ['teacher', 'admin'] },
    { to: "/student", icon: <LayoutDashboard size={20} />, label: "Academic Portfolio", roles: ['student'] },
    { to: "/schedule", icon: <CalendarDays size={20} />, label: "Schedule", roles: ['student', 'teacher', 'admin'] },
    { to: "/profile", icon: <User size={20} />, label: "Profile Settings", roles: ['student', 'teacher', 'admin'] },
  ];

  const navItems = allItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface border-r border-border p-6 gap-8 shrink-0">
      <div className="px-2">
         <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-1">Infrastructure</p>
         <h2 className="text-xl font-bold text-white tracking-tight">Om <span className="text-primary">Attendance</span></h2>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-[#141312] font-bold shadow-lg shadow-primary/10' 
                  : 'text-textMuted hover:text-textMain hover:bg-border/30'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-[#141312] rounded-xl border border-border/50">
         <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mb-1">System Status</p>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] text-primary font-bold">Uplink Stable</span>
         </div>
      </div>
    </aside>
  );
};

export default SideNav;
