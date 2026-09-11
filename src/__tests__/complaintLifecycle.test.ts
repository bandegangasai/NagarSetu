import { describe, it, expect, beforeEach } from 'vitest';
import {
  createComplaint,
  updateComplaintStatus,
  verifyComplaintResolution,
  supportComplaint,
  getStoredComplaints,
  resetComplaintsData
} from '../services/complaintService';

describe('Complaint Lifecycle & State Machine', () => {
  beforeEach(() => {
    resetComplaintsData();
  });

  it('should generate unique complaint ID matching NAG-YYYY-NNNNNN format', () => {
    const complaint = createComplaint({
      title: 'Water logging near signal',
      description: 'Stagnant rainwater causing traffic blockage.',
      categoryId: 'c1000000-0000-0000-0000-000000000004',
      locationAddress: 'Madhapur Main Road',
      city: 'Hyderabad',
      latitude: 17.4483,
      longitude: 78.3915,
      isAnonymous: false,
      citizenId: 'test-citizen-1',
      citizenName: 'Test Citizen'
    });

    expect(complaint.complaintId).toMatch(/^NAG-\d{4}-\d{6}$/);
    expect(complaint.status).toBe('submitted');
    expect(complaint.timeline.length).toBe(1);
    expect(complaint.timeline[0].newStatus).toBe('submitted');
  });

  it('should allow officer to update status and record audit timeline', () => {
    const initialList = getStoredComplaints();
    const target = initialList[0];

    const { complaint } = updateComplaintStatus({
      complaintId: target.id,
      newStatus: 'in_progress',
      actorId: 'test-officer-1',
      actorName: 'Er. Rajesh Patel',
      actorRole: 'officer',
      remarks: 'Inspection completed, material dispatched.',
      evidencePhotoUrl: 'https://example.com/inspection.jpg'
    });

    expect(complaint.status).toBe('in_progress');
    const lastTimeline = complaint.timeline[complaint.timeline.length - 1];
    expect(lastTimeline.newStatus).toBe('in_progress');
    expect(lastTimeline.actorName).toBe('Er. Rajesh Patel');
    expect(lastTimeline.remarks).toContain('Inspection completed');
  });

  it('should auto-escalate complaint to Level 2 Supervisor when citizen reopens it', () => {
    const initialList = getStoredComplaints();
    const target = initialList[0];

    // Citizen reopens with reason
    const { complaint } = verifyComplaintResolution({
      complaintId: target.id,
      citizenId: 'test-citizen-1',
      citizenName: 'Ramesh Kumar',
      isConfirmedResolved: false,
      reopenReason: 'Pothole patch broke again in rain',
      reopenEvidenceUrl: 'https://example.com/reopen.jpg'
    });

    expect(complaint.status).toBe('reopened');
    expect(complaint.reopenedCount).toBe(1);
    expect(complaint.escalationLevel).toBe('level_2_supervisor');
    expect(complaint.feedback?.isConfirmedResolved).toBe(false);
  });

  it('should toggle support (+1 Me Too) count on a complaint', () => {
    const initialList = getStoredComplaints();
    const target = initialList[0];
    const initialCount = target.supportersCount;

    const supported = supportComplaint(target.id);
    expect(supported?.supportersCount).toBe(initialCount + 1);
    expect(supported?.supportedByMe).toBe(true);

    const unSupported = supportComplaint(target.id);
    expect(unSupported?.supportersCount).toBe(initialCount);
    expect(unSupported?.supportedByMe).toBe(false);
  });
});
