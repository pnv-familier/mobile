import { create } from 'zustand';
import { chatService } from '../services/chat.service';
import { ChatMessageDto, ChatSession } from '../types';

const STREAMING_ID = 'active-ai-stream';

const safeConcat = (prev: string, chunk: string) => {
  if (!prev) return chunk;

  const lastChar = prev.slice(-1);
  const firstChar = chunk[0];

  if (
    lastChar !== ' ' &&
    firstChar !== ' ' &&
    /[a-zA-Z]/.test(lastChar) &&
    /[a-zA-Z]/.test(firstChar)
  ) {
    return prev + ' ' + chunk;
  }

  return prev + chunk;
};

interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    messages: ChatMessageDto[];
    isLoading: boolean;
    isSessionsLoading: boolean;
    isLoadingMessages: boolean;
    isStreaming: boolean;
    error: string | null;
    pendingSuggestion: any | null;
    lastUserMessage: string | null;

    fetchSessions: () => Promise<void>;
    selectSession: (sessionId: string) => Promise<void>;
    startNewSession: () => void;
    sendMessage: (content: string, taggedUserEmail?: string) => Promise<void>;
    updateMessageContent: (id: string, chunk: string) => void;
    updateMessageSuggestions: (id: string, suggestions: string[]) => void;
    setPendingSuggestion: (metadata: any) => void;
    clearSuggestions: (messageId: string) => void;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: [],
    currentSessionId: null,
    messages: [],
    isLoading: false,
    isSessionsLoading: false,
    isLoadingMessages: false,
    isStreaming: false,
    error: null,
    pendingSuggestion: null,
    lastUserMessage: null,

    fetchSessions: async () => {
        set({ isSessionsLoading: true, error: null });
        try {
            const sessions = await chatService.getSessions();
            set({ sessions, isSessionsLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch sessions', isSessionsLoading: false });
        }
    },

    selectSession: async (sessionId: string) => {
        set({ isLoadingMessages: true, error: null, currentSessionId: sessionId });
        try {
            const history = await chatService.getSessionHistory(sessionId);
            set({ messages: history, isLoadingMessages: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load chat history', isLoadingMessages: false });
        }
    },

    startNewSession: () => {
        set({ currentSessionId: null, messages: [] });
    },

    updateMessageContent: (id, chunk) => {
        set((state) => {
            const messageIndex = state.messages.findIndex(m => m.id === id);
            if (messageIndex === -1) return state;
            
            const newMessages = [...state.messages];
            const oldContent = newMessages[messageIndex].content;
            
            newMessages[messageIndex] = {
                ...newMessages[messageIndex],
                content: safeConcat(oldContent, chunk)
            };
            
            return { messages: newMessages };
        });
    },

    updateMessageSuggestions: (id, suggestions) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, suggestions } : m
            ),
        }));
    },

    setPendingSuggestion: (metadata) => {
        set({ pendingSuggestion: metadata });
    },

    clearSuggestions: (messageId) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === messageId ? { ...m, suggestions: [] } : m
            ),
        }));
    },

    sendMessage: async (content: string, taggedUserEmail?: string) => {
        const { currentSessionId, messages } = get();
        const timestamp = new Date().toISOString();
        
        const userMessage: ChatMessageDto = {
            id: `user-${Date.now()}`,
            content,
            timestamp,
            isAi: false
        };

        const initialAiMessage: ChatMessageDto = {
            id: STREAMING_ID,
            content: '',
            timestamp,
            isAi: true,
            suggestions: []
        };

        set({ 
            messages: [...messages, userMessage, initialAiMessage],
            isStreaming: true,
            error: null,
            lastUserMessage: content
        });

        await chatService.streamChat(
            content,
            currentSessionId,
            (chunk) => get().updateMessageContent(STREAMING_ID, chunk),
            (suggestions) => get().updateMessageSuggestions(STREAMING_ID, suggestions),
            (metadata) => get().setPendingSuggestion(metadata),
            (newSessionId) => {
                if (!get().currentSessionId) {
                    set({ currentSessionId: newSessionId });
                }
            },
            () => {
                set((state) => ({
                    isStreaming: false,
                    messages: state.messages.map((m) => 
                        m.id === STREAMING_ID ? { ...m, id: `ai-${Date.now()}` } : m
                    )
                }));
                get().fetchSessions();
            },
            (error) => {
                set((state) => ({
                    messages: state.messages.filter((m) => m.id !== STREAMING_ID),
                    error: error.message || 'An error occurred while streaming',
                    isStreaming: false 
                }));
            },
            taggedUserEmail
        );
    },

    clearError: () => set({ error: null }),
}));
