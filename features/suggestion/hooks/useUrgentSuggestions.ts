import { useEffect, useRef } from 'react';
import { suggestionService } from '../services/suggestion.service';
import { useUrgentSuggestionStore } from '../store/urgentSuggestion.store';
import { urgentSuggestionWS } from '../services/urgentSuggestion.ws';
import { UrgentSuggestion } from '../types/urgent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUrgentSuggestions = (enabled: boolean = true) => {
  const setSuggestions = useUrgentSuggestionStore((s) => s.setSuggestions);
  const setCurrentSuggestion = useUrgentSuggestionStore((s) => s.setCurrentSuggestion);
  const suggestions = useUrgentSuggestionStore((s) => s.suggestions);
  const isConnectedRef = useRef(false);

  const fetchUrgentSuggestions = async (showModal: boolean = false) => {
    try {
      const data = await suggestionService.getUrgentSuggestions();
      setSuggestions(data);
      
      if (showModal && data.length > 0) {
        setCurrentSuggestion(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch urgent suggestions:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await suggestionService.markUrgentAsRead(id);
      const removeSuggestion = useUrgentSuggestionStore.getState().removeSuggestion;
      removeSuggestion(id);
    } catch (error) {
      console.error('Failed to mark urgent suggestion as read:', error);
    }
  };

  const handleWebSocketMessage = (data: UrgentSuggestion) => {
    // Thêm suggestion mới vào đầu danh sách
    const currentSuggestions = useUrgentSuggestionStore.getState().suggestions;
    setSuggestions([data, ...currentSuggestions]);
    // Hiển thị modal ngay
    setCurrentSuggestion(data);
  };

  useEffect(() => {
    if (!enabled) {
      urgentSuggestionWS.disconnect();
      isConnectedRef.current = false;
      return;
    }

    // Fetch danh sách hiện có khi mount
    fetchUrgentSuggestions(true);

    // Kết nối WebSocket
    const connectWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        
        if (!token) {
          return;
        }
        
        if (!isConnectedRef.current) {
          urgentSuggestionWS.connect(
            token,
            handleWebSocketMessage,
            (error) => console.error('[UrgentSuggestion] WS Error:', error)
          );
          isConnectedRef.current = true;
        }
      } catch (error) {
        console.error('[UrgentSuggestion] Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      urgentSuggestionWS.disconnect();
      isConnectedRef.current = false;
    };
  }, [enabled]);

  return {
    suggestions,
    fetchUrgentSuggestions,
    markAsRead,
  };
};
