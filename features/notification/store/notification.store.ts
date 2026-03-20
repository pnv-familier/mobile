import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  reset: () => void;
  banner: { title: string; body: string; time?: string } | null;
  showBanner: (data: { title: string; body: string; time?: string }) => void;
  clearBanner: () => void;
  openPostId: string | null;
  setOpenPostId: (id: string | null) => void;
  openEventId: string | null;
  setOpenEventId: (id: string | null) => void;
  notifications: any[];
  setNotifications: (data: any[]) => void;
  updateNotificationRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  reset: () => set({ unreadCount: 0, banner: null, openPostId: null, notifications: [] }),
  banner: null,
  showBanner: (data) => set({ banner: data }),
  clearBanner: () => set({ banner: null }),
  openPostId: null,
  setOpenPostId: (id) => set({ openPostId: id }),
  openEventId: null,
  setOpenEventId: (id) => set({ openEventId: id }),
  notifications: [],
  setNotifications: (data) => set({ notifications: data }),
  updateNotificationRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    set({
      notifications: updated,
      unreadCount: updated.filter((n: any) => !n.isRead).length,
    });
  },
}));
