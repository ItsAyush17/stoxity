
import { StockSuggestion } from "@/types";

// Mock stock suggestions data
const stockSuggestions: StockSuggestion[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "WMT", name: "Walmart Inc." }
];

export const searchStocks = (query: string): StockSuggestion[] => {
  if (!query) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  return stockSuggestions.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
    stock.name.toLowerCase().includes(lowerCaseQuery)
  ).slice(0, 5); // Return top 5 matches
};

export const validateStockSymbol = (query: string): boolean => {
  const lowerCaseQuery = query.toLowerCase();
  return stockSuggestions.some(stock => 
    stock.symbol.toLowerCase() === lowerCaseQuery || 
    stock.name.toLowerCase() === lowerCaseQuery
  );
};
