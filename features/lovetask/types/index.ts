export interface LoveTask {
  taskId: number;
  title: string;
  description: string;
  status: 'PENDING' | 'SHARED' | 'COMPLETED';
  fromName: string;
  fromAvatar: string;
  loveMessage: string | null;
}

export interface LoveTasksResponse {
  message: string;
  data: {
    receivedCount: number;
    createdCount: number;
    tasks: LoveTask[];
  };
}
