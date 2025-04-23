export interface StockData {
  symbol: string;
  name: string;
  industry?: string;
  sector?: string;
  marketCap?: number;
  beta?: number;
  dividendYield?: number;
  description?: string;
  insights: {
    financials: InsightItem[];
    growth: InsightItem[];
    risks: InsightItem[];
  };
  tweets: TweetInsight[];
  priceHistory?: any[]; // Add this field to support the chart data
}

export interface InsightItem {
  metric: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface TweetInsight {
  id: string;
  content: string;
  category: "financial" | "growth" | "risk";
  timestamp: string;
}

export interface StockSuggestion {
  symbol: string;
  name: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  beta?: number;
  dividendYield?: number;
  description?: string;
}
