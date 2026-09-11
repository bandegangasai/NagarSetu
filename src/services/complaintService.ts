import { Complaint, ComplaintStatus, UserRole, CitizenFeedback, ComplaintEvidence, StatusHistoryEvent } from '../types';
import { INITIAL_COMPLAINTS } from '../data/sampleComplaints';
import { COMPLAINT_CATEGORIES } from '../data/categories';
import { DEPARTMENTS } from '../data/departments';
import { calculateSla, refreshComplaintSla } from './slaEngine';
import { createNotification } from './notificationService';

const COMPLAINTS_STORAGE_KEY = 'nagarsetu_complaints_v1';

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (raw) {
      const parsed: Complaint[] = JSON.parse(raw);
      // Refresh SLA for all complaints to keep overdue calculations fresh
      return parsed.map(refreshComplaintSla);
    }
  } catch (e) {
    console.error('Failed to load complaints from storage, resetting to initial', e);
  }

  // Initialize with seed complaints
  saveComplaints(INITIAL_COMPLAINTS);
  return INITIAL_COMPLAINTS.map(refreshComplaintSla);
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints to storage', e);
  }
}

export function resetComplaintsData(): Complaint[] {
  saveComplaints(INITIAL_COMPLAINTS);
  return INITIAL_COMPLAINTS.map(refreshComplaintSla);
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  categoryId: string;
  locationAddress: string;
  landmark?: string;
  wardNo?: string;
  city: string;
  latitude: number;
  longitude: number;
  isAnonymous: boolean;
  initialPhotoUrl?: string;
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
}

/**
 * Creates a new complaint and registers initial audit timeline event.
 */
