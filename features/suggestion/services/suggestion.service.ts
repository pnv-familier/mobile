import axios from 'axios';
import { useAuthStore } from '../../auth/store/auth.store';
import { SuggestionListItem, SuggestionDetail, SuggestionStatus } from '../types';

const aiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_AI_API_URL,
  timeout: 60000,
});

aiClient.interceptors.request.use(async (config) => {
  const email = useAuthStore.getState().data?.email;
  if (email) {
    config.headers['X-User-Email'] = email;
  }
  return config;
});

export const suggestionService = {
  getSuggestions: async (status?: SuggestionStatus): Promise<SuggestionListItem[]> => {
    const params = status ? { status } : {};
    const response = await aiClient.get<SuggestionListItem[]>('/ai/suggestions', { params });
    return response.data;
  },

  getSuggestionDetail: async (id: string): Promise<SuggestionDetail> => {
    const response = await aiClient.get<SuggestionDetail>(`/ai/suggestions/${id}`);
    return response.data;
  },

  acceptSuggestion: async (id: string): Promise<SuggestionDetail> => {
    const response = await aiClient.post<SuggestionDetail>(`/ai/suggestions/${id}/accept`);
    return response.data;
  },
};
