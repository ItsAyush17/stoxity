import { StockData, InsightItem, TweetInsight } from "@/types";

interface GeminiAnalysisRequest {
  stockSymbol: string;
}

interface GeminiResponse {
  data: StockData;
}

// This function will be used to call the backend API
export const getStockAnalysisFromGemini = async (
  symbol: string
): Promise<StockData> => {
  try {
    const response = await fetch(`/api/stock-analysis/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as StockData;
  } catch (error) {
    console.error("Error fetching stock analysis:", error);
    throw new Error("Failed to fetch stock analysis");
  }
};

// Function to get news analysis
export const getNewsAnalysis = async (symbol: string) => {
  try {
    const response = await fetch(`/api/news-analysis/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching news analysis:", error);
    throw new Error("Failed to fetch news analysis");
  }
};

// Function to get SEC filings analysis
export const getSECFilingsAnalysis = async (symbol: string) => {
  try {
    const response = await fetch(`/api/sec-filings/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SEC filings analysis:", error);
    throw new Error("Failed to fetch SEC filings analysis");
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
