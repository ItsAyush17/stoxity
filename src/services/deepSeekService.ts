
import { StockData } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";
import { mockApiCall } from "./mockData";

// Get API key from localStorage
export const getDeepSeekApiKey = (): string => {
  return localStorage.getItem('deepSeekApiKey') || '';
};

export const fetchStockData = async (query: string): Promise<StockData> => {
  const apiKey = getDeepSeekApiKey();
  if (!apiKey) {
    throw new Error("DeepSeek API key is required");
  }
  
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
            content: `Use earning calls, SEC filing and news in recent to analyse the ${query} stock and produce a overall insight. Data in table format and numbers in tweet like news format.` 
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

// Modified to always return true - allow any company or ticker input
export const validateStockSymbol = (query: string): boolean => {
  if (query && query.trim().length > 0) {
    return true; // Allow any non-empty input
  }
  return false;
};