export function createComplaint(input: CreateComplaintInput): Complaint {
  const currentList = getStoredComplaints();
  const currentYear = new Date().getFullYear();
  const nextSeq = currentList.length + 1;
  const complaintCode = `NAG-${currentYear}-${String(nextSeq).padStart(6, '0')}`;

  const category = COMPLAINT_CATEGORIES.find((c) => c.id === input.categoryId);
  const department = category ? DEPARTMENTS.find((d) => d.id === category.departmentId) : undefined;

  const nowIso = new Date().toISOString();
  const slaResult = calculateSla(
    input.categoryId,
    nowIso,
    'submitted',
    0,
    category?.defaultPriority || 'medium'
  );

  const newId = `c-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const evidence: ComplaintEvidence[] = [];
  if (input.initialPhotoUrl) {
    evidence.push({
      id: `ev-${Date.now()}`,
      complaintId: newId,
      mediaUrl: input.initialPhotoUrl,
      mediaType: 'image',
      caption: 'Initial photo submitted by citizen',
      stage: 'initial',
      uploadedById: input.citizenId,
      uploadedByRole: 'citizen',
      uploadedByName: input.citizenName,
      createdAt: nowIso
    });
  }

  const timeline: StatusHistoryEvent[] = [
    {
      id: `tl-${Date.now()}`,
      complaintId: newId,
      newStatus: 'submitted',
      changedById: input.citizenId,
      actorName: input.citizenName,
      actorRole: 'citizen',
      remarks: 'Complaint registered online with GPS location.',
      createdAt: nowIso
    }
  ];

  const newComplaint: Complaint = {
    id: newId,
    complaintId: complaintCode,
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    categoryName: category?.name || 'General Civic Issue',
    categoryNameTe: category?.nameTe,
    categoryNameHi: category?.nameHi,
    categoryIcon: category?.iconName,
    departmentId: department?.id,
    departmentName: department?.name,
    departmentNameTe: department?.nameTe,
    departmentNameHi: department?.nameHi,
    citizenId: input.citizenId,
    citizenName: input.isAnonymous ? 'Anonymous Citizen' : input.citizenName,
    citizenPhone: input.isAnonymous ? undefined : input.citizenPhone,
    status: 'submitted',
    priority: category?.defaultPriority || 'medium',
    escalationLevel: slaResult.escalationLevel,
    slaDeadline: slaResult.slaDeadline,
    isOverdue: false,
    overdueDays: 0,
    createdAt: nowIso,
    locationAddress: input.locationAddress,
    landmark: input.landmark,
    wardNo: input.wardNo || 'Ward General',
    city: input.city,
    latitude: input.latitude,
    longitude: input.longitude,
    isAnonymous: input.isAnonymous,
    supportersCount: 1,
    supportedByMe: false,
    reopenedCount: 0,
    evidence,
    timeline
  };

  const updatedList = [newComplaint, ...currentList];
  saveComplaints(updatedList);

  return newComplaint;
}

/**
 * Supports (+1 Me Too) an existing complaint
 */
export function supportComplaint(complaintId: string): Complaint | null {
  const currentList = getStoredComplaints();
  const index = currentList.findIndex((c) => c.id === complaintId || c.complaintId === complaintId);

  if (index === -1) return null;

  const target = currentList[index];
  const newSupportersCount = target.supportersCount + (target.supportedByMe ? -1 : 1);
  const updatedComplaint: Complaint = {
    ...target,
    supportersCount: newSupportersCount,
    supportedByMe: !target.supportedByMe
  };

  currentList[index] = updatedComplaint;
  saveComplaints(currentList);
  return updatedComplaint;
}

export interface UpdateStatusInput {
  complaintId: string;
  newStatus: ComplaintStatus;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  remarks: string;
  evidencePhotoUrl?: string;
  departmentName?: string;
}

/**
 * Updates status of a complaint and appends audit timeline event.
 */
export function updateComplaintStatus(input: UpdateStatusInput): {
  complaint: Complaint;
  notification?: any;
} {
  const currentList = getStoredComplaints();
  const index = currentList.findIndex(
    (c) => c.id === input.complaintId || c.complaintId === input.complaintId
  );

  if (index === -1) {
    throw new Error(`Complaint ${input.complaintId} not found`);
  }

  const old = currentList[index];
  const nowIso = new Date().toISOString();

  const newTimelineItem: StatusHistoryEvent = {
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    complaintId: old.id,
    previousStatus: old.status,
    newStatus: input.newStatus,
    changedById: input.actorId,
    actorName: input.actorName,
    actorRole: input.actorRole,
    remarks: input.remarks,
    departmentName: input.departmentName || old.departmentName,
    evidenceUrl: input.evidencePhotoUrl,
    createdAt: nowIso
  };

  const newEvidence = [...old.evidence];
  if (input.evidencePhotoUrl) {
    newEvidence.push({
      id: `ev-${Date.now()}`,
      complaintId: old.id,
      mediaUrl: input.evidencePhotoUrl,
      mediaType: 'image',
      caption: input.remarks || `Photo uploaded during ${input.newStatus}`,
      stage: input.newStatus === 'resolved' ? 'resolved' : 'inspection',
      uploadedById: input.actorId,
      uploadedByRole: input.actorRole,
      uploadedByName: input.actorName,
      createdAt: nowIso
    });
  }

  let resolvedAt = old.resolvedAt;
  if (input.newStatus === 'resolved' && !resolvedAt) {
    resolvedAt = nowIso;
  } else if (input.newStatus !== 'resolved') {
    resolvedAt = undefined;
  }

  const updatedComplaint: Complaint = refreshComplaintSla({
    ...old,
    status: input.newStatus,
    resolvedAt,
    evidence: newEvidence,
    timeline: [...old.timeline, newTimelineItem]
  });

  currentList[index] = updatedComplaint;
  saveComplaints(currentList);

  // Dispatch notification to citizen
  let notification;
  if (old.citizenId) {
    notification = createNotification({
      recipientId: old.citizenId,
      complaintId: old.id,
      complaintCode: old.complaintId,
      title: input.newStatus === 'resolved' ? 'Complaint Marked Resolved — Please Verify' : `Status Updated: ${input.newStatus.toUpperCase().replace('_', ' ')}`,
      message: `${input.actorName} (${input.actorRole}): "${input.remarks}"`,
      type: input.newStatus === 'resolved' ? 'verification_required' : 'status_change',
      actionUrl: `/track/${old.complaintId}`
    });
  }

  return { complaint: updatedComplaint, notification };
}

export interface VerifyResolutionInput {
  complaintId: string;
  citizenId: string;
  citizenName: string;
  isConfirmedResolved: boolean;
  rating?: number;
  feedbackText?: string;
  reopenReason?: string;
  reopenEvidenceUrl?: string;
}

/**
 * Citizen Verification workflow: Confirm resolved OR Reopen with auto-escalation
 */
export function verifyComplaintResolution(input: VerifyResolutionInput): {
  complaint: Complaint;
  notification?: any;
} {
  const currentList = getStoredComplaints();
  const index = currentList.findIndex(
    (c) => c.id === input.complaintId || c.complaintId === input.complaintId
  );

  if (index === -1) {
    throw new Error(`Complaint ${input.complaintId} not found`);
  }

  const old = currentList[index];
  const nowIso = new Date().toISOString();

  const feedback: CitizenFeedback = {
    id: `fb-${Date.now()}`,
    complaintId: old.id,
    citizenId: input.citizenId,
    isConfirmedResolved: input.isConfirmedResolved,
    rating: input.rating,
    feedbackText: input.feedbackText,
    reopenReason: input.reopenReason,
    reopenEvidenceUrl: input.reopenEvidenceUrl,
    createdAt: nowIso
  };

  let updatedComplaint: Complaint;
  let notification;

  if (input.isConfirmedResolved) {
    // Confirmed resolved by citizen
    const confirmTimeline: StatusHistoryEvent = {
      id: `tl-${Date.now()}`,
      complaintId: old.id,
      previousStatus: old.status,
      newStatus: 'resolved',
      changedById: input.citizenId,
      actorName: input.citizenName,
      actorRole: 'citizen',
      remarks: `Citizen verified resolution. Rated ${input.rating || 5} Stars: "${input.feedbackText || 'Issue verified and resolved successfully'}"`,
      createdAt: nowIso
    };

    updatedComplaint = {
      ...old,
      status: 'resolved',
      feedback,
      timeline: [...old.timeline, confirmTimeline]
    };
  } else {
    // Reopened by citizen -> Auto-escalate to Level 2 / Level 3
    const newReopenedCount = (old.reopenedCount || 0) + 1;
    const newTimeline: StatusHistoryEvent = {
      id: `tl-${Date.now()}`,
      complaintId: old.id,
      previousStatus: 'resolved',
      newStatus: 'reopened',
      changedById: input.citizenId,
      actorName: input.citizenName,
      actorRole: 'citizen',
      remarks: `Citizen reported issue still exists: "${input.reopenReason}". Auto-escalated to Level 2 Zonal Supervisor.`,
      evidenceUrl: input.reopenEvidenceUrl,
      createdAt: nowIso
    };

    const newEvidence = [...old.evidence];
    if (input.reopenEvidenceUrl) {
      newEvidence.push({
        id: `ev-${Date.now()}`,
        complaintId: old.id,
        mediaUrl: input.reopenEvidenceUrl,
        mediaType: 'image',
        caption: `Reopen evidence: ${input.reopenReason}`,
        stage: 'reopen',
        uploadedById: input.citizenId,
        uploadedByRole: 'citizen',
        uploadedByName: input.citizenName,
        createdAt: nowIso
      });
    }

    updatedComplaint = refreshComplaintSla({
      ...old,
      status: 'reopened',
      reopenedCount: newReopenedCount,
      escalationLevel: newReopenedCount >= 2 ? 'level_3_commissioner' : 'level_2_supervisor',
      resolvedAt: undefined,
      feedback,
      evidence: newEvidence,
      timeline: [...old.timeline, newTimeline]
    });

    if (old.assignedOfficerId) {
      notification = createNotification({
        recipientId: old.assignedOfficerId,
        complaintId: old.id,
        complaintCode: old.complaintId,
        title: `⚠️ Complaint Reopened by Citizen!`,
        message: `Citizen reported issue is NOT resolved: "${input.reopenReason}". Immediate re-inspection required.`,
        type: 'escalation',
        actionUrl: `/track/${old.complaintId}`
      });
    }
  }

  currentList[index] = updatedComplaint;
  saveComplaints(currentList);

  return { complaint: updatedComplaint, notification };
}

/**
 * Reassign complaint to another department or officer (Admins)
 */
export function reassignComplaint(
  complaintId: string,
  departmentId: string,
  officerId?: string,
  officerName?: string,
  adminName: string = 'Municipal Administrator'
): Complaint {
  const currentList = getStoredComplaints();
  const index = currentList.findIndex(
    (c) => c.id === complaintId || c.complaintId === complaintId
  );

  if (index === -1) throw new Error('Complaint not found');

  const old = currentList[index];
  const dept = DEPARTMENTS.find((d) => d.id === departmentId);
  const nowIso = new Date().toISOString();

  const timelineEvent: StatusHistoryEvent = {
    id: `tl-${Date.now()}`,
    complaintId: old.id,
    previousStatus: old.status,
    newStatus: 'assigned',
    actorName: adminName,
    actorRole: 'admin',
    remarks: `Reassigned to department "${dept?.name}"${officerName ? ` (Officer: ${officerName})` : ''}.`,
    departmentName: dept?.name,
    createdAt: nowIso
  };

  const updatedComplaint: Complaint = {
    ...old,
    departmentId: dept?.id,
    departmentName: dept?.name,
    departmentNameTe: dept?.nameTe,
    departmentNameHi: dept?.nameHi,
    assignedOfficerId: officerId,
    assignedOfficerName: officerName,
    status: 'assigned',
    timeline: [...old.timeline, timelineEvent]
  };

  currentList[index] = updatedComplaint;
  saveComplaints(currentList);
  return updatedComplaint;
}
