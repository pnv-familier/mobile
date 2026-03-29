import { apiUrl } from "../../../api/api";

class UrgentSuggestionWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private pongTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private pingInterval = 30000; // 30s
  private pongTimeout = 10000; // 10s
  private isIntentionallyClosed = false;
  private token: string | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  connect(token: string, onMessage: (data: any) => void, onError?: (error: any) => void) {
    this.token = token;
    this.onMessageCallback = onMessage;
    this.onErrorCallback = onError || null;
    this.isIntentionallyClosed = false;

    const wsUrl = this.getWebSocketUrl();
    
    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`, []);

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
          
          const parsed = JSON.parse(data);
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

        if (event.code === 1006 && event.reason?.includes('401')) {
          this.isIntentionallyClosed = true;
          return;
        }

        if (event.code === 1002) {
          this.isIntentionallyClosed = true;
          return;
        }

        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('[UrgentSuggestion WS] Connection error:', error);
      onError?.(error);
    }
  }

  private startPingInterval() {
    this.stopPingInterval();
    
    this.pingTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
        
        this.pongTimer = setTimeout(() => {
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
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    this.reconnectTimer = setTimeout(() => {
      if (this.token && this.onMessageCallback) {
        this.connect(this.token, this.onMessageCallback, this.onErrorCallback || undefined);
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
    return apiUrl.replace(/^http/, 'ws') + '/api/v1/suggestions/urgent/stream';
  }
}

export const urgentSuggestionWS = new UrgentSuggestionWebSocket();
