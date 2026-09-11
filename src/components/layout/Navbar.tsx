import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  BarChart3,
  Search,
  PlusCircle,
  Menu,
  X,
  UserCheck,
  HardHat,
  Compass,
  Zap,
  ZapOff
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { NotificationPopover } from '../notifications/NotificationPopover';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isCitizen, isOfficer, isAdmin } = useAuth();
  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    return localStorage.getItem('nagarsetu_data_saver') === 'true';
  });

  const toggleDataSaver = () => {
    const next = !dataSaver;
    setDataSaver(next);
    localStorage.setItem('nagarsetu_data_saver', String(next));
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => `
    px-3 py-2 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5
    ${
      isActive(path)
        ? 'bg-civic-50 text-civic-800 border border-civic-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }
  `;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-7 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-civic-700 via-civic-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-civic-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Nagar<span className="text-civic-600">Setu</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-1 hidden sm:block">
                Citizen Civic Accountability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>
              {t('nav.home')}
            </Link>
            <Link to="/track" className={linkClass('/track')}>
              <Search className="w-4 h-4 text-slate-500" />
              {t('nav.track')}
            </Link>
            <Link to="/map" className={linkClass('/map')}>
              <Compass className="w-4 h-4 text-slate-500" />
              {t('nav.map')}
            </Link>
            <Link to="/transparency" className={linkClass('/transparency')}>
              <BarChart3 className="w-4 h-4 text-slate-500" />
              {t('nav.transparency')}
            </Link>
            <Link to="/about" className={linkClass('/about')}>
              {t('nav.about')}
            </Link>

            {/* Role Specific Navigation */}
            {isCitizen && (
              <Link to="/citizen" className={linkClass('/citizen')}>
                <UserCheck className="w-4 h-4 text-emerald-600" />
                {t('nav.citizenDashboard')}
              </Link>
            )}

            {isOfficer && (
              <Link to="/officer" className={linkClass('/officer')}>
                <HardHat className="w-4 h-4 text-amber-600" />
                {t('nav.officerPortal')}
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className={linkClass('/admin')}>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                {t('nav.adminCenter')}
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Data Saver Mode Toggle */}
            <button
              type="button"
              onClick={toggleDataSaver}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                dataSaver
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={
                dataSaver
                  ? 'Data Saver ON: Optimizing network for low bandwidth'
                  : 'Enable Data Saver Mode for slow mobile networks'
              }
            >
              {dataSaver ? <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> : <ZapOff className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden lg:inline">{dataSaver ? 'Data Saver ON' : 'Data Saver'}</span>
            </button>

            <LanguageSelector variant="header" />
            <NotificationPopover />

            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-civic-600 hover:bg-civic-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t('nav.report')}</span>
              <span className="sm:hidden">Report</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t('nav.track')}
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t('nav.map')}
          </Link>
          <Link
            to="/transparency"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t('nav.transparency')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {t('nav.about')}
          </Link>

          <div className="pt-2 border-t border-slate-100">
            {isCitizen && (
              <Link
                to="/citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-emerald-700 bg-emerald-50"
              >
                {t('nav.citizenDashboard')}
              </Link>
            )}
            {isOfficer && (
              <Link
                to="/officer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-amber-700 bg-amber-50"
              >
                {t('nav.officerPortal')}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 bg-purple-50"
              >
                {t('nav.adminCenter')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
