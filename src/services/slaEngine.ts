import { Complaint, ComplaintPriority, EscalationLevel } from '../types';
import { COMPLAINT_CATEGORIES } from '../data/categories';

export interface SlaCalculationResult {
  slaDeadline: string;
  isOverdue: boolean;
  overdueDays: number;
  escalationLevel: EscalationLevel;
  hoursRemaining: number;
}

/**
 * Calculates dynamic SLA deadline, overdue status, and escalation level
 * for a complaint based on its category and creation timestamp.
 */
export function calculateSla(
  categoryId: string,
  createdAt: string,
  currentStatus: string,
  currentReopenedCount: number = 0,
  priority: ComplaintPriority = 'medium'
): SlaCalculationResult {
  const category = COMPLAINT_CATEGORIES.find((c) => c.id === categoryId);
  const slaDays = category ? category.slaDays : 3;
  const slaHours = slaDays * 24;

  const createdTime = new Date(createdAt).getTime();
  const deadlineTime = createdTime + slaHours * 3600 * 1000;
  const now = Date.now();

  const isResolvedOrRejected = currentStatus === 'resolved' || currentStatus === 'rejected';

  let isOverdue = false;
  let overdueDays = 0;
  let hoursRemaining = Math.max(0, Math.round((deadlineTime - now) / (3600 * 1000)));

  if (!isResolvedOrRejected && now > deadlineTime) {
    isOverdue = true;
    const diffMs = now - deadlineTime;
    overdueDays = Math.max(1, Math.ceil(diffMs / (86400 * 1000)));
    hoursRemaining = 0;
  }

  // Escalation Logic:
  // Level 1: Standard assigned officer (Within SLA or recently assigned)
  // Level 2: Supervisor (Overdue >= 1 day OR reopened >= 1 time)
  // Level 3: Commissioner (Overdue >= 3 days OR reopened >= 2 times OR critical hazard)
  let escalationLevel: EscalationLevel = 'level_1_officer';

  if (priority === 'critical' || currentReopenedCount >= 2 || overdueDays >= 3) {
    escalationLevel = 'level_3_commissioner';
  } else if (isOverdue || currentReopenedCount >= 1) {
    escalationLevel = 'level_2_supervisor';
  }

  return {
    slaDeadline: new Date(deadlineTime).toISOString(),
    isOverdue,
    overdueDays,
    escalationLevel,
    hoursRemaining
  };
}

/**
 * Recalculates and refreshes SLA state for a complaint
 */
export function refreshComplaintSla(complaint: Complaint): Complaint {
  const sla = calculateSla(
    complaint.categoryId,
    complaint.createdAt,
    complaint.status,
    complaint.reopenedCount,
    complaint.priority
  );

  return {
    ...complaint,
    slaDeadline: sla.slaDeadline,
    isOverdue: sla.isOverdue,
    overdueDays: sla.overdueDays,
    escalationLevel: sla.escalationLevel
  };
}

/**
 * Returns human-readable SLA tag string
 */
export function getSlaDisplayText(complaint: Complaint): {
  text: string;
  isOverdue: boolean;
  badgeClass: string;
} {
  if (complaint.status === 'resolved') {
    return {
      text: 'Resolved',
      isOverdue: false,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }

  if (complaint.isOverdue) {
    return {
      text: `OVERDUE BY ${complaint.overdueDays} ${complaint.overdueDays === 1 ? 'DAY' : 'DAYS'}`,
      isOverdue: true,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold'
    };
  }

  const deadline = new Date(complaint.slaDeadline);
  const diffHours = Math.max(0, Math.round((deadline.getTime() - Date.now()) / (3600 * 1000)));

  if (diffHours <= 24) {
    return {
      text: `${diffHours} hrs remaining`,
      isOverdue: false,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  }

  const days = Math.ceil(diffHours / 24);
  return {
    text: `${days} days remaining`,
    isOverdue: false,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
  };
}
