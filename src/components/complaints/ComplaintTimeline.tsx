import React from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  Building2,
  FileCheck,
  AlertTriangle,
  Camera,
  RotateCcw
} from 'lucide-react';
import { StatusHistoryEvent, ComplaintStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ComplaintTimelineProps {
  timeline: StatusHistoryEvent[];
  currentStatus?: ComplaintStatus;
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ timeline }) => {
  const getEventIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-slate-600" />;
      case 'received':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'assigned':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-amber-600 animate-spin" />;
      case 'action_taken':
        return <FileCheck className="w-4 h-4 text-cyan-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'reopened':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadgeStyle = (status: ComplaintStatus) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'reopened':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'in_progress':
      case 'action_taken':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'received':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="flow-root">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-civic-600" /> Complete Audit Timeline
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          {timeline.length} {timeline.length === 1 ? 'Recorded Event' : 'Recorded Events'}
        </span>
      </div>

      <ul className="-mb-8">
        {timeline.map((event, idx) => {
          const isLast = idx === timeline.length - 1;
          return (
            <li key={event.id || idx}>
              <div className="relative pb-8">
                {/* Connecting vertical line */}
                {!isLast && (
                  <span
                    className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start space-x-3">
                  {/* Icon Node */}
                  <div>
                    <div className="relative px-1">
                      <div className="h-8 w-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs">
                        {getEventIcon(event.newStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Event Details Card */}
                  <div className="min-w-0 flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:bg-slate-50/90 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-1 pb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadgeStyle(
                            event.newStatus
                          )}`}
                        >
                          {event.newStatus.replace('_', ' ')}
                        </span>
                        {event.departmentName && (
                          <span className="text-xs font-medium text-slate-500">
                            • {event.departmentName}
                          </span>
                        )}
                      </div>
                      <time className="text-[11px] font-medium text-slate-400">
                        {formatDate(event.createdAt)}
                      </time>
                    </div>

                    {/* Actor Role & Name */}
                    <p className="text-xs text-slate-700 font-semibold mt-1">
                      Action by: <span className="text-slate-900">{event.actorName}</span>{' '}
                      <span className="text-[10px] text-slate-500 font-normal uppercase bg-slate-200/70 px-1.5 py-0.2 rounded">
                        ({event.actorRole})
                      </span>
                    </p>

                    {/* Remarks / Progress Description */}
                    {event.remarks && (
                      <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed font-normal">
                        "{event.remarks}"
                      </div>
                    )}

                    {/* Attached Photo Evidence Thumbnail */}
                    {event.evidenceUrl && (
                      <div className="mt-2.5">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1">
                          <Camera className="w-3.5 h-3.5 text-civic-600" /> Attached Photo Proof:
                        </div>
                        <a
                          href={event.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-xs rounded-lg overflow-hidden border border-slate-300 hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={event.evidenceUrl}
                            alt="Audit Evidence"
                            className="w-full h-32 object-cover"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
