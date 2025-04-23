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
import { TypewriterText } from "@/components/TypewriterText";
import { StockPriceChart } from "@/components/StockPriceChart";

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
          <div className="my-8 p-4 bg-red-100 border-2 border-dashed border-red-300 rounded-md text-red-700 font-mono animate-fade-in">
            {error}
          </div>
        )}
        
        {!isLoading && !error && !stockData && <EmptyState />}
        
        {isLoading && (
          <div className="my-8 flex justify-center">
            <div className="text-center p-6 bg-retro-gray/30 border-2 border-dashed rounded-md w-full max-w-lg">
              <div className="inline-block mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary duration-1000" />
              </div>
              <div className="font-mono text-xl mb-2">
                <TypewriterText text="[Analyzing Stock Data]" speed={200} />
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                <TypewriterText 
                  text="Retrieving and analyzing SEC filings, earnings calls, and news..." 
                  speed={150}
                />
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && stockData && (
          <div className="w-full my-8 font-mono space-y-6">
            <div className="px-4 py-2 bg-retro-blue/50 border border-retro-blue rounded-md animate-fade-in duration-300">
              <h3 className="font-bold text-lg mb-2">
                <TypewriterText 
                  text={`${stockData.name} (${stockData.symbol})`}
                  speed={100}
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                <TypewriterText 
                  text="Analysis based on latest SEC filings and earnings reports"
                  speed={100}
                />
              </p>
            </div>
            
            {stockData.priceHistory && stockData.priceHistory.length > 0 && (
              <StockPriceChart data={stockData.priceHistory} className="mb-6" />
            )}
            
            <div className="animate-fade-in">
              <InsightTable insights={stockData.insights} />
            </div>
            
            <div className="animate-fade-in delay-200">
              <InsightTweets tweets={stockData.tweets} className="mt-6" />
            </div>
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
