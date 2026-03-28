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
    
    console.log('[UrgentSuggestion WS] Connecting to:', wsUrl);
    console.log('[UrgentSuggestion WS] Token (first 50 chars):', token.substring(0, 50));
    
    try {
      // Thử với subprotocol nếu backend yêu cầu
      this.ws = new WebSocket(`${wsUrl}?token=${token}`, []);
      // Hoặc: this.ws = new WebSocket(`${wsUrl}?token=${token}`, ['v1.urgent-suggestions']);

      this.ws.onopen = () => {
        console.log('[UrgentSuggestion WS] Connected');
        console.log('[UrgentSuggestion WS] ReadyState:', this.ws?.readyState);
        this.reconnectAttempts = 0;
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = event.data;
          console.log('[UrgentSuggestion WS] Raw message received:', data);
          
          if (data === 'pong') {
            console.log('[UrgentSuggestion WS] Pong received');
            this.clearPongTimeout();
            return;
          }
          
          const parsed = JSON.parse(data);
          console.log('[UrgentSuggestion WS] Message received:', parsed);
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
        console.log('[UrgentSuggestion WS] Closed:', event.code, event.reason);
        console.log('[UrgentSuggestion WS] Close details:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        this.stopPingInterval();
        this.ws = null;

        // Nếu 401 Unauthorized, không reconnect
        if (event.code === 1006 && event.reason?.includes('401')) {
          console.error('[UrgentSuggestion WS] Token invalid, stop reconnecting');
          this.isIntentionallyClosed = true;
          return;
        }

        // Nếu 1002 Protocol error, log và dừng reconnect
        if (event.code === 1002) {
          console.error('[UrgentSuggestion WS] Protocol error - Backend issue, stop reconnecting');
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
        console.log('[UrgentSuggestion WS] Sending ping');
        this.ws.send('ping');
        
        // Đợi pong trong 10s, nếu không có thì reconnect
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
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`[UrgentSuggestion WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
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
