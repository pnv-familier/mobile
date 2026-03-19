import { apiClient } from '../../../api/api';
import { useAuthStore } from '../../auth/store/auth.store';

interface ReportRequest {
  reason: string;
}

interface ReportResponse {
  id: string;
  reason: string;
  reporterEmail: string;
  reportedAt: string;
}

export const reportService = {
  reportMessage: async (data: ReportRequest): Promise<ReportResponse> => {
    const userEmail = useAuthStore.getState().data?.email;
    
    const response = await apiClient.post<ReportResponse>('/ai/reports', data, {
      headers: {
        'X-User-Email': userEmail,
      },
    });
    
    return response.data;
  },
};
