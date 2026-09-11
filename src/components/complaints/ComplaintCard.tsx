import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ThumbsUp, ChevronRight, AlertTriangle, User } from 'lucide-react';
import { Complaint } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  formatDateShort,
  getStatusBadgeInfo,
  getPriorityBadgeInfo,
  getEscalationBadgeInfo,
  maskCitizenName
} from '../../utils/formatters';
import { getSlaDisplayText } from '../../services/slaEngine';
import { useComplaints } from '../../contexts/ComplaintContext';

interface ComplaintCardProps {
  complaint: Complaint;
  showActions?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, showActions = true }) => {
  const { supportIssue } = useComplaints();
  const statusInfo = getStatusBadgeInfo(complaint.status);
  const priorityInfo = getPriorityBadgeInfo(complaint.priority);
  const escalationInfo = getEscalationBadgeInfo(complaint.escalationLevel);
  const slaInfo = getSlaDisplayText(complaint);

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    supportIssue(complaint.id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Header Bar */}
        <div className="p-4 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {complaint.complaintId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] px-2 py-0.5 rounded ${priorityInfo.badgeClass}`}>
              {priorityInfo.label}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded border ${slaInfo.badgeClass}`}>
              {slaInfo.text}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-civic-50 text-civic-700 flex items-center justify-center shrink-0 border border-civic-100 mt-0.5">
              <CategoryIcon name={complaint.categoryIcon} className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-civic-800 uppercase tracking-wider">
                {complaint.categoryName}
              </p>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-civic-700 transition-colors line-clamp-2">
                {complaint.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>

          {/* Location & Reported By */}
          <div className="pt-2 border-t border-slate-50 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{complaint.locationAddress}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Reported {formatDateShort(complaint.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {maskCitizenName(complaint.citizenName, complaint.isAnonymous)}
              </span>
            </div>
          </div>

          {/* Escalation notice if escalated */}
          {complaint.escalationLevel !== 'level_1_officer' && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Escalated to: <strong>{escalationInfo.label}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleSupportClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            complaint.supportedByMe
              ? 'bg-civic-600 text-white'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
          }`}
          title="Support this issue to prevent duplicate submissions and raise urgency"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${complaint.supportedByMe ? 'fill-white' : ''}`} />
          <span>{complaint.supportersCount} {complaint.supportersCount === 1 ? 'Citizen' : 'Citizens'}</span>
        </button>

        {showActions && (
          <Link
            to={`/track/${complaint.complaintId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-civic-700 hover:text-civic-900 group/link"
          >
            <span>Track Progress</span>
            <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};
