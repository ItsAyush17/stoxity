
import { StockData, InsightItem, TweetInsight } from "@/types";

export const extractDataFromResponse = (apiResponse: any, query: string): StockData => {
  try {
    // Extract the text content from the API response
    const content = apiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid API response format");
    }
    
    console.log("Raw content from API:", content);
    
    // Attempt to extract structured data from markdown content
    const stockData = extractStructuredDataFromMarkdown(content, query);
    if (stockData) {
      return stockData;
    }
    
    // If structured extraction fails, fall back to basic extraction
    throw new Error("Structured data extraction failed");
  } catch (error) {
    console.error("Error parsing API response:", error);
    // Fallback to a basic structure if parsing fails
    return createFallbackStockData(query);
  }
};

function extractStructuredDataFromMarkdown(content: string, symbol: string): StockData | null {
  try {
    // Normalize the symbol and determine company name
    const upperSymbol = symbol.toUpperCase();
    let companyName = upperSymbol;
    
    // Try to extract company name from the content
    const nameMatch = content.match(/analysis of \*\*(.*?)\*\*/i) || 
                      content.match(/analysis for \*\*(.*?)\*\*/i) ||
                      content.match(/^# (.*?)$/m);
    
    if (nameMatch && nameMatch[1]) {
      companyName = nameMatch[1].replace(/\(.*?\)/g, '').trim();
    }
    
    // Extract financial metrics
    const financials: InsightItem[] = extractTableData(content, 'Financial', 'financials');
    
    // Extract growth indicators
    const growth: InsightItem[] = extractTableData(content, 'Growth', 'growth');
    
    // Extract risk factors
    const risks: InsightItem[] = extractTableData(content, 'Risk', 'risks');
    
    // Extract tweet-like updates
    const tweets: TweetInsight[] = extractTweetData(content);
    
    return {
      symbol: upperSymbol,
      name: companyName,
      insights: {
        financials: financials.length > 0 ? financials : generateDummyInsights('financial'),
        growth: growth.length > 0 ? growth : generateDummyInsights('growth'),
        risks: risks.length > 0 ? risks : generateDummyInsights('risk')
      },
      tweets: tweets.length > 0 ? tweets : generateDummyTweets(upperSymbol)
    };
  } catch (error) {
    console.error("Error in structured data extraction:", error);
    return null;
  }
}

function extractTableData(content: string, sectionKeyword: string, fallbackCategory: string): InsightItem[] {
  const insights: InsightItem[] = [];
  
  // Try to find tables with the given keyword
  const sections = content.split(/---|\n##/);
  const relevantSections = sections.filter(section => 
    section.toLowerCase().includes(sectionKeyword.toLowerCase())
  );
  
  for (const section of relevantSections) {
    // Look for markdown tables in this section
    const tableRows = section.match(/\|.*\|/g);
    if (tableRows && tableRows.length > 2) {
      // Skip header and separator rows
      for (let i = 2; i < tableRows.length; i++) {
        const cells = tableRows[i].split('|').filter(cell => cell.trim().length > 0);
        if (cells.length >= 2) {
          const metric = cells[0].trim().replace(/\*\*/g, '');
          const value = cells[1].trim().replace(/\*\*/g, '');
          let change = cells.length > 2 ? cells[2].trim().replace(/\*\*/g, '') : '';
          let trend: "up" | "down" | "neutral" = "neutral";
          
          // Try to determine trend
          const lowerChange = change.toLowerCase();
          if (lowerChange.includes('up') || lowerChange.includes('+') || lowerChange.includes('increase')) {
            trend = "up";
          } else if (lowerChange.includes('down') || lowerChange.includes('-') || lowerChange.includes('decrease')) {
            trend = "down";
          }
          
          insights.push({ metric, value, change, trend });
        }
      }
    }
    
    // If no tables found, look for bullet points
    if (insights.length === 0) {
      const bulletPoints = section.match(/[•✅➡️👉✓*-]\s+(.*)/g);
      if (bulletPoints) {
        bulletPoints.forEach((point, index) => {
          const text = point.replace(/[•✅➡️👉✓*-]\s+/, '').trim();
          const parts = text.split(':');
          
          if (parts.length >= 2) {
            insights.push({
              metric: parts[0].trim().replace(/\*\*/g, ''),
              value: parts[1].trim().replace(/\*\*/g, ''),
              trend: text.toLowerCase().includes('up') || text.toLowerCase().includes('+') ? "up" : 
                    text.toLowerCase().includes('down') || text.toLowerCase().includes('-') ? "down" : "neutral"
            });
          } else if (text.length > 0) {
            insights.push({
              metric: `Key Point ${index + 1}`,
              value: text.replace(/\*\*/g, ''),
              trend: "neutral"
            });
          }
        });
      }
    }
    
    // If we found insights, return them
    if (insights.length > 0) {
      return insights.slice(0, 5); // Limit to 5 items
    }
  }
  
  return insights;
}

function extractTweetData(content: string): TweetInsight[] {
  const tweets: TweetInsight[] = [];
  
  // Try to find tweet-like content (look for 🐦, Tweet, or News sections)
  const tweetPatterns = [
    /🐦\s+[""]([^""]+)[""]/g,
    /Tweet:\s+[""]([^""]+)[""]/gi,
    /\*\*[""]([^""]+)[""]\*\*/g
  ];
  
  let allMatches: string[] = [];
  
  // Extract tweets using different patterns
  tweetPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        allMatches.push(match[1].trim());
      }
    }
  });
  
  // If no matches with patterns, try to find sections with News or Recent Updates
  if (allMatches.length === 0) {
    const sections = content.split(/---|\n##/);
    const newsSections = sections.filter(section => 
      section.toLowerCase().includes('news') || 
      section.toLowerCase().includes('tweet') || 
      section.toLowerCase().includes('update')
    );
    
    if (newsSections.length > 0) {
      // Extract bullet points from news sections
      newsSections.forEach(section => {
        const bulletPoints = section.match(/[•✅➡️👉✓*-]\s+(.*)/g);
        if (bulletPoints) {
          bulletPoints.forEach(point => {
            const text = point.replace(/[•✅➡️👉✓*-]\s+/, '').trim();
            if (text.length > 0) {
              allMatches.push(text);
            }
          });
        }
      });
    }
  }
  
  // Convert the extracted text to tweet objects
  allMatches.forEach((text, index) => {
    // Try to determine the category
    let category: "financial" | "growth" | "risk" = "financial";
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('risk') || lowerText.includes('warn') || lowerText.includes('threat') || lowerText.includes('challeng')) {
      category = "risk";
    } else if (lowerText.includes('growth') || lowerText.includes('expan') || lowerText.includes('increase') || lowerText.includes('improve')) {
      category = "growth";
    }
    
    tweets.push({
      id: `${category}-${Date.now()}-${index}`,
      content: text,
      category,
      timestamp: generateRandomTimestamp()
    });
  });
  
  return tweets;
}

