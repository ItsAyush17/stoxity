
import { StockData, InsightItem, TweetInsight } from "@/types";

export const extractDataFromResponse = (apiResponse: any, query: string): StockData => {
  try {
    // Extract the text content from the API response
    const content = apiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid API response format");
    }
    
    console.log("Parsing content from API");
    
    // Extract company name and symbol
    const companyName = extractCompanyName(content, query);
    const symbol = query.toUpperCase();
    
    // Extract structured data from the formatted markdown content
    const financials = extractTableData(content);
    const tweets = extractInsightsAndNews(content);
    
    return {
      symbol,
      name: companyName,
      insights: {
        financials: financials.slice(0, 2),
        growth: financials.slice(2, 4),
        risks: financials.slice(4)
      },
      tweets: tweets
    };
  } catch (error) {
    console.error("Error parsing API response:", error);
    throw new Error(`Failed to parse stock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

function extractCompanyName(content: string, defaultName: string): string {
  // Try to extract company name from the content title
  const titleMatch = content.match(/### \*\*📊 (.*?) Stock Snapshot/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return defaultName;
}

function extractTableData(content: string): InsightItem[] {
  const insights: InsightItem[] = [];
  
  // Find the table section
  const tableSection = content.match(/### \*\*📊.*?\n\|.*?\|\n\|.*?\|([\s\S]*?)---/);
  
  if (tableSection && tableSection[1]) {
    // Extract table rows (each row is a pipe-separated line)
    const rows = tableSection[1].split('\n').filter(row => row.includes('|'));
    
    // Process each row to extract metrics
    rows.forEach(row => {
      const cells = row.split('|').filter(cell => cell.trim() !== '');
      if (cells.length >= 3) {
        const metric = cells[0].trim().replace(/\*\*/g, '');
        const value = cells[1].trim();
        
        // Determine trend from the third column
        let trend: "up" | "down" | "neutral" = "neutral";
        const trendCell = cells[2].toLowerCase();
        if (trendCell.includes('positive') || trendCell.includes('🔺')) {
          trend = "up";
        } else if (trendCell.includes('negative') || trendCell.includes('🔻')) {
          trend = "down";
        }
        
        insights.push({
          metric,
          value,
          trend
        });
      }
    });
  }
  
  return insights;
}

function extractInsightsAndNews(content: string): TweetInsight[] {
  const tweets: TweetInsight[] = [];
  
  // Extract Key Insights section
  const insightsMatch = content.match(/### \*\*🔍 Key Insights \(Tweet-Style\)\*\*([\s\S]*?)---/);
  if (insightsMatch && insightsMatch[1]) {
    const insightsText = insightsMatch[1].trim();
    const insightPoints = insightsText.split('\n').filter(line => line.trim().length > 0);
    
    // Process each insight point
    insightPoints.forEach((point, index) => {
      if (point.includes('️⃣')) {
        tweets.push({
          id: `insight-${Date.now()}-${index}`,
          content: point.replace(/^\d️⃣ /, ''),
          category: "growth",
          timestamp: randomTimestamp()
        });
      }
    });
  }
  
  // Extract News Highlights section
  const newsMatch = content.match(/### \*\*📰 Recent News Highlights\*\*([\s\S]*?)---/);
  if (newsMatch && newsMatch[1]) {
    const newsText = newsMatch[1].trim();
    const newsPoints = newsText.split('\n').filter(line => line.startsWith('-'));
    
    // Process each news point
    newsPoints.forEach((point, index) => {
      tweets.push({
        id: `news-${Date.now()}-${index}`,
        content: point.replace(/^- /, ''),
        category: "financial",
        timestamp: `${extractNewsDate(point)} ago`
      });
    });
  }
  
  // Extract Verdict section
  const verdictMatch = content.match(/### \*\*🎯 Verdict\*\*:([\s\S]*?)(?:\*\*#|$)/);
  if (verdictMatch && verdictMatch[1]) {
    const verdictText = verdictMatch[1].trim();
    
    // Add verdict as a risk insight
    tweets.push({
      id: `verdict-${Date.now()}`,
      content: `Verdict: ${verdictText.split('\n')[0].trim()}`,
      category: "risk",
      timestamp: "just now"
    });
    
    // Add risks as separate entries
    const risksMatch = verdictText.match(/\*\*Risks\*\*:(.*?)(?:\n\*\*|\n\n|$)/s);
    if (risksMatch && risksMatch[1]) {
      const risks = risksMatch[1].trim().split('\n- ').filter(r => r.trim() !== '');
      risks.forEach((risk, index) => {
        if (risk.trim().length > 0) {
          tweets.push({
            id: `risk-${Date.now()}-${index}`,
            content: `Risk: ${risk.replace(/^- /, '')}`,
            category: "risk",
            timestamp: randomTimestamp()
          });
        }
      });
    }
  }
  
  return tweets;
}

function extractNewsDate(newsPoint: string): string {
  const dateMatch = newsPoint.match(/\*\*(.*?)\*\*/);
  if (dateMatch && dateMatch[1]) {
    // Convert month names to rough time periods
    const datePart = dateMatch[1].toLowerCase();
    if (datePart.includes('may')) return '2w';
    if (datePart.includes('apr')) return '1m';
    if (datePart.includes('mar')) return '2m';
    if (datePart.includes('feb')) return '3m';
    if (datePart.includes('jan')) return '4m';
    return '1m';
  }
  return '1m';
}

function randomTimestamp(): string {
  const options = ["1h ago", "2h ago", "3h ago", "4h ago", "5h ago", "6h ago", "12h ago", "1d ago"];
  return options[Math.floor(Math.random() * options.length)];
}
