import { useState, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import { Notification, NotificationType, NotificationTab } from '../types';
import { useNotificationStore } from '../store/notification.store';

const TAB_TYPES: Record<NotificationTab, NotificationType[]> = {
  ALL: ['POST_COMMENT', 'POST_REACTION', 'LOVE_TASK', 'SCHEDULE', 'AI'],
  POST: ['POST_COMMENT', 'POST_REACTION'],
  AI: ['AI'],
  LOVE_TASK: ['LOVE_TASK'],
  SCHEDULE: ['SCHEDULE'],
};

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useNotificationStore(s => s.notifications);
  const setNotifications = useNotificationStore(s => s.setNotifications);
  const setUnreadCount = useNotificationStore(s => s.setUnreadCount);
  const updateNotificationRead = useNotificationStore(s => s.updateNotificationRead);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      const sorted = [...data].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'READ' ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotifications(sorted);
      setUnreadCount(sorted.filter(n => n.status === 'UNREAD').length);
    } catch (err: any) {
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    updateNotificationRead(id);
    notificationService.markAsRead(id).catch(() => {});
  };

  const getFiltered = (tab: NotificationTab): Notification[] => {
    const types = TAB_TYPES[tab];
    return (notifications as Notification[]).filter(n => types.includes(n.type));
  };

  return { notifications, loading, error, fetchNotifications, markAsRead, getFiltered };
};
