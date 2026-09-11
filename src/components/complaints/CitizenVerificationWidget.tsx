import React, { useState } from 'react';
import { Star, CheckCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Complaint } from '../../types';
import { useComplaints } from '../../contexts/ComplaintContext';
import { ReopenModal } from './ReopenModal';

interface CitizenVerificationWidgetProps {
  complaint: Complaint;
}

export const CitizenVerificationWidget: React.FC<CitizenVerificationWidgetProps> = ({ complaint }) => {
  const { verifyResolution } = useComplaints();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);

  // If complaint is confirmed and citizen feedback already given:
  if (complaint.feedback && complaint.feedback.isConfirmedResolved) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-emerald-950">
                  Resolved & Verified by Citizen
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= (complaint.feedback?.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
              "{complaint.feedback.feedbackText || 'Citizen verified on-ground resolution and closed the ticket.'}"
            </p>
            <p className="text-[11px] text-emerald-700/80">
              Verified on {new Date(complaint.feedback.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If status is not 'resolved', verification is not active yet
  if (complaint.status !== 'resolved') {
    return null;
  }

  const handleConfirmResolved = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    verifyResolution(
      complaint.id,
      true,
      rating,
      feedbackText.trim() || 'Verified by citizen: Issue resolved successfully on the ground.'
    );
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 border-2 border-civic-500 rounded-2xl p-5 sm:p-6 shadow-elevated relative overflow-hidden">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs mb-3">
        <ShieldCheck className="w-4 h-4" /> Citizen Verification Required
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold text-civic-800 uppercase tracking-wider">
          The department has marked this problem as resolved.
        </p>
        <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
          Is the problem actually fixed?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Please inspect the on-ground location and confirm if the reported issue has been completely fixed to your satisfaction.
        </p>
      </div>

      {!isConfirming ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsConfirming(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-98"
          >
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            <span>YES, IT'S FIXED</span>
          </button>

          <button
            onClick={() => setShowReopenModal(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs sm:text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-98"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>NO, THE PROBLEM STILL EXISTS</span>
          </button>
        </div>
      ) : (
        /* Citizen satisfaction rating form when they click 'YES, IT'S FIXED' */
        <div className="mt-5 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Rate Municipal Redressal Quality:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 scale-110'
                        : 'text-slate-300'
                    } transition-transform`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-600 ml-2">
                {rating === 5 ? 'Excellent 🌟' : rating === 4 ? 'Good 👍' : rating === 3 ? 'Average' : 'Below Average'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Citizen Comments (Optional):
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g., The street lights were repaired quickly and the lane is brightly lit again. Thank you!"
              rows={2}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirmResolved}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Mark "Resolved & Verified"</span>
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Reopen Modal if Citizen selects 'NO, THE PROBLEM STILL EXISTS' */}
      {showReopenModal && (
        <ReopenModal
          complaint={complaint}
          onClose={() => setShowReopenModal(false)}
        />
      )}
    </div>
  );
};
