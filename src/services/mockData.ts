import { StockData } from "@/types";

// This is mock data until the API is implemented
export const generateMockData = (symbol: string): StockData => {
  // Generate a company name based on the symbol
  const generateName = (symbol: string) => {
    const nameMap: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'JNJ': 'Johnson & Johnson',
    };
    
    return nameMap[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`;
  };
  
  const name = generateName(symbol);
  
  return {
    symbol: symbol.toUpperCase(),
    name,
    insights: {
      financials: [
        {
          metric: "Revenue",
          value: `$${(Math.random() * 100).toFixed(2)}B`,
          change: `+${(Math.random() * 20).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "Net Income",
          value: `$${(Math.random() * 25).toFixed(2)}B`,
          change: `+${(Math.random() * 15).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "EPS",
          value: `$${(Math.random() * 10).toFixed(2)}`,
          change: `+${(Math.random() * 12).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "Operating Margin",
          value: `${(Math.random() * 30).toFixed(1)}%`,
          change: `${(Math.random() * 5 - 2).toFixed(1)}%`,
          trend: Math.random() > 0.5 ? "up" : "down"
        },
        {
          metric: "Cash Flow",
          value: `$${(Math.random() * 15).toFixed(2)}B`,
          change: `+${(Math.random() * 10).toFixed(1)}%`,
          trend: "up"
        }
      ],
      growth: [
        {
          metric: "YOY Growth",
          value: `${(Math.random() * 40).toFixed(1)}%`,
          change: `+${(Math.random() * 15).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "Market Share",
          value: `${(Math.random() * 20).toFixed(1)}%`,
          change: `+${(Math.random() * 3).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "R&D Spending",
          value: `$${(Math.random() * 10).toFixed(2)}B`,
          change: `+${(Math.random() * 25).toFixed(1)}%`,
          trend: "up"
        },
        {
          metric: "New Products",
          value: `${Math.floor(Math.random() * 20)}`,
          change: `+${Math.floor(Math.random() * 10)}`,
          trend: "up"
        },
        {
          metric: "Customer Acquisition Cost",
          value: `$${(Math.random() * 200).toFixed(2)}`,
          change: `-${(Math.random() * 10).toFixed(1)}%`,
          trend: "down"
        }
      ],
      risks: [
        {
          metric: "Debt to Equity",
          value: `${(Math.random() * 2).toFixed(2)}`,
          change: Math.random() > 0.5 ? "High" : "Medium",
          trend: Math.random() > 0.5 ? "up" : "neutral"
        },
        {
          metric: "Competition",
          value: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
          change: Math.random() > 0.5 ? "Increasing" : "Stable",
          trend: Math.random() > 0.5 ? "up" : "neutral"
        },
        {
          metric: "Regulatory Risks",
          value: Math.random() > 0.6 ? "High" : Math.random() > 0.3 ? "Medium" : "Low",
          change: Math.random() > 0.5 ? "Increasing" : "Stable",
          trend: Math.random() > 0.6 ? "up" : "neutral"
        },
        {
          metric: "Supply Chain",
          value: Math.random() > 0.5 ? "Vulnerable" : "Stable",
          change: Math.random() > 0.7 ? "High Risk" : "Moderate Risk",
          trend: Math.random() > 0.6 ? "up" : "neutral"
        },
        {
          metric: "Market Volatility",
          value: `${(Math.random() * 50).toFixed(0)}%`,
          change: Math.random() > 0.6 ? "High Impact" : "Moderate Impact",
          trend: Math.random() > 0.5 ? "up" : "neutral"
        }
      ]
    },
    tweets: [
      {
        id: `fin-${Date.now()}-1`,
        content: `${symbol}'s Q${Math.floor(Math.random() * 4) + 1} revenue hit $${(Math.random() * 100).toFixed(2)}B, exceeding analyst expectations by ${(Math.random() * 15).toFixed(1)}%. Strong performance in ${Math.random() > 0.5 ? "product" : "service"} sales driving growth. #Earnings`,
        category: "financial",
        timestamp: "2h ago"
      },
      {
        id: `fin-${Date.now()}-2`,
        content: `${symbol}'s cash reserves at all-time high of $${(Math.random() * 50).toFixed(1)}B. Management signals increased shareholder returns through dividends and buybacks in coming quarters. #StockAlert`,
        category: "financial",
        timestamp: "4h ago"
      },
      {
        id: `fin-${Date.now()}-3`,
        content: `Operating margins for ${symbol} ${Math.random() > 0.5 ? "improved" : "declined"} to ${(Math.random() * 30).toFixed(1)}% due to ${Math.random() > 0.5 ? "cost-cutting measures" : "inflationary pressures"}. SEC filings show focus on operational efficiency.`,
        category: "financial",
        timestamp: "6h ago"
      },
      {
        id: `growth-${Date.now()}-1`,
        content: `${symbol} announced ${Math.floor(Math.random() * 5) + 1} new product lines launching in Q${Math.floor(Math.random() * 4) + 1}. R&D investments up ${(Math.random() * 30).toFixed(1)}% YoY, signaling aggressive innovation strategy. #GrowthStock`,
        category: "growth",
        timestamp: "3h ago"
      },
      {
        id: `growth-${Date.now()}-2`,
        content: `${symbol}'s market share in ${Math.random() > 0.5 ? "North America" : "Asia Pacific"} grew to ${(Math.random() * 25).toFixed(1)}%, overtaking key competitors. Expansion strategy paying off according to latest earnings call.`,
        category: "growth",
        timestamp: "5h ago"
      },
      {
        id: `growth-${Date.now()}-3`,
        content: `Customer acquisition costs for ${symbol} ${Math.random() > 0.7 ? "decreased" : "increased"} by ${(Math.random() * 15).toFixed(1)}% while retention rates improved to ${(Math.random() * 15 + 80).toFixed(1)}%. Strong sign of brand health.`,
        category: "growth",
        timestamp: "12h ago"
      },
      {
        id: `risk-${Date.now()}-1`,
        content: `SEC filings reveal ${symbol} facing ${Math.random() > 0.5 ? "potential regulatory challenges" : "litigation risks"} in key markets. Management allocated $${(Math.random() * 2).toFixed(1)}B contingency fund. Impact on operations remains uncertain.`,
        category: "risk",
        timestamp: "8h ago"
      },
      {
        id: `risk-${Date.now()}-2`,
        content: `${symbol}'s supply chain exposure to ${Math.random() > 0.5 ? "semiconductor shortages" : "geopolitical tensions"} highlighted as key risk factor. Diversification efforts underway but will take ${Math.floor(Math.random() * 12) + 6} months to implement.`,
        category: "risk",
        timestamp: "1d ago"
      },
      {
        id: `risk-${Date.now()}-3`,
        content: `Debt-to-equity ratio for ${symbol} at ${(Math.random() * 2).toFixed(2)}, ${Math.random() > 0.5 ? "higher than industry average" : "within acceptable range"}. Interest rate sensitivity could impact financing costs in coming quarters.`,
        category: "risk",
        timestamp: "2d ago"
      }
    ]
  };
};

export const mockApiCall = (query: string): Promise<StockData> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // If query looks like a stock symbol (all caps, 1-5 chars), use it directly
      // Otherwise, map some common company names to symbols
      let symbol = query.toUpperCase();
      
      if (query.length > 5 && !/^[A-Z]+$/.test(query)) {
        // This is probably a company name, map it
        const companyMap: Record<string, string> = {
          'apple': 'AAPL',
          'microsoft': 'MSFT',
          'google': 'GOOGL',
          'alphabet': 'GOOGL',
          'amazon': 'AMZN',
          'meta': 'META',
          'facebook': 'META',
          'tesla': 'TSLA',
          'nvidia': 'NVDA',
          'jpmorgan': 'JPM',
          'visa': 'V',
          'johnson': 'JNJ',
        };
        
        const lowerQuery = query.toLowerCase();
        
        for (const [company, stock] of Object.entries(companyMap)) {
          if (lowerQuery.includes(company)) {
            symbol = stock;
            break;
          }
        }
      }
      
      resolve(generateMockData(symbol));
    }, 1500); // 1.5 seconds delay to simulate API call
  });
};
