import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, FileText, Lock, Info, MapPin, BarChart3, Search, PlusCircle } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { APP_CONFIG } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Civic Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-civic-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Nagar<span className="text-civic-400">Setu</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-civic-300">
              "{APP_CONFIG.TAGLINE}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              NagarSetu is an independent citizen-powered civic accountability platform designed to bridge the trust gap between citizens and local urban administration.
            </p>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-400">
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Independent civic-tech project.</span>
            </div>
          </div>

          {/* Col 2: Citizen Actions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/submit" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-civic-400" /> Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-civic-400" /> Track Complaint by ID
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-civic-400" /> City Issue Map
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-civic-400" /> Transparency Portal
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="text-slate-400 hover:text-white transition-colors">
                  My Complaints & Verified Issues
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Policy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-civic-400" /> About NagarSetu
                </Link>
              </li>
              <li>
                <Link to="/officer" className="text-slate-400 hover:text-white transition-colors">
                  Field Officer Workspace
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Admin Command & SLA Monitor
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-civic-400" /> Privacy & PII Protection
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-civic-400" /> Citizen Charter & Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Language */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency Services
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>National Emergency:</span>
                <span className="font-bold text-amber-400">112</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Fire & Rescue:</span>
                <span className="font-bold text-amber-400">101</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Medical Ambulance:</span>
                <span className="font-bold text-amber-400">108</span>
              </div>
            </div>

            <div className="pt-2">
              <LanguageSelector variant="footer" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <p>© 2026 NagarSetu. Citizen Civic Accountability Platform.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Independent civic-tech project. Demo data shown for demonstration purposes.
            </p>
          </div>
          <p className="flex items-center gap-1 text-slate-400">
            Radical Transparency <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Citizen Empowerment
          </p>
        </div>
      </div>
    </footer>
  );
};
