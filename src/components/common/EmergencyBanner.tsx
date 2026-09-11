import React, { useState } from 'react';
import { Phone, X, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '../../utils/constants';

export const EmergencyBanner: React.FC = () => {
  const { t } = useTranslation();
  const [showNumbers, setShowNumbers] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs py-1.5 px-4 shadow-inner border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0" />
          <span className="font-medium tracking-wide">
            {t('nav.emergencyNotice')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-900/60 hover:bg-amber-900 text-amber-100 rounded text-[11px] font-semibold transition-colors border border-amber-500/40"
          >
            <Phone className="w-3 h-3" />
            {showNumbers ? 'Hide Emergency Helplines' : 'View Helplines (112, 101, 108)'}
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-amber-200 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showNumbers && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-600/40 flex flex-wrap items-center gap-4 text-[11px]">
          {APP_CONFIG.EMERGENCY_NUMBERS.map((item) => (
            <div key={item.number} className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded">
              <span className="text-amber-200">{item.label}:</span>
              <a href={`tel:${item.number}`} className="font-bold underline text-white hover:text-amber-200">
                {item.number}
              </a>
            </div>
          ))}
          <span className="text-amber-200/80 italic">
            *This platform handles municipal civic complaints and is not a substitute for police/fire/ambulance services.
          </span>
        </div>
      )}
    </div>
  );
};
