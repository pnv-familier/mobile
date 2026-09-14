import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../../../api/api";
import { saveTokens } from "../../auth/utils/token";
import { useAuthStore } from "../../auth/store/auth.store";

class UrgentSuggestionWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000; // 1s
  private maxReconnectDelay = 30000; // 30s
  private pingInterval = 25000; // 25s heartbeat
  private pongTimeout = 10000; // 10s
  private isIntentionallyClosed = false;
  private isRefreshingToken = false;
  private token: string | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  connect(token: string, onMessage: (data: any) => void, onError?: (error: any) => void) {
    this.token = token;
    this.onMessageCallback = onMessage;
    this.onErrorCallback = onError || null;
    this.isIntentionallyClosed = false;

    // Clean up any existing active connection
    if (this.ws) {
      this.stopPingInterval();
      this.ws.close();
      this.ws = null;
    }

    const wsUrl = this.getWebSocketUrl();
    
    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = event.data;
          
          if (data === 'pong') {
            this.clearPongTimeout();
            return;
          }
          
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          onMessage(parsed);
        } catch (error) {
          console.error('[UrgentSuggestion WS] Parse error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[UrgentSuggestion WS] Error:', error);
        onError?.(error);
      };

      this.ws.onclose = (event) => {
        this.stopPingInterval();
        this.ws = null;

        if (this.isIntentionallyClosed) {
          return;
        }

        // Close Code 4001: Invalid / Expired Token (or 1008 Policy Violation / reason 401)
        if (event.code === 4001 || (event.code === 1006 && event.reason?.includes('401')) || event.code === 1008) {
          this.handleTokenExpiredAndReconnect();
          return;
        }

        if (event.code === 1002) {
          this.isIntentionallyClosed = true;
          return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('[UrgentSuggestion WS] Connection error:', error);
      onError?.(error);
    }
  }

  private async handleTokenExpiredAndReconnect() {
    if (this.isRefreshingToken || this.isIntentionallyClosed) {
      return;
    }

    this.isRefreshingToken = true;
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${apiUrl}/api/v1/auth/refresh-token`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
        timeout: 15000,
      });

      const responseData = response.data?.data;
      const newAccessToken = responseData?.accessToken;
      const newRefreshToken = responseData?.refreshToken || refreshToken;
      const user = responseData?.user;

      if (!newAccessToken) {
        throw new Error('No new access token returned');
      }

      await saveTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: user || undefined,
      });

      if (user) {
        useAuthStore.getState().setAuth(user);
      }

      this.token = newAccessToken;
      this.reconnectAttempts = 0;
      if (this.onMessageCallback && !this.isIntentionallyClosed) {
        this.connect(newAccessToken, this.onMessageCallback, this.onErrorCallback || undefined);
      }
    } catch (error) {
      console.error('[UrgentSuggestion WS] Token refresh failed on auth error:', error);
      this.isIntentionallyClosed = true;
    } finally {
      this.isRefreshingToken = false;
    }
  }

  private startPingInterval() {
    this.stopPingInterval();
    
    this.pingTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
        
        this.pongTimer = setTimeout(() => {
          console.warn('[UrgentSuggestion WS] Pong timeout, reconnecting...');
          this.ws?.close();
        }, this.pongTimeout);
      }
    }, this.pingInterval);
  }

  private stopPingInterval() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    this.clearPongTimeout();
  }

  private clearPongTimeout() {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.isIntentionallyClosed) return;

    this.reconnectAttempts++;
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, up to 30s
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(async () => {
      if (this.token && this.onMessageCallback && !this.isIntentionallyClosed) {
        const latestToken = (await AsyncStorage.getItem('accessToken')) || this.token;
        this.connect(latestToken, this.onMessageCallback, this.onErrorCallback || undefined);
      }
    }, delay);
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopPingInterval();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  private getWebSocketUrl(): string {
    const base = (apiUrl || '').replace(/\/+$/, '').replace(/^http/, 'ws');
    return `${base}/ws/suggestions/urgent`;
  }
}

export const urgentSuggestionWS = new UrgentSuggestionWebSocket();
