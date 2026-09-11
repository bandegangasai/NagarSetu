import React, { useState } from 'react';
import { X, AlertTriangle, RotateCcw } from 'lucide-react';
import { Complaint } from '../../types';
import { useComplaints } from '../../contexts/ComplaintContext';

interface ReopenModalProps {
  complaint: Complaint;
  onClose: () => void;
}

export const ReopenModal: React.FC<ReopenModalProps> = ({ complaint, onClose }) => {
  const { verifyResolution } = useComplaints();
  const [reason, setReason] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleProofUrls = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please explain why the issue is still not resolved.');
      return;
    }

    setIsSubmitting(true);
    try {
      verifyResolution(
        complaint.id,
        false,
        undefined,
        undefined,
        reason.trim(),
        photoUrl || sampleProofUrls[0]
      );
      alert('Complaint reopened successfully! It has been escalated to the Zonal Supervisor for audit.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to reopen complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">
                Why isn't the problem resolved?
              </h3>
              <p className="text-xs text-rose-700">
                Ticket: {complaint.complaintId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Reopening this complaint will automatically trigger <strong>Level 2 Supervisor Escalation</strong> to investigate why the on-ground resolution failed.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Why is this issue still unresolved? <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. The garbage was only partially cleared from the side lane; the main open bin is still overflowing..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Attach New Photo Evidence */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Attach New Photographic Proof (Recommended):
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste image URL or select simulated photo below..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Quick Photo Proof:</span>
                {sampleProofUrls.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 border border-slate-300"
                  >
                    Attach Photo #{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isSubmitting ? 'Escalating...' : 'Confirm & Reopen Issue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
