import { useState } from 'react';
import { getGeminiResponse, getGeminiStreamResponse } from '@/services/geminiService';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResponse = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGeminiResponse(prompt);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStreamResponse = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);
      const stream = await getGeminiStreamResponse(prompt);
      return stream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getResponse,
    getStreamResponse,
    loading,
    error
  };
}; 