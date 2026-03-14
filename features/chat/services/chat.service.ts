import { Alert } from "react-native";
import { apiClient, apiUrl } from "../../../api/api";
import { ChatMessageDto, ChatSession, FamilyMember } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "/ai";

export const chatService = {
  getFamilyMembersForMention: async (): Promise<FamilyMember[]> => {
    try {
      const response = await apiClient.get<{ data: { members: FamilyMember[] } }>(
        "/api/v1/families/members-for-mention"
      );
      return response.data.data.members;
    } catch (error) {
      console.error("Failed to fetch family members for mention:", error);
      throw error;
    }
  },
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
          content = content.replace(/<suggestions>[\s\S]*?<\/suggestions>/g, '').trim();
        }
      }

      return {
        ...msg,
        content,
        isAi,
        suggestions,
        timestamp: msg.timestamp // ISO-8601 format from backend
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
    onError: (error: any) => void,
    taggedUserEmail?: string
  ) => {
    try {
      const baseUrl = apiUrl;
      const url = new URL(`${baseUrl}${API_BASE}/chat`);
      url.searchParams.append("message", message);
      if (sessionId) {
        url.searchParams.append("sessionId", sessionId);
      }
      if (taggedUserEmail) {
        url.searchParams.append("taggedUserEmail", taggedUserEmail);
      }

      const token = await AsyncStorage.getItem("accessToken");
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url.toString());
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Accept', 'text/event-stream');

      xhr.onload = () => {
        if (xhr.status >= 400) {
          const errorDetail = `Status: ${xhr.status}, Response: ${xhr.responseText.substring(0, 100)}`;
          console.error("Server Error:", errorDetail);
          onError(new Error(errorDetail));
        }
      };

      xhr.onerror = () => {
        const errorDetail = `Status: ${xhr.status}, ReadyState: ${xhr.readyState}, Response: ${xhr.responseText.substring(0, 50)}`;
        console.error("Network Error:", errorDetail);
        onError(new Error(errorDetail));
      };

      xhr.ontimeout = () => {
        const errorDetail = "Request timeout (>60s)";
        console.error(errorDetail);
        onError(new Error(errorDetail));
      };

      let lastIndex = 0;
      let buffer = '';
      let isFinished = false;
      let fullRawText = '';
      let lastCleanLength = 0;
      let chunkCount = 0;
      let totalChunkSize = 0;
      const chunkLog: Array<{ size: number; preview: string }> = [];

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
          
          console.log('[STREAM_LOG]', {
            totalChunks: chunkCount,
            totalSize: totalChunkSize,
            avgChunkSize: chunkCount > 0 ? Math.round(totalChunkSize / chunkCount) : 0,
            isGradual: chunkCount > 1,
            deliveryPattern: chunkCount === 1 ? 'BLOCK' : 'GRADUAL',
            chunks: chunkLog
          });
          
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
              chunkCount++;
              totalChunkSize += newCleanContent.length;
              chunkLog.push({ 
                size: newCleanContent.length, 
                preview: newCleanContent.substring(0, 50) 
              });
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
              chunkCount++;
              totalChunkSize += newCleanContent.length;
              chunkLog.push({ 
                size: newCleanContent.length, 
                preview: newCleanContent.substring(0, 50) 
              });
              onChunk(newCleanContent);
              lastCleanLength = cleanText.length;
            }
          }
          finish();
        }
      };

      xhr.send();
      
      return { abort: () => xhr.abort() };
    } catch (error) {
      onError(error);
    }
  },
};
