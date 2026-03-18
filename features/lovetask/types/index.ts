export interface LoveTask {
  taskId: number;
  title: string;
  description: string;
  status: 'PENDING' | 'SHARED' | 'COMPLETED';
  sender: {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
  };
  assignee: {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
  };
  loveMessage: string | null;
  sharedPostId: number | null;
  createdAt: string;
  completedAt: string | null;
  canShare: boolean;
  canComplete: boolean;
  reminderMessage: string | null;
}

export interface LoveTaskDetail extends LoveTask {
  assignedToUserId: string;
  createdByUserId: string;
}

export interface LoveTasksResponse {
  message: string;
  data: LoveTask[];
}

export interface LoveTaskDetailResponse {
  message: string;
  data: LoveTaskDetail;
}
