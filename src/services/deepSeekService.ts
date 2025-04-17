
import { StockData, StockSuggestion } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";

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
            content: "You are a financial analyst assistant. Provide detailed stock analysis for the given company or ticker symbol. Include financial metrics, growth indicators, risk factors, and recent news in a structured format."
          },
          { 
            role: "user", 
            content: `Provide a comprehensive analysis of ${query} stock. Include current financial data, growth metrics, risk assessment, and recent relevant news. Format the response in JSON.` 
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("DeepSeek API Response:", data);
    
    // Parse the response and convert it to our StockData format
    return extractDataFromResponse(data, query);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

// Real stock suggestions based on market data
// This is a simplified list, in a real app you might fetch this from an API
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
  { symbol: "NFLX", name: "Netflix Inc." }
];

export const searchStocks = (query: string): StockSuggestion[] => {
  if (!query) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  return popularStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
    stock.name.toLowerCase().includes(lowerCaseQuery)
  ).slice(0, 5); // Return top 5 matches
};

export const validateStockSymbol = (query: string): boolean => {
  const lowerCaseQuery = query.toLowerCase();
  return popularStocks.some(stock => 
    stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
    stock.name.toLowerCase().includes(lowerCaseQuery)
  );
};
