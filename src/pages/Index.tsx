
import React, { useState } from "react";
import { StoxityHeader } from "@/components/StoxityHeader";
import { StockSearchForm } from "@/components/StockSearchForm";
import { InsightTable } from "@/components/InsightTable";
import { InsightTweets } from "@/components/InsightTweets";
import { EmptyState } from "@/components/EmptyState";
import { StockData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { fetchStockData } from "@/services/stockService";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.replaceState({}, '', url);
      
      const data = await fetchStockData(query);
      setStockData(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch stock data. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <StoxityHeader />
      
      <main className="container mx-auto px-4 pb-16">
        <StockSearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="my-8 p-4 bg-red-100 border-2 border-dashed border-red-300 rounded-md text-red-700 font-mono">
            {error}
          </div>
        )}
        
        {!isLoading && !error && !stockData && <EmptyState />}
        
        {isLoading && (
          <div className="my-8 flex justify-center">
            <div className="text-center p-6 bg-retro-gray/30 border-2 border-dashed rounded-md w-full max-w-lg">
              <div className="inline-block mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="font-mono text-xl mb-2 animate-pulse">[Analyzing]</div>
              <p className="text-muted-foreground font-mono text-sm">
                Retrieving and analyzing SEC filings, earnings calls, and news...
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && stockData && (
          <div className="w-full my-8 font-mono">
            <div className="px-4 py-2 bg-retro-blue/50 border border-retro-blue rounded-md mb-4">
              <h3 className="font-bold text-lg mb-2">{stockData.name} ({stockData.symbol})</h3>
              <p className="text-sm text-muted-foreground">
                Analysis based on latest SEC filings and earnings reports
              </p>
            </div>
            
            <InsightTable insights={stockData.insights} />
            <InsightTweets tweets={stockData.tweets} className="mt-6" />
          </div>
        )}
        
        <footer className="text-center text-xs text-muted-foreground mt-16 pt-4 border-t border-dashed">
          <p className="mb-1 font-mono">Stoxity - AI-powered stock insights from SEC filings & earnings calls</p>
          <p className="font-mono">Powered by DeepSeek AI</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
