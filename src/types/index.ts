
export interface StockData {
  symbol: string;
  name: string;
  insights: {
    financials: InsightItem[];
    growth: InsightItem[];
    risks: InsightItem[];
  };
  tweets: TweetInsight[];
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
}
