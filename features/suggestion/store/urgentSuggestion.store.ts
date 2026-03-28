import { create } from 'zustand';
import { UrgentSuggestion } from '../types/urgent';

interface UrgentSuggestionState {
  suggestions: UrgentSuggestion[];
  setSuggestions: (suggestions: UrgentSuggestion[]) => void;
  currentSuggestion: UrgentSuggestion | null;
  setCurrentSuggestion: (suggestion: UrgentSuggestion | null) => void;
  removeSuggestion: (id: string) => void;
  reset: () => void;
}

export const useUrgentSuggestionStore = create<UrgentSuggestionState>((set) => ({
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  currentSuggestion: null,
  setCurrentSuggestion: (suggestion) => set({ currentSuggestion: suggestion }),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    })),
  reset: () => set({ suggestions: [], currentSuggestion: null }),
}));
