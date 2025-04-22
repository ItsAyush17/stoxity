
import { StockData } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";

// Initialize with the provided API key
const API_KEY = "sk-9e7cbcba812f45f9a5e0158d02bdb294";

export const fetchStockData = async (query: string): Promise<StockData> => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
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
            content: `Use earning calls, SEC filing and news in recent to analyze the ${query} stock and produce an overall insight. Data in table format and numbers in tweet like news format.`
          }
        ],
        temperature: 0.5,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("DeepSeek API Response:", data);
    return extractDataFromResponse(data, query);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const validateStockSymbol = (query: string): boolean => {
  return query && query.trim().length > 0;
};
