import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ComplaintStatus, ComplaintPriority, EscalationLevel } from '../types';

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch (e) {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMM yyyy');
  } catch (e) {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return dateString;
  }
}

export function getStatusBadgeInfo(status: ComplaintStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-500'
      };
    case 'received':
      return {
        label: 'Received',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotClass: 'bg-blue-500'
      };
    case 'under_review':
      return {
        label: 'Under Review',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotClass: 'bg-indigo-500'
      };
    case 'assigned':
      return {
        label: 'Assigned',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        dotClass: 'bg-purple-600'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
        dotClass: 'bg-amber-500 animate-pulse'
      };
    case 'action_taken':
      return {
        label: 'Action Taken',
        badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-300',
        dotClass: 'bg-cyan-500'
      };
    case 'resolved':
      return {
        label: 'Resolved',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        dotClass: 'bg-emerald-500'
      };
    case 'reopened':
      return {
        label: 'Reopened',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-300',
        dotClass: 'bg-rose-500 animate-bounce'
      };
    case 'rejected':
      return {
        label: 'Rejected',
        badgeClass: 'bg-red-50 text-red-700 border-red-300',
        dotClass: 'bg-red-500'
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-500'
      };
  }
}

export function getPriorityBadgeInfo(priority: ComplaintPriority): {
  label: string;
  badgeClass: string;
} {
  switch (priority) {
    case 'critical':
      return {
        label: 'Critical Hazard',
        badgeClass: 'bg-rose-600 text-white font-bold animate-pulse'
      };
    case 'high':
      return {
        label: 'High Priority',
        badgeClass: 'bg-orange-100 text-orange-800 border border-orange-300 font-semibold'
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200'
      };
    case 'low':
      return {
        label: 'Low Priority',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200'
      };
    default:
      return {
        label: priority,
        badgeClass: 'bg-slate-100 text-slate-700'
      };
  }
}

export function getEscalationBadgeInfo(level: EscalationLevel): {
  label: string;
  badgeClass: string;
} {
  switch (level) {
    case 'level_3_commissioner':
      return {
        label: 'Level 3: Municipal Commissioner',
        badgeClass: 'bg-purple-900 text-purple-100 border border-purple-700 font-bold'
      };
    case 'level_2_supervisor':
      return {
        label: 'Level 2: Zonal Supervisor',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-400 font-semibold'
      };
    case 'level_1_officer':
    default:
      return {
        label: 'Level 1: Ward Field Officer',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300'
      };
  }
}

export function maskCitizenName(name: string, isAnonymous: boolean): string {
  if (isAnonymous) return 'Anonymous Citizen';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return `${parts[0][0]}***`;
  }
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
