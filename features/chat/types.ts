import { InstantString } from '../../types/instant';

export interface ChatSession {
  id: string;
  userId: string;
  targetContext: string;
  createdAt: InstantString;
}

export interface ChatMessageDto {
  id: string;
  content: string;
  timestamp: InstantString;
  isAi: boolean;
  suggestions?: string[];
}

export interface StreamingChatResponse {
  sessionId: string;
  chunk: string;
}

export interface FamilyMember {
  email: string;
  fullName: string;
}
