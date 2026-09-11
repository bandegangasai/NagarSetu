import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Search, Compass, UserCheck, HardHat, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { isCitizen, isOfficer, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const itemClass = (path: string) => `
    flex flex-col items-center justify-center py-2 px-1 text-[11px] font-medium transition-colors
    ${isActive(path) ? 'text-civic-600 font-bold' : 'text-slate-500 hover:text-slate-900'}
  `;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 shadow-lg px-2 pb-safe">
      <div className="grid grid-cols-5 items-center">
        <Link to="/" className={itemClass('/')}>
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link to="/track" className={itemClass('/track')}>
          <Search className="w-5 h-5 mb-0.5" />
          <span>Track</span>
        </Link>

        <Link to="/submit" className="flex flex-col items-center justify-center -mt-4 group">
          <div className="w-12 h-12 rounded-full bg-civic-600 text-white flex items-center justify-center shadow-lg shadow-civic-600/30 group-hover:scale-105 transition-transform ring-4 ring-white">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-civic-700 mt-0.5">Report</span>
        </Link>

        <Link to="/map" className={itemClass('/map')}>
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Map</span>
        </Link>

        {isCitizen && (
          <Link to="/citizen" className={itemClass('/citizen')}>
            <UserCheck className="w-5 h-5 mb-0.5 text-emerald-600" />
            <span>My Issues</span>
          </Link>
        )}

        {isOfficer && (
          <Link to="/officer" className={itemClass('/officer')}>
            <HardHat className="w-5 h-5 mb-0.5 text-amber-600" />
            <span>Tasks</span>
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" className={itemClass('/admin')}>
            <ShieldCheck className="w-5 h-5 mb-0.5 text-purple-600" />
            <span>Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};
