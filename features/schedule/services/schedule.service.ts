import { apiClient } from '../../../api/api';
import { FamilyEvent, CreateEventRequest } from '../types';

export const scheduleService = {
  getCalendarEvents: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get<{ message: string; data: { events: FamilyEvent[]; totalEvents: number; message: string } }>('/api/v1/schedule/calendar', { params });
    return response.data.data;
  },

  getEventById: async (eventId: number) => {
    const response = await apiClient.get<{ message: string; data: FamilyEvent }>(`/api/v1/schedule/events/${eventId}`);
    return response.data.data;
  },

  createEvent: async (data: CreateEventRequest) => {
    const response = await apiClient.post<{ message: string; data: FamilyEvent }>('/api/v1/schedule/events', data);
    return response.data.data;
  },

  updateEvent: async (eventId: number, data: CreateEventRequest) => {
    const response = await apiClient.put<{ message: string; data: FamilyEvent }>(`/api/v1/schedule/events/${eventId}`, data);
    return response.data.data;
  },

  deleteEvent: async (eventId: number) => {
    await apiClient.delete(`/api/v1/schedule/events/${eventId}`);
  }
};
