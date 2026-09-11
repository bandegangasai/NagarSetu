import React, { useState } from 'react';
import { X, CheckCircle, HardHat } from 'lucide-react';
import { Complaint, ComplaintStatus } from '../../types';
import { useComplaints } from '../../contexts/ComplaintContext';

interface StatusUpdateModalProps {
  complaint: Complaint;
  onClose: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ complaint, onClose }) => {
  const { updateStatus } = useComplaints();
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(
    complaint.status === 'submitted' || complaint.status === 'received'
      ? 'in_progress'
      : 'resolved'
  );
  const [remarks, setRemarks] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleResolutionPhotos = [
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Please enter official remarks or description of action taken.');
      return;
    }

    if (selectedStatus === 'resolved' && !photoUrl) {
      alert('Proof of resolution photo is mandatory when marking a complaint as resolved.');
      return;
    }

    setIsSubmitting(true);
    try {
      updateStatus(complaint.id, selectedStatus, remarks.trim(), photoUrl || undefined);
      alert(`Complaint status successfully updated to ${selectedStatus.toUpperCase().replace('_', ' ')}!`);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Update Complaint Action & Status
              </h3>
              <p className="text-xs text-slate-400">
                Ticket: {complaint.complaintId} • {complaint.categoryName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select New Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-civic-500 focus:outline-none"
            >
              <option value="in_progress">IN PROGRESS — Inspection / Work Initiated</option>
              <option value="action_taken">ACTION TAKEN — Work Completed / Testing</option>
              <option value="resolved">RESOLVED — Fixed with Photographic Proof</option>
              <option value="rejected">REJECTED — Duplicate or Non-Jurisdictional</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Official Remarks / Progress Notes: <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Field inspection team visited spot. Replaced burnt LED drivers and restored lighting..."
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Photo Evidence (Mandatory for Resolved) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold uppercase tracking-wider text-slate-700">
                Resolution Photo / Evidence: {selectedStatus === 'resolved' && <span className="text-rose-600 font-bold">* (Mandatory)</span>}
              </label>
            </div>

            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste photo proof URL or click sample below..."
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
              <span>Quick Attach:</span>
              {sampleResolutionPhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoUrl(url)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-medium"
                >
                  Resolution Proof #{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Save & Publish Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
