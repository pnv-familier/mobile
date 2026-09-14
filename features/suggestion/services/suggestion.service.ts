import { apiClient } from '../../../api/api';
import { SuggestionListItem, SuggestionDetail, SuggestionStatus } from '../types';
import { UrgentSuggestion } from '../types/urgent';

interface ConfirmSuggestionResponse {
  success: boolean;
  suggestionId: string;
  message: string;
}

export const suggestionService = {
  getSuggestions: async (status?: SuggestionStatus): Promise<SuggestionListItem[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<any>('/ai/suggestions', { params });
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    return [];
  },

  getSuggestionDetail: async (id: string): Promise<SuggestionDetail> => {
    const response = await apiClient.get<any>(`/ai/suggestions/${id}`);
    return response.data?.data || response.data;
  },

  acceptSuggestion: async (id: string): Promise<SuggestionDetail> => {
    const response = await apiClient.post<any>(`/ai/suggestions/${id}/accept`);
    return response.data?.data || response.data;
  },

  confirmSuggestion: async (
    metadata: any,
    sessionId: string,
    triggerContext: string
  ): Promise<ConfirmSuggestionResponse> => {
    try {
      const type = metadata.type || metadata.payload?.type;
      const payloadContent = metadata.payload || metadata;

      const requestBody = {
        type,
        payload: {
          type,
          ...payloadContent,
        },
        sessionId,
        triggerContext,
      };

      const response = await apiClient.post<ConfirmSuggestionResponse>(
        '/ai/suggestions/confirm',
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error('Failed to confirm suggestion:', error);
      throw error;
    }
  },

  getUrgentSuggestions: async (): Promise<UrgentSuggestion[]> => {
    const response = await apiClient.get<{ message: string; data: UrgentSuggestion[] }>(
      '/api/v1/suggestions/urgent'
    );
    return response.data.data;
  },

  markUrgentAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/suggestions/urgent/${id}/read`);
  },

  markAllUrgentAsRead: async (): Promise<void> => {
    await apiClient.patch('/api/v1/suggestions/urgent/read-all');
  },

  getUrgentSuggestionById: async (id: string): Promise<UrgentSuggestion> => {
    const response = await apiClient.get<{ message: string; data: UrgentSuggestion }>(
      `/api/v1/suggestions/urgent/${id}`
    );
    return response.data.data;
  },
};

