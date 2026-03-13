import { useState } from 'react';
import { loveTaskService } from '../services/lovetask.service';

export const useCreateLoveTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (title: string, description: string, assignedToUserId: string, loveMessage?: string) => {
    try {
      setLoading(true);
      setError(null);
      await loveTaskService.createTask(title, description, assignedToUserId, loveMessage);
    } catch (err: any) {
      console.error('Create Task Error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading, error };
};
