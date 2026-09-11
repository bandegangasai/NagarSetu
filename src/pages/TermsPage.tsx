import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-800 text-xs font-bold rounded-full">
          <FileText className="w-3.5 h-3.5 text-civic-600" /> Citizen Charter & Platform Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Citizen Charter
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: September 2026 • Academic & Civic Tech Standards
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" /> 1. Emergency Safety Disclaimer
          </h2>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 font-medium">
            NagarSetu is intended for non-emergency municipal issues (e.g. road potholes, street lights, garbage accumulation, sanitation). For immediate, life-threatening emergencies such as severe fires, active criminal activity, or acute medical crises, please dial <strong>112 (National Emergency)</strong>, <strong>101 (Fire)</strong>, or <strong>108 (Ambulance)</strong> immediately.
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-civic-600" /> 2. Citizen Rights & Verification Guarantee
          </h2>
          <p>
            Citizens retain the right to complete audit visibility over submitted complaints. When an issue is marked resolved by municipal field staff, citizens have the unilateral right to confirm the resolution with rating feedback, or reopen the complaint with one click if the problem persists on the ground.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-civic-600" /> 3. Responsible Use & Accuracy
          </h2>
          <p>
            Users agree to provide truthful descriptions and authentic photographic evidence when filing complaints. Deliberately malicious or fraudulent submissions are prohibited.
          </p>
        </section>
      </div>
    </div>
  );
};
