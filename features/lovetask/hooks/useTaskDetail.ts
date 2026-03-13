import { useState, useEffect } from 'react';
import { loveTaskService } from '../services/lovetask.service';
import { LoveTaskDetail } from '../types';

export const useTaskDetail = (taskId: number) => {
  const [task, setTask] = useState<LoveTaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await loveTaskService.getTaskDetail(taskId);
      setTask(response.data);
    } catch (err: any) {
      console.error('Task Detail Error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const shareTask = async (postContent: string, imageUrls: string[] = []) => {
    try {
      await loveTaskService.shareTask(taskId, postContent, imageUrls);
    } catch (err: any) {
      console.error('Share Task Error:', err);
      throw err;
    }
  };

  const completeTask = async () => {
    try {
      await loveTaskService.completeTask(taskId);
    } catch (err: any) {
      console.error('Complete Task Error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return { task, loading, error, shareTask, completeTask, refetch: fetchTask };
};
