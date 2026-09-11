import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Building2,
  Phone,
  ThumbsUp,
  AlertTriangle,
  HardHat,
  ArrowLeft,
  Share2,
  HelpCircle,
  Calendar,
  Hourglass,
  ArrowRightCircle
} from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { ComplaintTimeline } from '../components/complaints/ComplaintTimeline';
import { EvidenceGallery } from '../components/complaints/EvidenceGallery';
import { CitizenVerificationWidget } from '../components/complaints/CitizenVerificationWidget';
import { StatusUpdateModal } from '../components/complaints/StatusUpdateModal';
import {
  formatDate,
  getStatusBadgeInfo,
  getPriorityBadgeInfo,
  getEscalationBadgeInfo,
  maskCitizenName
} from '../utils/formatters';
import { getSlaDisplayText } from '../services/slaEngine';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, supportIssue } = useComplaints();
  const { isOfficer, isAdmin } = useAuth();

  const [showOfficerUpdateModal, setShowOfficerUpdateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!id) return null;

  const complaint = getComplaint(id);

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Complaint Not Found
        </h3>
        <p className="text-xs text-slate-600">
          We could not locate any registered complaint with ID: <code className="font-mono font-bold">{id}</code>.
        </p>
        <Link
          to="/track"
          className="inline-flex items-center gap-2 px-4 py-2 bg-civic-600 text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Try Searching Again
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusBadgeInfo(complaint.status);
  const priorityInfo = getPriorityBadgeInfo(complaint.priority);
  const escalationInfo = getEscalationBadgeInfo(complaint.escalationLevel);
  const slaInfo = getSlaDisplayText(complaint);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/track"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'Link Copied!' : 'Share Ticket'}
          </button>

          {(isOfficer || isAdmin) && (
            <button
              onClick={() => setShowOfficerUpdateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Update Status / Upload Proof</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dossier Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base sm:text-lg font-black text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
              {complaint.complaintId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-lg ${priorityInfo.badgeClass}`}>
              {priorityInfo.label}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-lg border ${slaInfo.badgeClass}`}>
              {slaInfo.text}
            </span>
          </div>
        </div>

        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-civic-700 uppercase tracking-wider">
            <CategoryIcon name={complaint.categoryIcon} className="w-4 h-4" />
            <span>{complaint.categoryName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {complaint.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Escalation Alert if active */}
        {complaint.escalationLevel !== 'level_1_officer' && (
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Escalated Grievance Alert</p>
              <p className="mt-0.5">
                Current Authority Level: <strong>{escalationInfo.label}</strong>. Due to SLA delay or citizen feedback, this issue has been escalated for senior oversight.
              </p>
            </div>
          </div>
        )}

        {/* Delay Transparency Section if Overdue */}
        {complaint.isOverdue && complaint.status !== 'resolved' && (
          <div className="p-4 bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 rounded-2xl text-xs text-rose-950 space-y-3">
            <div className="flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-extrabold text-sm text-rose-900">Why is this complaint delayed?</p>
                <p className="text-[11px] text-rose-700">Official Municipal Redressal Transparency Explanation</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-rose-200 space-y-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Official Reason for Delay:</span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    {complaint.delayReason || 'Specialized asphalt mix machinery & overnight traffic diversion clearance indent in progress with municipal engineering wing.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-rose-100 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ArrowRightCircle className="w-3.5 h-3.5 text-civic-600" />
                  <span><strong>Next Expected Action:</strong> {complaint.nextExpectedAction || 'Road roller gang deployed for night shift'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span><strong>Expected Next Update:</strong> {complaint.expectedNextUpdate || 'Within 24 hours'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No-Progress Alert if ticket is stalled */}
        {!complaint.isOverdue && complaint.status === 'in_progress' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Active Progress Tracking: Field inspection completed. Work underway under standard category SLA.</span>
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              On Schedule
            </span>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Location & Ward
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-civic-600" /> {complaint.locationAddress}
            </p>
            {complaint.landmark && (
              <p className="text-slate-500 text-[11px]">Landmark: {complaint.landmark}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Filing Date & Citizen
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> {formatDate(complaint.createdAt)}
            </p>
            <p className="text-slate-500 text-[11px]">
              Reported by: {maskCitizenName(complaint.citizenName, complaint.isAnonymous)}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Community Supporters
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => supportIssue(complaint.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  complaint.supportedByMe
                    ? 'bg-civic-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${complaint.supportedByMe ? 'fill-white' : ''}`} />
                <span>{complaint.supportersCount} Supports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Verification Loop Widget */}
      <CitizenVerificationWidget complaint={complaint} />

      {/* Two Column Layout: Left Evidence & Department Info, Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Department & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          {/* Evidence Comparison Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Photographic Evidence
            </h3>
            <EvidenceGallery
              evidence={complaint.evidence}
              actionTakenRemarks={
                complaint.timeline.find((t) => t.newStatus === 'resolved' || t.newStatus === 'action_taken')?.remarks
              }
              citizenVerificationStatus={
                complaint.feedback?.isConfirmedResolved
                  ? 'verified'
                  : complaint.status === 'reopened'
                  ? 'reopened'
                  : complaint.status === 'resolved'
                  ? 'pending'
                  : 'not_verified'
              }
            />
          </div>

          {/* Responsible Department & Designated Officer Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-civic-600" /> Responsible Municipality Entity
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold">Department</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {complaint.departmentName || 'Central Municipal Grievance Cell'}
                </p>
              </div>

              {complaint.assignedOfficerName && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Designated Field Officer
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {complaint.assignedOfficerName}
                  </p>
                  {complaint.assignedOfficerDesignation && (
                    <p className="text-slate-600 text-[11px]">
                      {complaint.assignedOfficerDesignation}
                    </p>
                  )}
                  {complaint.assignedOfficerPhone && (
                    <p className="text-slate-600 text-[11px] flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-civic-600" /> {complaint.assignedOfficerPhone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Vertical Audit Timeline */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sticky top-24">
            <ComplaintTimeline
              timeline={complaint.timeline}
              currentStatus={complaint.status}
            />
          </div>
        </div>
      </div>

      {/* Officer Status Update Modal */}
      {showOfficerUpdateModal && (
        <StatusUpdateModal
          complaint={complaint}
          onClose={() => setShowOfficerUpdateModal(false)}
        />
      )}
    </div>
  );
};
