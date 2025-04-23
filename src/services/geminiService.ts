import { StockData } from "@/types";
import { API_KEYS, API_ENDPOINTS, FEATURES } from "@/config";
import { mockApiCall } from "./mockData"; // Keep this for fallback

// Helper function to structure the prompt for stock analysis
const createStockAnalysisPrompt = (symbol: string): string => {
  return `
    Provide a comprehensive financial analysis of ${symbol} stock with the following structure:
    
    1. Company Information:
       - Full company name
       - Industry and sector
       - Market capitalization (in billions USD)
       - Beta
       - Dividend yield (if applicable)
       - A brief description of the company's business
    
    2. Financial Analysis:
       - Revenue
       - Net Income
       - EPS (Earnings Per Share)
       - Operating Margin
       - Cash Flow
       
    3. Growth Analysis:
       - YOY Growth
       - Market Share
       - R&D Spending
       - New Products/Services
       - Customer Acquisition Cost
       
    4. Risk Assessment:
       - Debt to Equity
       - Competition
       - Regulatory Risks
       - Supply Chain
       - Market Volatility
    
    5. Recent News (3-4 financial news items)
    
    IMPORTANT:
    - Format the response as valid JSON matching the structure above
    - For numerical values, include both the value and a year-over-year change percentage
    - For risk factors, indicate whether the risk is 'high', 'medium', or 'low'
    - For each news item, include a brief summary, category, and timestamp
    - For price history, generate 12 months of simulated data with monthly values
    - DO NOT make up exact financial figures if you don't have them, prefer ranges or general assessments
    
    The JSON should follow this structure:
    {
      "name": "Full Company Name",
      "symbol": "${symbol}",
      "sector": "Sector Name",
      "industry": "Industry Name",
      "marketCap": numeric_value,
      "beta": numeric_value,
      "dividendYield": numeric_value,
      "description": "Company description",
      "financials": [
        {"metric": "Revenue", "value": "value", "change": "percentage", "trend": "up|down|neutral"},
        ...
      ],
      "growth": [
        {"metric": "YOY Growth", "value": "value", "change": "percentage", "trend": "up|down|neutral"},
        ...
      ],
      "risks": [
        {"metric": "Debt to Equity", "value": "value", "change": "High|Medium|Low", "trend": "up|down|neutral"},
        ...
      ],
      "news": [
        {"id": "unique-id", "content": "News content", "category": "financial|growth|risk", "timestamp": "timeframe"},
        ...
      ],
      "priceHistory": [
        {"name": "Jan", "value": numeric_value},
        ...
      ]
    }
  `;
};

// Parse Gemini API response and format it to match our StockData interface
const parseGeminiResponse = (response: any, symbol: string): StockData => {
  try {
    // Extract the text content from Gemini's response
    const content = response.candidates[0].content.parts[0].text;
    
    // Parse the JSON content
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    
    const cleanedJson = jsonString.replace(/^```json\n|```$/g, '').trim();
    const data = JSON.parse(cleanedJson);
    
    // Transform the data to match our StockData interface
    return {
      symbol: data.symbol || symbol.toUpperCase(),
      name: data.name || `${symbol.toUpperCase()} Corporation`,
      industry: data.industry,
      sector: data.sector,
      marketCap: data.marketCap,
      beta: data.beta,
      dividendYield: data.dividendYield,
      description: data.description,
      priceHistory: data.priceHistory || [],
      insights: {
        financials: data.financials || [],
        growth: data.growth || [],
        risks: data.risks || []
      },
      tweets: data.news?.map((item: any) => ({
        id: item.id || `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: item.content,
        category: item.category,
        timestamp: item.timestamp
      })) || []
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    // Return a fallback structure if parsing fails
    return createFallbackStockData(symbol);
  }
};

// Create a fallback response in case of API failure
const createFallbackStockData = (symbol: string): StockData => {
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Corporation`,
    insights: {
      financials: [
        { metric: "Revenue", value: "Data unavailable", change: "N/A", trend: "neutral" },
        { metric: "Net Income", value: "Data unavailable", change: "N/A", trend: "neutral" },
        { metric: "EPS", value: "Data unavailable", change: "N/A", trend: "neutral" }
      ],
      growth: [
        { metric: "YOY Growth", value: "Data unavailable", change: "N/A", trend: "neutral" },
        { metric: "Market Share", value: "Data unavailable", change: "N/A", trend: "neutral" }
      ],
      risks: [
        { metric: "Market Risk", value: "Data unavailable", change: "N/A", trend: "neutral" },
        { metric: "Regulatory Risk", value: "Data unavailable", change: "N/A", trend: "neutral" }
      ]
    },
    tweets: [
      {
        id: `fallback-${Date.now()}-1`,
        content: `Unable to retrieve data for ${symbol}. API call failed or returned invalid data.`,
        category: "financial",
        timestamp: "now"
      }
    ],
    priceHistory: Array(12).fill(0).map((_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: 100 + Math.random() * 20 - 10 // Generate random price around 100
    }))
  };
};

// Main function to fetch stock data from Gemini API
export const fetchStockDataFromGemini = async (symbol: string): Promise<StockData> => {
  // If the USE_REAL_DATA feature flag is off, use mock data instead
  if (!FEATURES.USE_REAL_DATA) {
    console.log("Using mock data instead of Gemini API");
    return mockApiCall(symbol);
  }

  try {
    const prompt = createStockAnalysisPrompt(symbol);
    
    const response = await fetch(`${API_ENDPOINTS.GEMINI_API}?key=${API_KEYS.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return parseGeminiResponse(data, symbol);
  } catch (error) {
    console.error('Error fetching stock data from Gemini:', error);
    return createFallbackStockData(symbol);
  }
}; 