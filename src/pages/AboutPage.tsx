import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Camera,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-700 text-xs font-bold rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" /> Independent Civic-Tech Initiative
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About <span className="text-civic-600">NagarSetu</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          "{APP_CONFIG.TAGLINE}"
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-civic-600" />
          The Meaning of NagarSetu
        </h2>
        <div className="prose prose-slate text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
          <p>
            <strong>NagarSetu</strong> (नगरसेतु / నగరసేతు) literally translates to <em>"Bridge for the City"</em>. It is an independent civic-tech project designed to demonstrate how technology, radical transparency, and citizen participation can transform municipal complaint redressal in Indian urban local bodies.
          </p>
          <p>
            In traditional municipal complaint systems, citizens submit grievances into a "black hole"—uncertain whether their complaint was received, which department is responsible, which field officer was assigned, or what action was taken. NagarSetu bridges this deficit by making every step visible, timestamped, and verifiable.
          </p>
        </div>

        {/* Prototype Disclaimer Box */}
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Independent Academic & Civic-Tech Prototype</p>
            <p>
              {APP_CONFIG.DISCLAIMER} NagarSetu is an independent prototype and is not officially affiliated with or endorsed by any specific municipal corporation or government entity. All municipal data, officer designations, and ward reports shown in demo mode are for illustrative and testing purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center">
          Our Four Pillars of Civic Accountability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Identifiable Ownership</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every complaint is immediately assigned to an identifiable field engineer or sanitation inspector with designation, department, and contact info—preventing blame-shifting between departments.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Strict SLAs & Auto-Escalation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard redressal timelines (24h to 7 days) are strictly enforced. If a deadline passes, complaints automatically escalate from Ward Level (L1) to Zonal Supervisor (L2) and Municipal Commissioner (L3).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Mandatory Before & After Proof</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No ticket can be marked resolved on paper alone. Municipal workers must upload geotagged photographic evidence of the completed repair or sanitation work.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">4. The Citizen Verification Loop</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The citizen who reported the problem has the final say. If the issue was falsely closed, the citizen can reopen the ticket with 1-click, triggering an automatic supervisor audit.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-civic-700 to-emerald-700 rounded-3xl p-8 text-white text-center space-y-5 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to Experience Transparent Civic Governance?
        </h2>
        <p className="text-xs sm:text-sm text-civic-100 max-w-xl mx-auto leading-relaxed">
          Report a problem in your neighborhood, track actions on the live city map, or explore public transparency analytics.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/submit"
            className="px-6 py-3 bg-white text-civic-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
          >
            Report a Problem
          </Link>
          <Link
            to="/track"
            className="px-6 py-3 bg-civic-900/60 hover:bg-civic-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-civic-400/40 transition-all hover:scale-105 active:scale-95"
          >
            Track Existing Complaint
          </Link>
        </div>
      </div>
    </div>
  );
};
