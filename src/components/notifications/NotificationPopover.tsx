import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/formatters';

export const NotificationPopover: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification_required':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'sla_warning':
      case 'escalation':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-civic-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-civic-100 text-civic-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-civic-700 hover:text-civic-900 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-slate-400 hover:text-rose-600"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 transition-colors hover:bg-slate-50 flex items-start gap-3 cursor-pointer ${
                    !notif.isRead ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-civic-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTimeAgo(notif.createdAt)}
                      </span>
                      {notif.actionUrl && (
                        <Link
                          to={notif.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="text-civic-700 font-semibold hover:underline"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