function generateRandomTimestamp(): string {
  const options = ["1h ago", "2h ago", "3h ago", "4h ago", "5h ago", "6h ago", "12h ago", "1d ago"];
  return options[Math.floor(Math.random() * options.length)];
}

function generateDummyInsights(category: string): InsightItem[] {
  const baseInsights: Record<string, InsightItem[]> = {
    'financial': [
      { metric: "Revenue", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Net Income", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "EPS", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Operating Margin", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Free Cash Flow", value: "Data pending", change: "Analyzing", trend: "neutral" }
    ],
    'growth': [
      { metric: "YoY Growth", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Market Share", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Customer Growth", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Product Line Expansion", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "International Expansion", value: "Data pending", change: "Analyzing", trend: "neutral" }
    ],
    'risk': [
      { metric: "Market Volatility", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Competitive Pressure", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Regulatory Changes", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Supply Chain", value: "Data pending", change: "Analyzing", trend: "neutral" },
      { metric: "Industry Disruption", value: "Data pending", change: "Analyzing", trend: "neutral" }
    ]
  };
  
  return baseInsights[category] || baseInsights['financial'];
}

function generateDummyTweets(symbol: string): TweetInsight[] {
  return [
    {
      id: `financial-${Date.now()}-1`,
      content: `Analyzing ${symbol} latest earnings report. Financial metrics and trends will be available shortly.`,
      category: "financial",
      timestamp: "just now"
    },
    {
      id: `growth-${Date.now()}-1`,
      content: `Examining growth trajectory for ${symbol}. Stay tuned for detailed insights on expansion and market share.`,
      category: "growth",
      timestamp: "just now"
    },
    {
      id: `risk-${Date.now()}-1`,
      content: `Evaluating risk factors affecting ${symbol}. Details on market conditions and competitive landscape coming up.`,
      category: "risk",
      timestamp: "just now"
    }
  ];
}

const createFallbackStockData = (query: string): StockData => {
  const symbol = query.toUpperCase();
  return {
    symbol,
    name: symbol,
    insights: {
      financials: [
        { metric: "Revenue", value: "Data unavailable", change: "Retry analysis", trend: "neutral" },
        { metric: "Net Income", value: "Data unavailable", change: "Retry analysis", trend: "neutral" },
        { metric: "EPS", value: "Data unavailable", change: "Retry analysis", trend: "neutral" }
      ],
      growth: [
        { metric: "YOY Growth", value: "Data unavailable", change: "Retry analysis", trend: "neutral" },
        { metric: "Market Share", value: "Data unavailable", change: "Retry analysis", trend: "neutral" }
      ],
      risks: [
        { metric: "Market Risk", value: "Data unavailable", change: "Retry analysis", trend: "neutral" },
        { metric: "Regulatory Risk", value: "Data unavailable", change: "Retry analysis", trend: "neutral" }
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
