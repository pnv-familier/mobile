export type NotificationType = 'POST_COMMENT' | 'POST_REACTION' | 'LOVE_TASK' | 'SCHEDULE' | 'AI';
export type NotificationTab = 'ALL' | 'POST' | 'AI' | 'LOVE_TASK' | 'SCHEDULE';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string; // postId, taskId, eventId, suggestionId
}
