import { useState, useCallback } from 'react';
import { suggestionService } from '../services/suggestion.service';
import { SuggestionListItem, SuggestionStatus } from '../types';

export type FilterValue = 'ALL' | SuggestionStatus;

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SuggestionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (filter: FilterValue = 'ALL') => {
    try {
      setLoading(true);
      setError(null);
      const status = filter === 'ALL' ? undefined : filter;
      const data = await suggestionService.getSuggestions(status);
      setSuggestions(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  return { suggestions, loading, error, fetchSuggestions };
};
