export interface ChatSession {
  id: string;
  userId: string;
  target_context: string;
  createdAt: string;
}

export interface ChatMessageDto {
  id: string;
  content: string;
  timestamp: string;
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
