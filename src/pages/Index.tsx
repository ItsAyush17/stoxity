import { useState } from "react";
import { StockData } from "@/types";
import { getStockData, getStockSuggestions } from "@/services/stockService";
import { StockCard } from "@/components/StockCard";
import { SearchBar } from "@/components/SearchBar";

export default function Index() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    
    try {
      const stockData = await getStockData(searchQuery);
      setData(stockData);
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Stock Insights</h1>
        
        <SearchBar 
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          suggestions={getStockSuggestions(query)}
        />
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching stock data...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        )}
        
        {data && !loading && !error && (
          <StockCard data={data} />
        )}
      </div>
    </div>
  );
}
