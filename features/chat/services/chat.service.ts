import { apiClient } from "../../../api/api";
import { ChatMessageDto, ChatSession } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "/ai";

export const chatService = {
  getSessions: async (page = 0, size = 10) => {
    const response = await apiClient.get<ChatSession[]>(`${API_BASE}/sessions`, {
      params: { page, size },
    });
    return response.data;
  },

  getSessionHistory: async (sessionId: string) => {
    const response = await apiClient.get<any[]>(`${API_BASE}/history/${sessionId}`);
    return response.data.map(msg => ({
      ...msg,
      isAi: msg.isAi === true
    })) as ChatMessageDto[];
  },

  streamChat: async (
    message: string,
    sessionId: string | null,
    onChunk: (chunk: string) => void,
    onSessionId: (newSessionId: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
  ) => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;
      const url = new URL(`${baseUrl}${API_BASE}/chat`);
      url.searchParams.append("message", message);
      if (sessionId) {
        url.searchParams.append("sessionId", sessionId);
      }

      const token = await AsyncStorage.getItem("accessToken");
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url.toString());
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Accept', 'text/event-stream');

      let lastIndex = 0;
      let buffer = '';
      let isFinished = false;

      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          onComplete();
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 2) {
          const xSessionId = xhr.getResponseHeader("X-Session-Id");
          if (xSessionId) onSessionId(xSessionId);
        }

        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const responseText = xhr.responseText;
          const newData = responseText.substring(lastIndex);
          lastIndex = responseText.length;
          buffer += newData;

          let lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;

            if (line === 'data:[DONE.]' || line === 'data: [DONE.]') {
              finish();
              return;
            }

            if (line === 'data:' || line === 'data: ') {
              onChunk('\n');
              continue;
            }

            const content = line.replace(/^data: ?/, '');
            
            if (content.length > 0) {
              onChunk(content);
            }
          }
        }

        if (xhr.readyState === 4) {
          if (buffer.startsWith('data:')) {
            if (buffer.includes('[DONE.]')) {
              finish();
              return;
            }
            const content = buffer.replace(/^data: ?/, '');
            if (content.length > 0) onChunk(content);
          }
          finish();
        }
      };

      xhr.onerror = () => onError(new Error("Network connection failed."));
      xhr.send();
    } catch (error) {
      onError(error);
    }
  },
};
