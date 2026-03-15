export type SuggestionType = 'TASK' | 'EVENT' | 'OFFLINE';
export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface SuggestionListItem {
  id: string;
  title: string;
  description: string;
  type: SuggestionType;
  status: SuggestionStatus;
  createdAt: string;
}

export interface TaskPayload {
  type: 'TASK';
  assigneeEmail: string;
  title: string;
  description: string;
}

export interface EventPayload {
  type: 'EVENT';
  title: string;
  startTime: string;
  endTime: string;
  date: number;
  month: number;
  year: number;
  location: string;
}

export interface OfflinePayload {
  type: 'OFFLINE';
  action: string;
}

export type SuggestionPayload = TaskPayload | EventPayload | OfflinePayload;

export interface SuggestionDetail {
  id: string;
  title: string;
  description: string;
  triggerContext: string;
  type: SuggestionType;
  status: SuggestionStatus;
  payload: SuggestionPayload;
  createdAt: string;
  expiredAt: string;
}
