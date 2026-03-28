export type UrgentSuggestionSubType = 
  | 'EMOTIONAL_SUPPORT' 
  | 'SOCIAL_ISOLATION' 
  | 'POSITIVE_MILESTONE' 
  | 'STRONG_NEGATIVE_EMOTION';

export interface UrgentSuggestion {
  id: string;
  senderName: string;
  emotion: string;
  context: string;
  subType: UrgentSuggestionSubType;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UrgentSuggestionUIConfig {
  icon: string;
  color: string;
  actionText: string;
}

export const URGENT_SUGGESTION_CONFIG: Record<UrgentSuggestionSubType, UrgentSuggestionUIConfig> = {
  EMOTIONAL_SUPPORT: {
    icon: '💙',
    color: '#64B5F6',
    actionText: 'Gửi lời động viên',
  },
  SOCIAL_ISOLATION: {
    icon: '🏠',
    color: '#FF9800',
    actionText: 'Rủ về nhà / gọi điện',
  },
  POSITIVE_MILESTONE: {
    icon: '🎉',
    color: '#66BB6A',
    actionText: 'Chúc mừng họ',
  },
  STRONG_NEGATIVE_EMOTION: {
    icon: '❤️',
    color: '#EF5350',
    actionText: 'Lắng nghe họ',
  },
};
