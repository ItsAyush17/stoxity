
import { StockData, InsightItem } from "@/types";

export const extractDataFromResponse = (apiResponse: any, query: string): StockData => {
  try {
    // Extract the text content from the API response
    const content = apiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid API response format");
    }
    
    console.log("Raw content from API:", content);
    
    // Try to parse JSON from the response
    // The AI might return JSON embedded in markdown or text, so we need to extract it
    let jsonData;
    try {
      // First try: direct JSON parsing
      jsonData = JSON.parse(content);
    } catch (e) {
      // Second try: extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonData = JSON.parse(jsonMatch[1]);
      } else {
        // Third try: look for any object-like structure
        const objectMatch = content.match(/\{[\s\S]*?\}/);
        if (objectMatch) {
          try {
            jsonData = JSON.parse(objectMatch[0]);
          } catch (e) {
            throw new Error("Could not extract JSON from API response");
          }
        } else {
          throw new Error("Could not extract JSON from API response");
        }
      }
    }
    
    console.log("Extracted JSON data:", jsonData);
    
    // Normalize ticker and name
    const symbol = (jsonData.symbol || jsonData.ticker || query).toUpperCase();
    const name = jsonData.name || jsonData.company_name || `${symbol}`;
    
    // Convert the parsed data to our StockData format
    const stockData: StockData = {
      symbol,
      name,
      insights: {
        financials: parseInsightItems(jsonData.financials || jsonData.financial || jsonData.financial_metrics || []),
        growth: parseInsightItems(jsonData.growth || jsonData.growth_metrics || jsonData.growth_indicators || []),
        risks: parseInsightItems(jsonData.risks || jsonData.risk_factors || jsonData.risk_assessment || [])
      },
      tweets: parseTweets(jsonData.news || jsonData.tweets || jsonData.insights || [])
    };
    
    return stockData;
  } catch (error) {
    console.error("Error parsing API response:", error);
    // Fallback to a basic structure if parsing fails
    return createFallbackStockData(query);
  }
};

const parseInsightItems = (items: any[]): InsightItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  
  return items.map(item => {
    // Handle different possible property names
    const metric = item.metric || item.name || item.factor || item.title || item.key || "Unknown";
    const value = item.value || item.data || item.figure || "N/A";
    const change = item.change || item.impact || item.delta || item.trend_value || "Unknown";
    const trend = determineTrend(item.trend || item.direction || item.change || item.sentiment || item.movement);
    
    return {
      metric,
      value,
      change,
      trend
    };
  }).slice(0, 5); // Limit to 5 items
};

const determineTrend = (trendValue: any): "up" | "down" | "neutral" => {
  if (!trendValue) return "neutral";
  
  const trend = String(trendValue).toLowerCase();
  if (trend.includes("up") || trend.includes("positive") || trend.includes("+") || trend.includes("increase") || trend.includes("growing") || trend.includes("bullish")) {
    return "up";
  } else if (trend.includes("down") || trend.includes("negative") || trend.includes("-") || trend.includes("decrease") || trend.includes("declining") || trend.includes("bearish")) {
    return "down";
  }
  return "neutral";
};

const parseTweets = (newsItems: any[]) => {
  if (!Array.isArray(newsItems)) {
    return [];
  }
  
  return newsItems.map((item, index) => {
    // Try to determine the category
    let categoryRaw = item.category || item.type || item.topic || "";
    let category: "financial" | "growth" | "risk" = "financial";
    
    if (typeof categoryRaw === "string") {
      const lowerCategory = categoryRaw.toLowerCase();
      if (lowerCategory.includes("risk") || lowerCategory.includes("threat") || lowerCategory.includes("challenge")) {
        category = "risk";
      } else if (lowerCategory.includes("growth") || lowerCategory.includes("expansion") || lowerCategory.includes("opportunity")) {
        category = "growth";
      }
    }
    
    // Determine the content
    const content = item.content || item.text || item.description || item.headline || item.message || "No content available";
    
    // Generate a timestamp if none is provided
    const timestamp = item.timestamp || item.date || item.time || item.published || generateRandomTimestamp();
    
    return {
      id: `${category}-${Date.now()}-${index}`,
      content,
      category,
      timestamp: typeof timestamp === "string" ? timestamp : generateRandomTimestamp()
    };
  });
};

const generateRandomTimestamp = (): string => {
  const options = ["1h ago", "2h ago", "3h ago", "4h ago", "5h ago", "6h ago", "12h ago", "1d ago"];
  return options[Math.floor(Math.random() * options.length)];
};

const createFallbackStockData = (query: string): StockData => {
  const symbol = query.toUpperCase();
  return {
    symbol,
    name: symbol,
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
        content: `Unable to retrieve latest news for ${symbol}. Please check back later or try another search.`,
        category: "financial",
        timestamp: "now"
      }
    ]
  };
};
