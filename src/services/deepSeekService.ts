
import { StockData } from "@/types";
import { extractDataFromResponse } from "@/utils/responseParser";
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
          content: "You are a financial analyst assistant. Analyze earnings calls, SEC filings, and recent news for the specified company or ticker symbol. Format your response EXACTLY as follows:\n\n### **📊 {COMPANY} Stock Snapshot (Recent Data)**\n| **Metric** | **Value** | **Trend** |\n|------------|-----------|----------|\n| **Q4 Revenue** | $X.XB (X% YoY) | ⏸️ Neutral/🔺 Positive/🔻 Negative |\n... (5-6 key metrics)\n\n---\n\n### **🔍 Key Insights (Tweet-Style)**\n1️⃣ **Short Title**: Detailed insight with **bold numbers**. #Hashtag\n2️⃣ **Short Title**: Detailed insight with **bold numbers**. #Hashtag\n... (4-5 key insights)\n\n---\n\n### **📰 Recent News Highlights**\n- **Date**: Key news point with **impact**. #Hashtag\n- **Date**: Key news point with **impact**. #Hashtag\n... (2-3 news items)\n\n---\n\n### **🎯 Verdict**: **Recommendation**\n- **Strengths**: List 2-3 key strengths.\n- **Risks**: List 2-3 key risks.\n- **Outlook**: Short future prediction.\n\n**#{TICKER} #Investing**"
        },
        { 
          role: "user", 
          content: `Use earnings calls, SEC filings and recent news to analyze the ${query} stock and produce an overall insight. Follow the exact format in my system message.` 
        }
      ],
      temperature: 0.5,
      max_tokens: 4000
    });

    // Extract the content from the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    console.log("Raw DeepSeek Response:", content);
    
    // Parse the response and convert it to our StockData format
    return extractDataFromResponse({ choices: [{ message: { content } }] }, query);
  } catch (error) {
    console.error("Error fetching stock data:", error);
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
