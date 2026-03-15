import { useState, useEffect } from 'react';
import { suggestionService } from '../services/suggestion.service';
import { SuggestionDetail } from '../types';

export const useSuggestionDetail = (id: string) => {
  const [suggestion, setSuggestion] = useState<SuggestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await suggestionService.getSuggestionDetail(id);
      setSuggestion(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load suggestion');
    } finally {
      setLoading(false);
    }
  };

  const acceptSuggestion = async () => {
    const updated = await suggestionService.acceptSuggestion(id);
    setSuggestion(updated);
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  return { suggestion, loading, error, refetch: fetchDetail, acceptSuggestion };
};
