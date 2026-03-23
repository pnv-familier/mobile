import { apiClient } from '../../../api/api';
import { useAuthStore } from '../../auth/store/auth.store';

export enum FeedbackType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  REPORT = 'REPORT',
}

interface FeedbackRequest {
  type: FeedbackType;
  reason?: string;
}

interface FeedbackResponse {
  id: string;
  type: FeedbackType;
  reason: string | null;
  reporterEmail: string;
  reportedAt: string;
}

export const feedbackService = {
  submitFeedback: async (type: FeedbackType, reason?: string): Promise<FeedbackResponse> => {
    const data: FeedbackRequest = { type };
    if (reason) {
      data.reason = reason;
    }
    
    const response = await apiClient.post<FeedbackResponse>('/ai/feedback', data);
    return response.data;
  },
};
