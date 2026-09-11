import React, { useState } from 'react';
import { Camera, CheckCircle2, ZoomIn, X, FileText } from 'lucide-react';
import { ComplaintEvidence } from '../../types';
import { formatDate } from '../../utils/formatters';

interface EvidenceGalleryProps {
  evidence: ComplaintEvidence[];
  actionTakenRemarks?: string;
  citizenVerificationStatus?: 'verified' | 'not_verified' | 'reopened' | 'pending';
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidence,
  actionTakenRemarks,
  citizenVerificationStatus
}) => {
  const [selectedImage, setSelectedImage] = useState<ComplaintEvidence | null>(null);

  const initialPhotos = evidence.filter((e) => e.stage === 'initial');
  const resolutionPhotos = evidence.filter((e) => e.stage === 'resolved');

  if (evidence.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 text-center text-slate-400 text-xs">
        <Camera className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        No photographic evidence attached to this complaint yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Before vs After Side-by-Side Card if both exist */}
      {initialPhotos.length > 0 && resolutionPhotos.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-civic-600" /> Before & After Evidence
            </span>
            {citizenVerificationStatus === 'verified' && (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 text-[10px] font-extrabold">
                ✓ Verified On-Ground by Citizen
              </span>
            )}
            {citizenVerificationStatus === 'reopened' && (
              <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 text-[10px] font-extrabold">
                ⚠ Reopened by Citizen
              </span>
            )}
            {citizenVerificationStatus === 'pending' && (
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 text-[10px] font-extrabold">
                ⏳ Awaiting Citizen Verification
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {/* Before Photo */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> BEFORE (Citizen Report)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {formatDate(initialPhotos[0].createdAt)}
                </span>
              </div>
              <div
                className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group shadow-2xs"
                onClick={() => setSelectedImage(initialPhotos[0])}
              >
                <img
                  src={initialPhotos[0].mediaUrl}
                  alt="Before repair"
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                  <ZoomIn className="w-4 h-4" /> View Fullscreen
                </div>
              </div>
              {initialPhotos[0].caption && (
                <p className="text-xs text-slate-600 italic">"{initialPhotos[0].caption}"</p>
              )}
            </div>

            {/* After Photo */}
            <div className="p-4 space-y-2 bg-emerald-50/20">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AFTER (Official Resolution)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {formatDate(resolutionPhotos[0].createdAt)}
                </span>
              </div>
              <div
                className="relative rounded-xl overflow-hidden border border-emerald-200 cursor-pointer group shadow-2xs"
                onClick={() => setSelectedImage(resolutionPhotos[0])}
              >
                <img
                  src={resolutionPhotos[0].mediaUrl}
                  alt="After repair"
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                  <ZoomIn className="w-4 h-4" /> View Fullscreen
                </div>
              </div>
              {resolutionPhotos[0].caption && (
                <p className="text-xs text-slate-700 font-medium">"{resolutionPhotos[0].caption}"</p>
              )}
            </div>
          </div>

          {/* Action Taken Official Explanation if available */}
          {actionTakenRemarks && (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
              <FileText className="w-4 h-4 text-civic-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Action Taken (Official Explanation):
                </span>
                <p className="mt-0.5 text-slate-800 font-medium">{actionTakenRemarks}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of All Media Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {evidence.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative h-32 overflow-hidden bg-slate-100">
              <img
                src={item.mediaUrl}
                alt={item.caption || 'Evidence'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                {item.stage}
              </span>
            </div>
            <div className="p-2.5 text-[11px] space-y-1">
              <p className="font-semibold text-slate-800 line-clamp-1">
                {item.caption || 'Attached photo'}
              </p>
              <p className="text-slate-400 truncate">By {item.uploadedByName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase bg-civic-100 text-civic-800 px-2 py-0.5 rounded">
                  {selectedImage.stage} stage
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Uploaded by {selectedImage.uploadedByName} ({selectedImage.uploadedByRole}) on{' '}
                  {formatDate(selectedImage.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
              <img
                src={selectedImage.mediaUrl}
                alt="Fullscreen evidence"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {selectedImage.caption && (
              <p className="text-sm text-slate-700 font-medium">"{selectedImage.caption}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
