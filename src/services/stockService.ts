// Import Gemini API service
import { fetchStockDataFromGemini } from './geminiService';

// Define a simple stock symbol validation function
export const validateStockSymbol = (symbol: string): boolean => {
  // Basic validation: check if the symbol is not empty and contains only letters
  return symbol.trim().length > 0 && /^[A-Za-z]+$/.test(symbol);
};

// Export the fetchStockData function
export const fetchStockData = async (query: string) => {
  // Simple check to ensure the stock symbol is valid
  const sanitizedQuery = query.trim().toUpperCase();
  
  if (!validateStockSymbol(sanitizedQuery)) {
    throw new Error("Invalid stock symbol. Please enter a valid stock symbol.");
  }
  
  // Use the Gemini API to get real stock data
  return fetchStockDataFromGemini(sanitizedQuery);
};
