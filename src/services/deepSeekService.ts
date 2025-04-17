
import { StockData, StockSuggestion } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";
import { mockApiCall } from "./mockData";

// API key should ideally be stored in environment variables or user input
let apiKey = "sk-0df192262b5c40b1ac46f00c16d5c417";

export const setDeepSeekApiKey = (key: string) => {
  apiKey = key;
  // Store in localStorage for persistence across refreshes
  localStorage.setItem('deepSeekApiKey', key);
};

export const getDeepSeekApiKey = (): string => {
  // Try to get from memory first, then localStorage
  if (apiKey) return apiKey;
  
  const storedKey = localStorage.getItem('deepSeekApiKey');
  if (storedKey) {
    apiKey = storedKey;
    return storedKey;
  }
  
  return '';
};

export const fetchStockData = async (query: string): Promise<StockData> => {
  const key = getDeepSeekApiKey();
  if (!key) {
    throw new Error("DeepSeek API key is required");
  }
  
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system", 
            content: "You are a financial analyst assistant. Analyze earnings calls, SEC filings, and recent news for the specified company or ticker symbol. Provide financial metrics, growth indicators, risk factors, and recent news in a structured format."
          },
          { 
            role: "user", 
            content: `Analyze earnings calls, SEC filings, and recent news for ${query}. Provide a comprehensive analysis including current financial data, growth metrics, and risk assessment. Format the response in JSON with three sections: 'financials', 'growth', and 'risks' (each with metrics, values, changes, and trends), plus a 'news' section with categorized insights.` 
          }
        ],
        temperature: 0.5,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("DeepSeek API Response:", data);
    
    // Parse the response and convert it to our StockData format
    return extractDataFromResponse(data, query);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    
    // If we're in development mode or DeepSeek API fails, fall back to mock data
    if (import.meta.env.DEV || error instanceof Error && error.message.includes("API request failed")) {
      console.log("Falling back to mock data");
      return mockApiCall(query);
    }
    
    throw error;
  }
};

// For search suggestions - expanded list of popular stocks
const popularStocks: StockSuggestion[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "VZ", name: "Verizon Communications" },
  { symbol: "KO", name: "Coca-Cola Company" },
  { symbol: "MCD", name: "McDonald's Corporation" }
];

export const searchStocks = (query: string): StockSuggestion[] => {
  if (!query) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  return popularStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
    stock.name.toLowerCase().includes(lowerCaseQuery)
  ).slice(0, 5); // Return top 5 matches
};

// Modified to always return true - allow any company or ticker input
export const validateStockSymbol = (query: string): boolean => {
  if (query && query.trim().length > 0) {
    return true; // Allow any non-empty input
  }
  return false;
};
