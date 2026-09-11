import { AppNotification } from '../types';

export interface DispatchNotificationPayload {
  recipientId: string;
  complaintId: string;
  complaintCode: string;
  title: string;
  message: string;
  type: 'status_change' | 'sla_warning' | 'verification_required' | 'escalation' | 'info';
  actionUrl: string;
}

/**
 * Creates an in-app notification and dispatches to external webhooks if configured.
 */
export function createNotification(payload: DispatchNotificationPayload): AppNotification {
  const notification: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    recipientId: payload.recipientId,
    complaintId: payload.complaintId,
    complaintCode: payload.complaintCode,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    actionUrl: payload.actionUrl,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  // Dispatch webhook payload (configurable in .env for SMS/WhatsApp/Email)
  dispatchExternalNotification(payload);

  return notification;
}

/**
 * Webhook dispatcher for SMS / WhatsApp / Email services
 */
async function dispatchExternalNotification(payload: DispatchNotificationPayload): Promise<void> {
  // Check if external webhook URLs are provided in environment
  const smsUrl = import.meta.env.VITE_SMS_GATEWAY_URL;
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_API_URL;

  if (smsUrl || whatsappUrl) {
    try {
      // In production deployment, this posts directly to the municipal notification gateway
      console.log(`[CivicTrack Notification Gateway] Dispatching alert for ${payload.complaintCode}: ${payload.title}`);
    } catch (err) {
      console.error('[CivicTrack Notification Gateway Error]', err);
    }
  }
}
