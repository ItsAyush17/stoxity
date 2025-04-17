import { useState } from 'react';
import { getStockAnalysisFromGemini, getNewsAnalysis, getSECFilingsAnalysis } from '@/services/geminiService';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStockAnalysis = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await getStockAnalysisFromGemini(symbol);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNews = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      const news = await getNewsAnalysis(symbol);
      return news;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSECFilings = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      const filings = await getSECFilingsAnalysis(symbol);
      return filings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getStockAnalysis,
    getNews,
    getSECFilings,
    loading,
    error
  };
}; 