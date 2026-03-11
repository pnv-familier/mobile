import { LoveTask, TaskStatus } from "../types";

// TODO: Backend dev - implement these API calls

export const taskService = {
  // Get task details by ID
  getTaskById: async (taskId: string): Promise<LoveTask> => {
    // TODO: Implement API call
    // const response = await api.get(`/tasks/${taskId}`);
    // return response.data;
    throw new Error("Not implemented");
  },

  // Share task to family space (create post)
  shareTask: async (taskId: string, postContent: string): Promise<void> => {
    // TODO: Implement API call
    // await api.post(`/tasks/${taskId}/share`, { content: postContent });
    throw new Error("Not implemented");
  },

  // Complete a love task
  completeTask: async (taskId: string): Promise<void> => {
    // TODO: Implement API call
    // await api.post(`/tasks/${taskId}/complete`);
    throw new Error("Not implemented");
  },

  // Get all tasks for current user
  getUserTasks: async (): Promise<LoveTask[]> => {
    // TODO: Implement API call
    // const response = await api.get('/tasks/my-tasks');
    // return response.data;
    throw new Error("Not implemented");
  }
};
