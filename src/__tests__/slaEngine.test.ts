import { describe, it, expect } from 'vitest';
import { calculateSla, getSlaDisplayText } from '../services/slaEngine';
import { Complaint } from '../types';

describe('SLA Engine & Escalation System', () => {
  it('should calculate standard SLA deadline accurately for 1-day categories', () => {
    const createdAt = new Date().toISOString();
    const garbageCatId = 'c1000000-0000-0000-0000-000000000001'; // Garbage (1 Day SLA)

    const result = calculateSla(garbageCatId, createdAt, 'submitted', 0, 'high');

    expect(result.isOverdue).toBe(false);
    expect(result.overdueDays).toBe(0);
    expect(result.escalationLevel).toBe('level_1_officer');
    expect(result.hoursRemaining).toBeGreaterThanOrEqual(23);
  });

  it('should detect overdue complaints and auto-escalate to Level 2 Supervisor', () => {
    // Created 2 days ago for a 1-day SLA category (overdue by 1 day)
    const createdAt = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    const garbageCatId = 'c1000000-0000-0000-0000-000000000001';

    const result = calculateSla(garbageCatId, createdAt, 'in_progress', 0, 'high');

    expect(result.isOverdue).toBe(true);
    expect(result.overdueDays).toBeGreaterThanOrEqual(1);
    expect(result.escalationLevel).toBe('level_2_supervisor');
  });

  it('should escalate to Level 3 Commissioner if complaint is critical or reopened twice', () => {
    const createdAt = new Date().toISOString();
    const manholeCatId = 'c1000000-0000-0000-0000-000000000005'; // Open Manhole (Critical Hazard)

    const resultCritical = calculateSla(manholeCatId, createdAt, 'submitted', 0, 'critical');
    expect(resultCritical.escalationLevel).toBe('level_3_commissioner');

    const resultReopenedTwice = calculateSla('c1000000-0000-0000-0000-000000000002', createdAt, 'reopened', 2, 'medium');
    expect(resultReopenedTwice.escalationLevel).toBe('level_3_commissioner');
  });

  it('should format human-readable display text for overdue complaints', () => {
    const mockComplaint: Partial<Complaint> = {
      status: 'in_progress',
      isOverdue: true,
      overdueDays: 2,
      slaDeadline: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
    };

    const displayText = getSlaDisplayText(mockComplaint as Complaint);
    expect(displayText.isOverdue).toBe(true);
    expect(displayText.text).toContain('OVERDUE BY 2 DAYS');
  });
});
