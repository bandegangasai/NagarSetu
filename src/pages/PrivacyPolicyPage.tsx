import React from 'react';
import { Lock, ShieldCheck, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-800 text-xs font-bold rounded-full">
          <Lock className="w-3.5 h-3.5 text-civic-600" /> Citizen Data Protection & Governance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & PII Protection
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: September 2026 • NagarSetu Open Governance Standards
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-civic-600" /> 1. Commitment to Citizen Privacy
          </h2>
          <p>
            NagarSetu is built on the principle that transparency in municipal governance must never compromise citizen safety or privacy. When you report a problem in your neighborhood, your personal identifying details (such as phone numbers, email addresses, and specific residential identity) are securely protected and strictly compartmentalized.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-civic-600" /> 2. Public Masking of Identifying Data
          </h2>
          <p>
            On all public interfaces—including the interactive City Issue Map, open search results, and public transparency feeds—the following safeguards are unconditionally applied:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Name Masking</strong>: Citizen names are either presented in truncated form (e.g. "Ramesh K.") or listed as "Anonymous Citizen".</li>
            <li><strong>Contact Protection</strong>: Phone numbers and email addresses are never rendered publicly or returned in public API payloads.</li>
            <li><strong>Geographic Precision</strong>: Map pins display public civic infrastructure locations (such as road intersections or community waste bins) without linking them to private residential residences.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-civic-600" /> 3. Photographic & Evidence Policy
          </h2>
          <p>
            Photos uploaded by citizens and municipal officials are utilized strictly for locating, auditing, and verifying on-ground civic resolutions. Photos are publicly accessible to allow community verification of before-and-after work.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-civic-600" /> 4. Anonymous Reporting Option
          </h2>
          <p>
            Citizens can choose to submit grievances in 100% Anonymous mode with a single checkbox. When selected, no personal name or profile link is registered against the public ledger.
          </p>
        </section>
      </div>
    </div>
  );
};
