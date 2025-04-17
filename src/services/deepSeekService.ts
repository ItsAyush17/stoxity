
import { StockData } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";
import { mockApiCall } from "./mockData";
import OpenAI from "openai";

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
    // Initialize the OpenAI client with the DeepSeek API base URL
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.deepseek.com/v1"
    });

    // Create the completion request with the format specified
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system", 
          content: "You are a financial analyst assistant. Analyze earnings calls, SEC filings, and recent news for the specified company or ticker symbol. Provide financial metrics, growth indicators, risk factors, and recent news in a structured format. Return data in markdown tables and tweet-like news updates."
        },
        { 
          role: "user", 
          content: `Use earning calls, SEC filing and news in recent to analyse the ${query} stock and produce a overall insight. Data in table format and numbers in tweet like news format.` 
        }
      ],
      temperature: 0.5,
      max_tokens: 4000
    });

    // Log the response for debugging
    console.log("DeepSeek API Response:", response);
    
    // Extract the content from the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    // Parse the response and convert it to our StockData format
    return extractDataFromResponse({ choices: [{ message: { content } }] }, query);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    
    // If we're in development mode or DeepSeek API fails, fall back to mock data
    if (import.meta.env.DEV || error instanceof Error) {
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
