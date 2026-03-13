import { apiClient } from '../../../api/api';
import { LoveTasksResponse } from '../types';

export const loveTaskService = {
  getReceivedTasks: async (): Promise<LoveTasksResponse> => {
    try {
      const response = await apiClient.get<LoveTasksResponse>('/api/love-tasks/received');
      return response.data;
    } catch (error) {
      console.warn('Love Task API not available, using mock data');
      return {
        message: 'Mock data',
        data: {
          receivedCount: 0,
          createdCount: 0,
          tasks: []
        }
      };
    }
  },

  getCreatedTasks: async (): Promise<LoveTasksResponse> => {
    try {
      const response = await apiClient.get<LoveTasksResponse>('/api/love-tasks/created');
      return response.data;
    } catch (error) {
      console.warn('Love Task API not available, using mock data');
      return {
        message: 'Mock data',
        data: {
          receivedCount: 0,
          createdCount: 0,
          tasks: []
        }
      };
    }
  },
};
