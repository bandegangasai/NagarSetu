import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Complaint, ComplaintStatus, TransparencyStats } from '../types';
import {
  getStoredComplaints,
  createComplaint,
  supportComplaint,
  updateComplaintStatus,
  verifyComplaintResolution,
  reassignComplaint,
  resetComplaintsData,
  CreateComplaintInput
} from '../services/complaintService';
import { calculateTransparencyStats } from '../services/analyticsService';
import { useAuth } from './AuthContext';

interface ComplaintContextType {
  complaints: Complaint[];
  loading: boolean;
  transparencyStats: TransparencyStats;
  getComplaint: (idOrCode: string) => Complaint | undefined;
  submitComplaint: (input: Omit<CreateComplaintInput, 'citizenId' | 'citizenName' | 'citizenPhone'>) => Complaint;
  supportIssue: (id: string) => void;
  updateStatus: (complaintId: string, newStatus: ComplaintStatus, remarks: string, evidencePhotoUrl?: string) => void;
  verifyResolution: (
    complaintId: string,
    isConfirmedResolved: boolean,
    rating?: number,
    feedbackText?: string,
    reopenReason?: string,
    reopenEvidenceUrl?: string
  ) => void;
  reassign: (complaintId: string, departmentId: string, officerId?: string, officerName?: string) => void;
  resetToDefaultData: () => void;
  refresh: () => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(() => {
    setLoading(true);
    const loaded = getStoredComplaints();
    setComplaints(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getComplaint = useCallback(
    (idOrCode: string): Complaint | undefined => {
      const normalized = idOrCode.trim().toLowerCase();
      return complaints.find(
        (c) => c.id.toLowerCase() === normalized || c.complaintId.toLowerCase() === normalized
      );
    },
    [complaints]
  );

  const submitComplaint = useCallback(
    (input: Omit<CreateComplaintInput, 'citizenId' | 'citizenName' | 'citizenPhone'>): Complaint => {
      const created = createComplaint({
        ...input,
        citizenId: currentUser.id,
        citizenName: currentUser.name,
        citizenPhone: currentUser.phone
      });
      setComplaints((prev) => [created, ...prev]);
      return created;
    },
    [currentUser]
  );

  const supportIssue = useCallback((id: string) => {
    const updated = supportComplaint(id);
    if (updated) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    }
  }, []);

  const updateStatus = useCallback(
    (complaintId: string, newStatus: ComplaintStatus, remarks: string, evidencePhotoUrl?: string) => {
      const result = updateComplaintStatus({
        complaintId,
        newStatus,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        remarks,
        evidencePhotoUrl,
        departmentName: currentUser.departmentName
      });

      setComplaints((prev) =>
        prev.map((c) => (c.id === result.complaint.id ? result.complaint : c))
      );
    },
    [currentUser]
  );

  const verifyResolution = useCallback(
    (
      complaintId: string,
      isConfirmedResolved: boolean,
      rating?: number,
      feedbackText?: string,
      reopenReason?: string,
      reopenEvidenceUrl?: string
    ) => {
      const result = verifyComplaintResolution({
        complaintId,
        citizenId: currentUser.id,
        citizenName: currentUser.name,
        isConfirmedResolved,
        rating,
        feedbackText,
        reopenReason,
        reopenEvidenceUrl
      });

      setComplaints((prev) =>
        prev.map((c) => (c.id === result.complaint.id ? result.complaint : c))
      );
    },
    [currentUser]
  );

  const reassign = useCallback(
    (complaintId: string, departmentId: string, officerId?: string, officerName?: string) => {
      const updated = reassignComplaint(
        complaintId,
        departmentId,
        officerId,
        officerName,
        currentUser.name
      );
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    },
    [currentUser]
  );

  const resetToDefaultData = useCallback(() => {
    const fresh = resetComplaintsData();
    setComplaints(fresh);
  }, []);

  const transparencyStats = useMemo(() => {
    return calculateTransparencyStats(complaints);
  }, [complaints]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        transparencyStats,
        getComplaint,
        submitComplaint,
        supportIssue,
        updateStatus,
        verifyResolution,
        reassign,
        resetToDefaultData,
        refresh
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = (): ComplaintContextType => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
