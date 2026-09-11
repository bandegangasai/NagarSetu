import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useComplaints } from '../../contexts/ComplaintContext';
import { Users, RotateCcw, ShieldCheck, UserCheck, HardHat } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { currentUser, demoUsers, switchDemoUser } = useAuth();
  const { resetToDefaultData } = useComplaints();

  const handleReset = () => {
    if (window.confirm('Reset all complaints and timeline history to default demo state?')) {
      resetToDefaultData();
      alert('Demo data restored successfully!');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
      case 'officer':
        return <HardHat className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-navy-950 text-slate-200 text-xs py-1.5 px-3 border-b border-navy-800 z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-civic-800 text-civic-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            <Users className="w-3 h-3" /> DEMO MODE — SAMPLE DATA
          </span>
          <span className="hidden sm:inline text-slate-400">Switch Role:</span>
          <div className="flex flex-wrap items-center gap-1">
            {demoUsers.map((u) => {
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchDemoUser(u.id)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-civic-600 text-white font-semibold ring-1 ring-white/30 shadow-sm'
                      : 'bg-navy-900 text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                  title={`${u.name} (${u.role.toUpperCase()}) - ${u.designation || ''}`}
                >
                  {getRoleIcon(u.role)}
                  <span className="truncate max-w-[110px]">{u.name.split(' ')[0]}</span>
                  <span className="text-[9px] opacity-75 uppercase">({u.role})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2 py-1 bg-navy-900 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700/60 hover:border-rose-500/40 rounded text-[11px] transition-colors"
            title="Reset all complaints, timeline and feedback to initial demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
