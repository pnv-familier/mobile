import { useState, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import { Notification, NotificationType, NotificationTab } from '../types';

const TAB_TYPES: Record<NotificationTab, NotificationType[]> = {
  ALL: ['POST_COMMENT', 'POST_REACTION', 'LOVE_TASK', 'SCHEDULE', 'AI'],
  POST: ['POST_COMMENT', 'POST_REACTION'],
  AI: ['AI'],
  LOVE_TASK: ['LOVE_TASK'],
  SCHEDULE: ['SCHEDULE'],
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      // Unread first, then sort by newest
      const sorted = [...data].sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotifications(sorted);
    } catch (err: any) {
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const getFiltered = (tab: NotificationTab): Notification[] => {
    const types = TAB_TYPES[tab];
    return notifications.filter(n => types.includes(n.type));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, loading, error, fetchNotifications, markAsRead, getFiltered, unreadCount };
};
