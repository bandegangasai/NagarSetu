import React from 'react';
import { Outlet } from 'react-router-dom';
import { DemoBar } from '../common/DemoBar';
import { EmergencyBanner } from '../common/EmergencyBanner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <DemoBar />
      <EmergencyBanner />
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
