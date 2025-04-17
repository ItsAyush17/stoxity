import { StockData, InsightItem, TweetInsight } from "@/types";
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiAnalysisRequest {
  stockSymbol: string;
  apiKey: string;
}

interface GeminiResponse {
  data: StockData;
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// This function will be used to call the Gemini API
export const getStockAnalysisFromGemini = async (
  symbol: string,
  apiKey: string
): Promise<StockData> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze the stock ${symbol} and provide a structured response with:
    1. Company name
    2. Financial metrics (revenue, profit, etc.)
    3. Growth indicators
    4. Risk factors
    5. Recent news/tweets
    
    Format the response as a JSON object matching this structure:
    {
      "symbol": string,
      "name": string,
      "insights": {
        "financials": [{ "metric": string, "value": string, "change": string, "trend": "up"|"down"|"neutral" }],
        "growth": [{ "metric": string, "value": string, "change": string, "trend": "up"|"down"|"neutral" }],
        "risks": [{ "metric": string, "value": string, "change": string, "trend": "up"|"down"|"neutral" }]
      },
      "tweets": [{ "id": string, "content": string, "category": "financial"|"growth"|"risk", "timestamp": string }]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Parse the JSON response
      const parsedData = JSON.parse(text);
      return parsedData as StockData;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error("Failed to parse stock analysis data");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze stock data using Gemini API");
  }
};

// Helper function to generate mock data (to be replaced with actual Gemini API response handling)
const generateMockDataFromSymbol = async (symbol: string): Promise<StockData> => {
  // This simulates what you'd extract from the Gemini API response
  return {
    symbol: symbol,
    name: `${symbol} Corporation`,
    insights: {
      financials: [
        {
          metric: "Revenue",
          value: "$2.3B",
          change: "+5.2%",
          trend: "up"
        },
        {
          metric: "EBITDA Margin",
          value: "23.7%",
          change: "-1.2%",
          trend: "down"
        },
        {
          metric: "Free Cash Flow",
          value: "$342M",
          change: "+2.1%",
          trend: "up"
        },
      ],
      growth: [
        {
          metric: "YoY Growth",
          value: "7.2%",
          change: "+1.4%",
          trend: "up"
        },
        {
          metric: "Market Share",
          value: "12.3%",
          change: "+0.8%",
          trend: "up"
        },
        {
          metric: "R&D Investment",
          value: "$180M",
          change: "0%",
          trend: "neutral"
        },
      ],
      risks: [
        {
          metric: "Debt to Equity",
          value: "0.45",
          change: "High",
          trend: "neutral"
        },
        {
          metric: "Litigation Risk",
          value: "Low",
          change: "Stable",
          trend: "neutral"
        },
        {
          metric: "Competitive Threat",
          value: "Medium",
          change: "Increasing",
          trend: "up"
        },
      ]
    },
    tweets: [
      {
        id: "t1",
        content: `${symbol} reported strong quarterly earnings, exceeding analyst expectations with a 12% increase in revenue from cloud services.`,
        category: "financial",
        timestamp: "2024-04-15"
      },
      {
        id: "t2",
        content: `${symbol}'s expansion into emerging markets shows promising growth potential, with 23% year-over-year increase in Asian markets.`,
        category: "growth",
        timestamp: "2024-04-14"
      },
      {
        id: "t3",
        content: `Regulatory concerns in European markets pose a potential challenge to ${symbol}'s global strategy in the coming fiscal year.`,
        category: "risk",
        timestamp: "2024-04-13"
      }
    ]
  };
};

export const getGeminiResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw error;
  }
};

export const getGeminiStreamResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error('Error getting Gemini stream response:', error);
    throw error;
  }
};
