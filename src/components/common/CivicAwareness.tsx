import React, { useState } from 'react';
import { HelpCircle, Lightbulb, Trash2, Droplets, Activity, AlertTriangle, CheckCircle2, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';

export const CivicAwareness: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const awarenessItems = [
    {
      id: 1,
      title: 'Who handles street lights and dark road stretches?',
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      dept: 'Electrical & Street Lighting Wing',
      sla: '3 Days',
      answer: 'The municipal electrical division is responsible for street poles, burnt LED fixtures, underground cables, and timer switchboards. When reporting, provide the nearest pole number or landmark for fastest spot repair.'
    },
    {
      id: 2,
      title: 'Who handles uncollected garbage and overflowing community bins?',
      icon: <Trash2 className="w-5 h-5 text-emerald-600" />,
      dept: 'Sanitation & Solid Waste Management Wing',
      sla: '1 Day (24 Hours)',
      answer: 'Sanitation inspectors coordinate hydraulic compactor trucks, tipper autos, and street sweeping gangs. High-priority garbage accumulation must be attended within 24 hours under municipal citizen charters.'
    },
    {
      id: 3,
      title: 'Who handles water pipeline leakages and dirty water supply?',
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      dept: 'Water Supply & Sewerage Board',
      sla: '2 Days (48 Hours)',
      answer: 'The water supply engineering division manages distribution mains, valve operations, and contamination testing. Immediate pipeline bursts causing road damage are assigned top priority.'
    },
    {
      id: 4,
      title: 'Who fixes dangerous potholes and broken road surfaces?',
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      dept: 'Roads & Infrastructure Engineering Wing',
      sla: '7 Days',
      answer: 'Civil engineers dispatch asphalt cold/hot bitumen mix gangs and road compactors. Deep potholes (>2 feet) near hospital or school corridors are flagged as High Urgency for emergency night-shift patching.'
    },
    {
      id: 5,
      title: 'What information should I provide for fastest complaint resolution?',
      icon: <CheckCircle2 className="w-5 h-5 text-civic-600" />,
      dept: 'Best Practice for Citizens',
      sla: 'Instant Tip',
      answer: '1. Take a clear, well-lit photo showing the problem and surrounding context. 2. Specify exact landmarks (e.g. Opposite Gate No. 2, Near Pillar 45). 3. Use GPS location on map.'
    },
    {
      id: 6,
      title: 'When should I call 112 instead of reporting on NagarSetu?',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      dept: 'Emergency Services (Police, Fire, Ambulance)',
      sla: 'Emergency 112',
      answer: 'NagarSetu is for municipal civic grievances. For life-threatening emergencies, active fire, structural collapse, gas leaks, or live high-voltage electric wires sparking on the ground, immediately dial 112 or your local emergency helpline.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-700 text-xs font-bold rounded-full">
            <HelpCircle className="w-3.5 h-3.5" /> Civic Awareness Guide
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Know Your Civic Services
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Understanding municipal department responsibilities helps your complaints get resolved faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awarenessItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-civic-500 bg-civic-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-civic-700 font-semibold mt-1">
                      {item.dept} • <span className="font-mono text-slate-500">SLA: {item.sla}</span>
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 mt-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 bg-white/70">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
        <span className="text-slate-700 font-medium">
          Have an urgent life-threatening emergency?
        </span>
        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call National Emergency 112</span>
        </a>
      </div>
    </div>
  );
};
