import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AppNotification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: AppNotification) => void;
  clearAll: () => void;
}

const NOTIFICATIONS_STORAGE_KEY = 'civictrack_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    recipientId: 'u1000000-0000-0000-0000-000000000001',
    complaintId: 'a1000000-0000-0000-0000-000000000001',
    complaintCode: 'CIV-2026-000123',
    title: 'Work in Progress',
    message: 'Er. K. V. Subbarao inspected your road repair complaint and ordered asphalt mix.',
    type: 'status_change',
    actionUrl: '/track/CIV-2026-000123',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString()
  },
  {
    id: 'n-2',
    recipientId: 'u1000000-0000-0000-0000-000000000003',
    complaintId: 'a1000000-0000-0000-0000-000000000003',
    complaintCode: 'CIV-2026-000125',
    title: 'Complaint Resolved — Please Verify',
    message: 'Street lights on 80 Feet Road have been repaired. Please inspect and confirm resolution.',
    type: 'verification_required',
    actionUrl: '/track/CIV-2026-000125',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString()
  },
  {
    id: 'n-3',
    recipientId: 'u2000000-0000-0000-0000-000000000001',
    complaintId: 'a1000000-0000-0000-0000-000000000002',
    complaintCode: 'CIV-2026-000124',
    title: 'SLA Overdue Warning',
    message: 'Madhapur Market Garbage complaint has exceeded the 24-hour SLA. Immediate action required.',
    type: 'sla_warning',
    actionUrl: '/officer',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }, [allNotifications]);

  // Filter for notifications belonging to current user or global alerts
  const userNotifications = useMemo(() => {
    return allNotifications.filter(
      (n) => n.recipientId === currentUser.id || currentUser.role === 'admin'
    );
  }, [allNotifications, currentUser]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter((n) => !n.isRead).length;
  }, [userNotifications]);

  const markAsRead = useCallback((id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAllNotifications((prev) =>
      prev.map((n) =>
        n.recipientId === currentUser.id || currentUser.role === 'admin'
          ? { ...n, isRead: true }
          : n
      )
    );
  }, [currentUser]);

  const addNotification = useCallback((notification: AppNotification) => {
    setAllNotifications((prev) => [notification, ...prev]);
  }, []);

  const clearAll = useCallback(() => {
    setAllNotifications((prev) =>
      prev.filter((n) => n.recipientId !== currentUser.id && currentUser.role !== 'admin')
    );
  }, [currentUser]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
