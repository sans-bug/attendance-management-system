import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import SideNav from './SideNav';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-[#141312] min-h-screen relative overflow-x-hidden">
      <SideNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:pb-8 pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
