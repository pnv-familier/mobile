import { apiClient } from '../../../api/api';
import { SuggestionListItem, SuggestionDetail, SuggestionStatus } from '../types';

interface ConfirmSuggestionResponse {
  success: boolean;
  suggestionId: string;
  message: string;
}

export const suggestionService = {
  getSuggestions: async (status?: SuggestionStatus): Promise<SuggestionListItem[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<SuggestionListItem[]>('/ai/suggestions', { params });
    return response.data;
  },

  getSuggestionDetail: async (id: string): Promise<SuggestionDetail> => {
    const response = await apiClient.get<SuggestionDetail>(`/ai/suggestions/${id}`);
    return response.data;
  },

  acceptSuggestion: async (id: string): Promise<SuggestionDetail> => {
    const response = await apiClient.post<SuggestionDetail>(`/ai/suggestions/${id}/accept`);
    return response.data;
  },

  confirmSuggestion: async (
    metadata: any,
    sessionId: string,
    triggerContext: string
  ): Promise<ConfirmSuggestionResponse> => {
    try {
      const type = detectType(metadata);

      const requestBody = {
        type,
        payload: {
          type,
          ...metadata
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
};

const detectType = (metadata: any): 'EVENT' | 'TASK' | 'OFFLINE' => {
  if ('startTime' in metadata && 'endTime' in metadata) {
    return 'EVENT';
  }
  if ('assigneeEmail' in metadata && 'title' in metadata) {
    return 'TASK';
  }
  if ('action' in metadata) {
    return 'OFFLINE';
  }
  throw new Error('Unknown metadata type');
};
