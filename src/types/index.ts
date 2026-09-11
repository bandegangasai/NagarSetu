export type UserRole = 'citizen' | 'officer' | 'admin' | 'supervisor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  employeeCode?: string;
  wardNo?: string;
  language?: 'en' | 'te' | 'hi';
  avatarUrl?: string;
}

export type ComplaintStatus =
  | 'submitted'
  | 'received'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'action_taken'
  | 'resolved'
  | 'reopened'
  | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type EscalationLevel = 'level_1_officer' | 'level_2_supervisor' | 'level_3_commissioner';

export interface Department {
  id: string;
  code: string;
  name: string;
  nameTe: string;
  nameHi: string;
  description: string;
  email: string;
  phone: string;
  headOfficerName: string;
}

export interface ComplaintCategory {
  id: string;
  code: string;
  name: string;
  nameTe: string;
  nameHi: string;
  departmentId: string;
  defaultPriority: ComplaintPriority;
  slaDays: number;
  slaHours: number;
  iconName: string;
  emergencyWarning?: string;
}

export interface ComplaintEvidence {
  id: string;
  complaintId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'document';
  caption?: string;
  stage: 'initial' | 'inspection' | 'resolved' | 'reopen';
  uploadedById?: string;
  uploadedByRole: UserRole;
  uploadedByName: string;
  createdAt: string;
}

export interface StatusHistoryEvent {
  id: string;
  complaintId: string;
  previousStatus?: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedById?: string;
  actorName: string;
  actorRole: UserRole;
  remarks?: string;
  departmentName?: string;
  evidenceUrl?: string;
  createdAt: string;
}

export interface CitizenFeedback {
  id: string;
  complaintId: string;
  citizenId: string;
  isConfirmedResolved: boolean;
  rating?: number;
  feedbackText?: string;
  reopenReason?: string;
  reopenEvidenceUrl?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complaintId: string; // Formatted e.g. CIV-2026-000123
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryNameTe?: string;
  categoryNameHi?: string;
  categoryIcon?: string;
  departmentId?: string;
  departmentName?: string;
  departmentNameTe?: string;
  departmentNameHi?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerDesignation?: string;
  assignedOfficerPhone?: string;
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  escalationLevel: EscalationLevel;
  slaDeadline: string;
  isOverdue: boolean;
  overdueDays: number;
  createdAt: string;
  resolvedAt?: string;
  locationAddress: string;
  landmark?: string;
  wardNo: string;
  city: string;
  latitude: number;
  longitude: number;
  isAnonymous: boolean;
  supportersCount: number;
  supportedByMe?: boolean;
  reopenedCount: number;
  evidence: ComplaintEvidence[];
  timeline: StatusHistoryEvent[];
  feedback?: CitizenFeedback;
  delayReason?: string;
  nextExpectedAction?: string;
  expectedNextUpdate?: string;
  lastProgressUpdateAt?: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  complaintId?: string;
  complaintCode?: string;
  title: string;
  message: string;
  type: 'status_change' | 'sla_warning' | 'verification_required' | 'escalation' | 'info';
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  count: number;
  resolvedCount: number;
  color: string;
}

export interface AreaStat {
  areaName: string;
  total: number;
  resolved: number;
  pending: number;
}

export interface MonthlyTrend {
  month: string;
  submitted: number;
  resolved: number;
}

export interface DepartmentPerformance {
  departmentId: string;
  name: string;
  totalAssigned: number;
  resolved: number;
  inProgress: number;
  overdue: number;
  avgResolutionDays: number;
  slaRate: number; // percentage
}

export interface TransparencyStats {
  totalComplaints: number;
  resolvedCount: number;
  inProgressCount: number;
  pendingCount: number;
  overdueCount: number;
  avgResolutionDays: number;
  slaComplianceRate: number;
  byCategory: CategoryStat[];
  byArea: AreaStat[];
  monthlyTrend: MonthlyTrend[];
  departmentLeaderboard: DepartmentPerformance[];
}
