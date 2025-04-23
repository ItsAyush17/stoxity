
// Re-export the mock function
export { mockApiCall as fetchStockData } from './mockData';

// Define a simple stock symbol validation function
export const validateStockSymbol = (symbol: string): boolean => {
  // Basic validation: check if the symbol is not empty and contains only letters
  return symbol.trim().length > 0 && /^[A-Za-z]+$/.test(symbol);
};
