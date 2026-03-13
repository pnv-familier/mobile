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
      
      const tasksArray = response.data || [];
      setTasks(tasksArray);
      
      // Count tasks by type
      const allReceivedResponse = await loveTaskService.getReceivedTasks();
      const allCreatedResponse = await loveTaskService.getCreatedTasks();
      
      setReceivedCount(allReceivedResponse.data?.length || 0);
      setCreatedCount(allCreatedResponse.data?.length || 0);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load tasks';
      setError(errorMessage);
      setTasks([]);
      setReceivedCount(0);
      setCreatedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [tabType]);

  return { tasks, receivedCount, createdCount, loading, error, refetch: fetchTasks };
};
