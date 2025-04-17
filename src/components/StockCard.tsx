import { StockData } from "@/types";

interface StockCardProps {
  data: StockData;
}

export function StockCard({ data }: StockCardProps) {
  const renderInsightItem = (item: { metric: string; value: string; change?: string; trend?: "up" | "down" | "neutral" }) => (
    <div key={item.metric} className="flex justify-between items-center py-2 border-b">
      <div className="font-medium">{item.metric}</div>
      <div className="flex items-center gap-2">
        <div>{item.value}</div>
        {item.change && (
          <div className={`text-sm ${item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
            {item.change}
          </div>
        )}
      </div>
    </div>
  );

  const renderTweet = (tweet: { id: string; content: string; category: string; timestamp: string }) => (
    <div key={tweet.id} className="p-4 border rounded-lg mb-2">
      <div className="text-sm text-gray-500 mb-1">{tweet.timestamp}</div>
      <div className="text-gray-800">{tweet.content}</div>
      <div className="mt-2">
        <span className={`px-2 py-1 rounded-full text-xs ${
          tweet.category === "financial" ? "bg-blue-100 text-blue-800" :
          tweet.category === "growth" ? "bg-green-100 text-green-800" :
          "bg-red-100 text-red-800"
        }`}>
          {tweet.category}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{data.symbol}</h2>
        <p className="text-gray-600">{data.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Financials</h3>
          {data.insights.financials.map(renderInsightItem)}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Growth</h3>
          {data.insights.growth.map(renderInsightItem)}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Risks</h3>
          {data.insights.risks.map(renderInsightItem)}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent News & Insights</h3>
        <div className="space-y-4">
          {data.tweets.map(renderTweet)}
        </div>
      </div>
    </div>
  );
} 