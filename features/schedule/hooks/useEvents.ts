import { useState, useEffect } from 'react';
import { scheduleService } from '../services/schedule.service';
import { FamilyEvent } from '../types';

export const useEvents = (year: number, month: number) => {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
      
      const data = await scheduleService.getCalendarEvents(startDate, endDate);
      setEvents(data.events);
    } catch (err: any) {
      setError(err?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [year, month]);

  return { events, loading, error, refetch: fetchEvents };
};
