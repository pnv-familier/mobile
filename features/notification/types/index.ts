export type NotificationType = 'POST_COMMENT' | 'POST_REACTION' | 'LOVE_TASK' | 'SCHEDULE' | 'AI' | 'URGENT_SUGGESTION';
export type NotificationTab = 'ALL' | 'POST' | 'AI' | 'LOVE_TASK' | 'SCHEDULE';
export type NotificationStatus = 'READ' | 'UNREAD';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  notified?: boolean;
  createdAt: string;
  referenceId?: string; // postId, taskId, eventId, suggestionId, urgentSuggestionId
}
