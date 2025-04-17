import { StockData, StockSuggestion } from "@/types";
import { fetchStockData } from "./deepseekService";

// Mock stock suggestions data
const STOCK_SUGGESTIONS: StockSuggestion[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" }
];

export const getStockSuggestions = (query: string): StockSuggestion[] => {
  if (!query) return STOCK_SUGGESTIONS;
  
  const normalizedQuery = query.toLowerCase();
  return STOCK_SUGGESTIONS.filter(
    stock => 
      stock.symbol.toLowerCase().includes(normalizedQuery) ||
      stock.name.toLowerCase().includes(normalizedQuery)
  );
};

export const getStockData = async (query: string): Promise<StockData> => {
  // Extract symbol from query (could be symbol or company name)
  const suggestion = getStockSuggestions(query)[0];
  const symbol = suggestion?.symbol || query.toUpperCase();
  
  return fetchStockData(symbol);
};
