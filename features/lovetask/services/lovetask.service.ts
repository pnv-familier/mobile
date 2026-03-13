import { apiClient } from '../../../api/api';
import { LoveTasksResponse, LoveTaskDetailResponse } from '../types';

export const loveTaskService = {
  getReceivedTasks: async (): Promise<LoveTasksResponse> => {
    const response = await apiClient.get<LoveTasksResponse>('/api/v1/love-tasks/received');
    return response.data;
  },

  getCreatedTasks: async (): Promise<LoveTasksResponse> => {
    const response = await apiClient.get<LoveTasksResponse>('/api/v1/love-tasks/created');
    return response.data;
  },

  getTaskDetail: async (taskId: number): Promise<LoveTaskDetailResponse> => {
    const response = await apiClient.get<LoveTaskDetailResponse>(`/api/v1/love-tasks/${taskId}`);
    return response.data;
  },

  shareTask: async (taskId: number, postContent: string, imageUrls: string[] = []): Promise<void> => {
    const payload = {
      postContent,
      imageUrls,
    };
    await apiClient.post(`/api/v1/love-tasks/${taskId}/share`, payload);
  },

  completeTask: async (taskId: number): Promise<void> => {
    await apiClient.post(`/api/v1/love-tasks/${taskId}/complete`);
  },

  createTask: async (title: string, description: string, assignedToUserId: string, loveMessage?: string): Promise<void> => {
    const payload = {
      title,
      description,
      assignedToUserId,
      loveMessage: loveMessage || null,
    };
    await apiClient.post('/api/v1/love-tasks', payload);
  },
};
