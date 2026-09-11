import React from 'react';
import { X, AlertCircle, ThumbsUp, PlusCircle, MapPin } from 'lucide-react';
import { NearbyComplaintMatch } from '../../services/duplicateDetector';

interface DuplicateAlertModalProps {
  duplicates: NearbyComplaintMatch[];
  onSupportExisting: (complaintId: string) => void;
  onCreateNewAnyway: () => void;
  onCancel: () => void;
}

export const DuplicateAlertModal: React.FC<DuplicateAlertModalProps> = ({
  duplicates,
  onSupportExisting,
  onCreateNewAnyway,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950">
                Similar Issues Found Nearby!
              </h3>
              <p className="text-xs text-amber-800">
                We detected {duplicates.length} active {duplicates.length === 1 ? 'complaint' : 'complaints'} within 300m of your location.
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list of duplicates */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-600 leading-relaxed">
            Joining an existing complaint increases its priority with the municipal department and helps avoid duplicate backlogs:
          </p>

          <div className="space-y-2.5">
            {duplicates.map(({ complaint, distanceMeters }) => (
              <div
                key={complaint.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-civic-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {complaint.complaintId} • {distanceMeters}m away
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      {complaint.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 truncate max-w-[240px]">
                    <MapPin className="w-3 h-3 text-slate-400" /> {complaint.locationAddress}
                  </span>

                  <button
                    onClick={() => onSupportExisting(complaint.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs rounded-lg shadow-xs transition-transform active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Support Existing (+1)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5"
          >
            Cancel
          </button>

          <button
            onClick={onCreateNewAnyway}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Independent Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
