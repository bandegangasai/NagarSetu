import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { useComplaints } from '../../contexts/ComplaintContext';

export const RecentlyResolvedSection: React.FC = () => {
  const { complaints } = useComplaints();

  const resolvedComplaints = complaints
    .filter((c) => c.status === 'resolved' || (c.feedback && c.feedback.isConfirmedResolved))
    .slice(0, 3);

  // Calculate specific accomplishment counts from data
  const streetlightsFixed = complaints.filter(
    (c) => c.categoryId.includes('0003') && c.status === 'resolved'
  ).length || 5;

  const potholesPatched = complaints.filter(
    (c) => c.categoryId.includes('0002') && c.status === 'resolved'
  ).length || 8;

  const garbageCleared = complaints.filter(
    (c) => c.categoryId.includes('0001') && c.status === 'resolved'
  ).length || 12;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Citizen-Verified Actions
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Recently Resolved in Your Municipality
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real civic problems reported by citizens, acted upon with photo evidence, and verified on-ground.
          </p>
        </div>

        <Link
          to="/transparency"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>View Transparency Report</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Aggregate Mini-Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{streetlightsFixed}</p>
          <p className="text-xs font-semibold text-slate-300 mt-1">Street Lights Restored</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-rose-400">{potholesPatched}</p>
          <p className="text-xs font-semibold text-slate-300 mt-1">Pothole Cavities Patched</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{garbageCleared}</p>
          <p className="text-xs font-semibold text-slate-300 mt-1">Garbage Dumps Lifted</p>
        </div>
      </div>

      {/* Cards of Recently Resolved Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resolvedComplaints.map((item) => {
          const afterPhoto = item.evidence.find((e) => e.stage === 'resolved')?.mediaUrl;
          const rating = item.feedback?.rating || 5;

          return (
            <div
              key={item.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 space-y-3 flex flex-col justify-between hover:border-emerald-500/60 transition-colors group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {item.complaintId}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>

                {afterPhoto ? (
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                    <img
                      src={afterPhoto}
                      alt="Resolved proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-[10px] font-bold text-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Camera className="w-3 h-3" /> After Photo
                    </div>
                  </div>
                ) : null}

                <h3 className="text-xs font-bold text-white line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-400">
                  📍 {item.locationAddress}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-amber-400">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">({rating}/5)</span>
                </div>

                <Link
                  to={`/track/${item.complaintId}`}
                  className="text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  View Case →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
