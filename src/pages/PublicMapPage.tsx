import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { PublicComplaintMap } from '../components/maps/PublicComplaintMap';

export const PublicMapPage: React.FC = () => {
  const { t } = useTranslation();
  const { complaints } = useComplaints();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-800 text-xs font-bold rounded-full mb-1">
            <Compass className="w-3.5 h-3.5 text-civic-600" /> Geospatial Civic GIS Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.map')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time interactive map of registered municipal grievances across Indian cities.
          </p>
        </div>
      </div>

      <PublicComplaintMap complaints={complaints} />
    </div>
  );
};
