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
    activeStreamingId: string | null;
    error: string | null;
    pendingSuggestion: any | null;
    lastUserMessage: string | null;

    fetchSessions: () => Promise<void>;
    selectSession: (sessionId: string) => Promise<void>;
    startNewSession: () => void;
    sendMessage: (content: string, taggedUserEmail?: string) => Promise<void>;
    updateMessageContent: (id: string, chunk: string) => void;
    updateMessageId: (tempId: string, backendId: string) => void;
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
    activeStreamingId: null,
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
                content: oldContent + chunk
            };
            
            return { messages: newMessages };
        });
    },

    updateMessageId: (tempId, backendId) => {
        console.log('[STORE] updateMessageId called:', { tempId, backendId });
        set((state) => {
            const hasMessage = state.messages.some(m => m.id === tempId);
            if (!hasMessage) {
                console.warn('[STORE] Message with tempId not found:', tempId);
                return state;
            }
            return {
                activeStreamingId: state.activeStreamingId === tempId ? backendId : state.activeStreamingId,
                messages: state.messages.map((m) =>
                    m.id === tempId ? { ...m, id: backendId } : m
                ),
            };
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

        const tempAiId = `ai-temp-${Date.now()}`;
        let activeMessageId = tempAiId;

        const initialAiMessage: ChatMessageDto = {
            id: tempAiId,
            content: '',
            timestamp,
            isAi: true,
            suggestions: []
        };

        set({ 
            messages: [...messages, userMessage, initialAiMessage],
            isStreaming: true,
            activeStreamingId: tempAiId,
            error: null,
            lastUserMessage: content
        });

        await chatService.streamChat(
            content,
            currentSessionId,
            (chunk) => get().updateMessageContent(activeMessageId, chunk),
            (suggestions) => get().updateMessageSuggestions(activeMessageId, suggestions),
            (metadata) => get().setPendingSuggestion(metadata),
            (newSessionId) => {
                if (!get().currentSessionId) {
                    set({ currentSessionId: newSessionId });
                }
            },
            (messageId) => {
                console.log('[STORE] Received messageId from service:', messageId);
                const backendId = messageId.trim();
                if (backendId) {
                    get().updateMessageId(activeMessageId, backendId);
                    activeMessageId = backendId;
                }
            },
            () => {
                set({ isStreaming: false, activeStreamingId: null });
                get().fetchSessions();
            },
            (error) => {
                set((state) => ({
                    messages: state.messages.filter((m) => m.id !== activeMessageId),
                    error: error.message || 'An error occurred while streaming',
                    isStreaming: false,
                    activeStreamingId: null
                }));
            },
            taggedUserEmail
        );
    },

    clearError: () => set({ error: null }),
}));
