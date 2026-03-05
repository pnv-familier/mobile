import { create } from 'zustand';
import { chatService } from '../services/chat.service';
import { ChatMessageDto, ChatSession } from '../types';

const STREAMING_ID = 'active-ai-stream';

interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    messages: ChatMessageDto[];
    isLoading: boolean;
    isSessionsLoading: boolean;
    isLoadingMessages: boolean;
    isStreaming: boolean;
    error: string | null;

    fetchSessions: () => Promise<void>;
    selectSession: (sessionId: string) => Promise<void>;
    startNewSession: () => void;
    sendMessage: (content: string) => Promise<void>;
    updateMessageContent: (id: string, chunk: string) => void;
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
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, content: m.content + chunk } : m
            ),
        }));
    },

    sendMessage: async (content: string) => {
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
            isAi: true
        };

        set({ 
            messages: [...messages, userMessage, initialAiMessage],
            isStreaming: true,
            error: null 
        });

        await chatService.streamChat(
            content,
            currentSessionId,
            (chunk) => get().updateMessageContent(STREAMING_ID, chunk),
            (newSessionId) => {
                if (!get().currentSessionId) {
                    set({ currentSessionId: newSessionId });
                    get().fetchSessions();
                }
            },
            () => {
                set((state) => ({
                    isStreaming: false,
                    messages: state.messages.map((m) => 
                        m.id === STREAMING_ID ? { ...m, id: `ai-${Date.now()}` } : m
                    )
                }));
            },
            (error) => {
                set((state) => ({
                    messages: state.messages.filter((m) => m.id !== STREAMING_ID),
                    error: error.message || 'An error occurred while streaming',
                    isStreaming: false 
                }));
            }
        );
    },

    clearError: () => set({ error: null }),
}));
