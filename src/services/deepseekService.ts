import { StockData, InsightItem, TweetInsight } from "@/types";

const DEEPSEEK_API_KEY = "sk-0df192262b5c40b1ac46f00c16d5c417";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const parseFinancialMetrics = (content: string): InsightItem[] => {
  // Parse the response to extract financial metrics
  const metrics: InsightItem[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [metric, value] = line.split(':').map(s => s.trim());
      metrics.push({
        metric,
        value,
        trend: value.includes('+') ? 'up' : value.includes('-') ? 'down' : 'neutral'
      });
    }
  }
  
  return metrics;
};

const parseTweets = (content: string): TweetInsight[] => {
  // Parse the response to extract tweet-like insights
  const tweets: TweetInsight[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.trim()) {
      tweets.push({
        id: `tweet-${Date.now()}-${tweets.length}`,
        content: line,
        category: line.toLowerCase().includes('risk') ? 'risk' : 
                 line.toLowerCase().includes('growth') ? 'growth' : 'financial',
        timestamp: `${Math.floor(Math.random() * 24)}h ago`
      });
    }
  }
  
  return tweets;
};

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  try {
    // First, get company name
    const nameResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `What is the full company name for stock symbol ${symbol}?`
        }]
      })
    });

    const nameData = await nameResponse.json() as DeepSeekResponse;
    const companyName = nameData.choices[0].message.content;

    // Get financial insights
    const financialResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Provide key financial metrics for ${companyName} (${symbol}) in a format like "Metric: Value". Include revenue, net income, EPS, operating margin, and cash flow.`
        }]
      })
    });

    const financialData = await financialResponse.json() as DeepSeekResponse;
    const financials = parseFinancialMetrics(financialData.choices[0].message.content);

    // Get growth insights
    const growthResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Provide growth metrics for ${companyName} (${symbol}) in a format like "Metric: Value". Include YOY growth, market share, R&D spending, new products, and customer acquisition cost.`
        }]
      })
    });

    const growthData = await growthResponse.json() as DeepSeekResponse;
    const growth = parseFinancialMetrics(growthData.choices[0].message.content);

    // Get risk insights
    const riskResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Provide risk metrics for ${companyName} (${symbol}) in a format like "Metric: Value". Include debt to equity, competition, regulatory risks, supply chain, and market volatility.`
        }]
      })
    });

    const riskData = await riskResponse.json() as DeepSeekResponse;
    const risks = parseFinancialMetrics(riskData.choices[0].message.content);

    // Get recent news/tweets
    const newsResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Provide recent news and insights about ${companyName} (${symbol}) in a tweet-like format. Include financial, growth, and risk-related information.`
        }]
      })
    });

    const newsData = await newsResponse.json() as DeepSeekResponse;
    const tweets = parseTweets(newsData.choices[0].message.content);

    return {
      symbol: symbol.toUpperCase(),
      name: companyName,
      insights: {
        financials,
        growth,
        risks
      },
      tweets
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}; 