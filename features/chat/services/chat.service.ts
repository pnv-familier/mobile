import { Alert } from "react-native";
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
    return response.data.map(msg => {
      const isAi = msg.isAi === true;
      let content = msg.content || '';
      let suggestions: string[] = [];

      if (isAi && content.includes('<suggestions>')) {
        const match = content.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
        if (match) {
          try {
            suggestions = JSON.parse(match[1]);
          } catch (e) {
            console.error("Failed to parse historical suggestions:", e);
          }
          // Clean the content for display
          content = content.replace(/<suggestions>[\s\S]*?<\/suggestions>/g, '').trim();
        }
      }

      return {
        ...msg,
        content,
        isAi,
        suggestions
      };
    }) as ChatMessageDto[];
  },

  streamChat: async (
    message: string,
    sessionId: string | null,
    onChunk: (chunk: string) => void,
    onSuggestions: (suggestions: string[]) => void,
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

      xhr.onload = () => {
        if (xhr.status >= 400) {
          console.error("Server Returned Error:", xhr.status, xhr.responseText);
          Alert.alert(
            "API Error " + xhr.status,
            `URL: ${url.pathname}\nResponse: ${xhr.responseText.substring(0, 200)}...`
          );
        }
      };

      xhr.onerror = (e) => {
        const debugMsg = `
          Network Error Detail:
          Status: ${xhr.status}
          ReadyState: ${xhr.readyState}
          Response: ${xhr.responseText || 'Empty'}
        `;
        console.error(debugMsg);

        Alert.alert("Connection Failed", debugMsg);

        onError(new Error("Network connection failed."));
      };

      xhr.ontimeout = () => {
        Alert.alert("Timeout", "Request took too long (>60s)");
        onError(new Error("Request timeout"));
      };

      let lastIndex = 0;
      let buffer = '';
      let isFinished = false;
      let fullRawText = '';
      let lastCleanLength = 0;

      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          
          const suggestionsMatch = fullRawText.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
          if (suggestionsMatch) {
            try {
              const suggestions = JSON.parse(suggestionsMatch[1]);
              if (Array.isArray(suggestions)) {
                onSuggestions(suggestions);
              }
            } catch (e) {
              console.error("Failed to parse suggestions:", e);
            }
          }
          
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
              fullRawText += '\n';
            } else {
              const content = line.replace(/^data: ?/, '');
              fullRawText += content;
            }

            const cleanText = fullRawText.replace(/<suggestions>[\s\S]*/g, '');
            const newCleanContent = cleanText.substring(lastCleanLength);
            
            if (newCleanContent.length > 0) {
              onChunk(newCleanContent);
              lastCleanLength = cleanText.length;
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
            fullRawText += content;
            
            const cleanText = fullRawText.replace(/<suggestions>[\s\S]*/g, '');
            const newCleanContent = cleanText.substring(lastCleanLength);
            if (newCleanContent.length > 0) {
              onChunk(newCleanContent);
              lastCleanLength = cleanText.length;
            }
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
