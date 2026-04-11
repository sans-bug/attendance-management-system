import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Fingerprint, User, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const allItems = [
    { to: "/admin", icon: <LayoutDashboard size={24} />, label: "DASHBOARD", roles: ['admin'] },
    { to: "/cloud", icon: <Cloud size={24} />, label: "CLOUD", roles: ['student', 'teacher', 'admin'] },
    { to: "/teacher", icon: <Fingerprint size={24} />, label: "MARK", roles: ['teacher', 'admin'] },
    { to: "/student", icon: <LayoutDashboard size={24} />, label: "DASHBOARD", roles: ['student'] },
    { to: "/schedule", icon: <CalendarDays size={24} />, label: "SCHEDULE", roles: ['student', 'teacher', 'admin'] },
    { to: "/profile", icon: <User size={24} />, label: "PROFILE", roles: ['student', 'teacher', 'admin'] },
  ];

  const navItems = allItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#141312] border-t border-border z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive 
                  ? 'text-primary bg-surface/50 rounded-lg mx-1 my-1' 
                  : 'text-textMuted hover:text-textMain'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1 tracking-wider uppercase">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
