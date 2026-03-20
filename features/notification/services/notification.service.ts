import { apiClient } from '../../../api/api';
import { Notification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<{ data: Notification[] }>('/api/v1/notifications');
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/api/v1/notifications/read-all');
  },

  removePushToken: async (token: string): Promise<void> => {
    await apiClient.delete('/api/v1/notifications/push-token', { data: { token } });
  },
};
