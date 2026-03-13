import { useState, useEffect } from 'react';
import { loveTaskService } from '../services/lovetask.service';
import { LoveTask } from '../types';

export const useLoveTasks = (tabType: 'received' | 'created') => {
  const [tasks, setTasks] = useState<LoveTask[]>([]);
  const [receivedCount, setReceivedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = tabType === 'received' 
        ? await loveTaskService.getReceivedTasks()
        : await loveTaskService.getCreatedTasks();
      
      setTasks(response.data.tasks);
      setReceivedCount(response.data.receivedCount);
      setCreatedCount(response.data.createdCount);
    } catch (err: any) {
      console.error('Love Task Error:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [tabType]);

  return { tasks, receivedCount, createdCount, loading, error, refetch: fetchTasks };
};
