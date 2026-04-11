import React from 'react';
import { Menu as MenuIcon, Bell as BellIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();
  
  return (
    <header className="flex justify-between items-center py-4 px-4 sm:px-6 bg-[#141312] sticky top-0 z-40 border-b border-border/50">
      <div className="flex items-center gap-4">
        <button className="text-primary hover:text-primaryHover transition">
          <MenuIcon size={24} />
        </button>
        <div className="font-bold text-xl tracking-tight text-textMain flex items-center gap-1">
          Om <span className="text-primary">Attendance</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-textMuted hover:text-textMain transition">
          <BellIcon size={20} />
        </button>
        {user && (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}&backgroundColor=e2c4a9&textColor=141312`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
