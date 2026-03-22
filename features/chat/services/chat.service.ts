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
      const content = msg.content || '';
      const suggestions = msg.suggestions || [];

      return {
        ...msg,
        content,
        isAi,
        suggestions,
        timestamp: msg.timestamp
      };
    }) as ChatMessageDto[];
  },

  streamChat: async (
    message: string,
    sessionId: string | null,
    onChunk: (chunk: string) => void,
    onSuggestions: (suggestions: string[]) => void,
    onMetadata: (metadata: any) => void,
    onSessionId: (newSessionId: string) => void,
    onMessageId: (messageId: string) => void,
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
      let currentEvent = '';
      let currentData = '';
      let chunkBuffer = '';
      let flushTimeout: any = null;
      let isFirstChunk = true;

      const flush = () => {
        if (chunkBuffer) {
          onChunk(chunkBuffer);
          chunkBuffer = '';
        }
      };

      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          console.log('[STREAM_COMPLETE]');
          onComplete();
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 2) {
          const xSessionId = xhr.getResponseHeader("X-Session-Id");
          if (xSessionId) {
            console.log('[SESSION_ID]', xSessionId);
            onSessionId(xSessionId);
          }
        }

        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const responseText = xhr.responseText;
          const delta = responseText.length - lastIndex;
          
          if (delta > 1000) {
            console.log(`[STREAM_JUMP] responseText jumped by ${delta} characters. Total: ${responseText.length}`);
          }

          const newData = responseText.substring(lastIndex);
          lastIndex = responseText.length;
          buffer += newData;

          let lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line === '') {
              if (currentEvent && currentData) {
                console.log('[SSE_EVENT_RECEIVED]', { event: currentEvent, dataLength: currentData.length });
                
                if (currentData.includes('<suggestion_metadata>') || currentData.includes('<suggestions>')) {
                  console.log('[SSE_TAG_DETECTED] Found suggestion tags in data stream');
                }

                if (currentEvent === 'message') {
                  chunkBuffer += currentData;
                  
                  if (isFirstChunk) {
                    console.log('[STREAM_FIRST_CHUNK] Accelerating first chunk');
                    flush();
                    isFirstChunk = false;
                  } else if (!flushTimeout) {
                    flushTimeout = setTimeout(() => {
                      flush();
                      flushTimeout = null;
                    }, 30);
                  }
                } else if (currentEvent === 'messageId') {
                  console.log('[MESSAGE_ID]', currentData);
                  onMessageId(currentData);
                } else if (currentEvent === 'suggestions') {
                  try {
                    const suggestions = JSON.parse(currentData);
                    if (Array.isArray(suggestions)) {
                      console.log('[SUGGESTIONS_PARSED]', suggestions);
                      onSuggestions(suggestions);
                    }
                  } catch (e) {
                    console.error('[SUGGESTIONS_PARSE_ERROR]', e, currentData);
                  }
                } else if (currentEvent === 'metadata') {
                  try {
                    const metadata = JSON.parse(currentData);
                    console.log('[METADATA_PARSED]', metadata);
                    onMetadata(metadata);
                  } catch (e) {
                    console.error('[METADATA_PARSE_ERROR]', e, currentData);
                  }
                } else if (currentEvent === 'done') {
                  console.log('[STREAM_DONE]');
                  finish();
                  return;
                } else if (currentEvent === 'error') {
                  try {
                    const error = JSON.parse(currentData);
                    console.error('[SSE_ERROR]', error);
                    onError(new Error(error.message || 'Unknown error'));
                  } catch (e) {
                    onError(new Error(currentData));
                  }
                  return;
                }
              }
              
              currentEvent = '';
              currentData = '';
              continue;
            }

            if (line.startsWith('event:')) {
              currentEvent = line.replace(/^event:\s*/, '').trim();
            } else if (line.startsWith('data:')) {
              const dataLine = line.substring(5);
              const content = dataLine.startsWith(' ') ? dataLine.substring(1) : dataLine;
              if (currentData) {
                currentData += '\n' + content;
              } else {
                currentData = content;
              }
            }
          }
        }

        if (xhr.readyState === 4) {
          if (currentEvent && currentData) {
            if (currentEvent === 'message') {
              chunkBuffer += currentData;
              flush();
            } else if (currentEvent === 'messageId') {
              onMessageId(currentData);
            } else if (currentEvent === 'suggestions') {
              try {
                const suggestions = JSON.parse(currentData);
                onSuggestions(suggestions);
              } catch (e) {}
            } else if (currentEvent === 'metadata') {
              try {
                const metadata = JSON.parse(currentData);
                onMetadata(metadata);
              } catch (e) {}
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
