
import React, { useState, useEffect } from "react";
import { StoxityHeader } from "@/components/StoxityHeader";
import { StockSearchForm } from "@/components/StockSearchForm";
import { StockInsightTabs } from "@/components/StockInsightTabs";
import { EmptyState } from "@/components/EmptyState";
import { StockData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { fetchStockData, getDeepSeekApiKey, setDeepSeekApiKey } from "@/services/deepSeekService";
import { ApiKeyInput } from "@/components/ApiKeyInput";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true); // Default to true since we have the API key
  const { toast } = useToast();

  useEffect(() => {
    // Set the API key programmatically
    const apiKey = "sk-0df192262b5c40b1ac46f00c16d5c417";
    setDeepSeekApiKey(apiKey);
    setHasApiKey(true);
    
    // Check URL params for direct stock query
    const params = new URLSearchParams(window.location.search);
    const stockQuery = params.get('q');
    if (stockQuery) {
      handleSearch(stockQuery);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update URL to enable sharing of search results
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

  const handleApiKeySubmit = (apiKey: string) => {
    setDeepSeekApiKey(apiKey);
    setHasApiKey(true);
    toast({
      title: "Success",
      description: "API key has been set successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoxityHeader />
      
      <main className="container mx-auto px-4 pb-16">
        {!hasApiKey && (
          <div className="max-w-3xl mx-auto my-8 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <h3 className="font-bold mb-2">DeepSeek API Key Required</h3>
            <p className="mb-4">To analyze stocks with real data, please provide your DeepSeek API key.</p>
            <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
          </div>
        )}
        
        <StockSearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="my-8 p-4 bg-red-100 border border-red-300 rounded-md text-red-700 font-mono">
            {error}
          </div>
        )}
        
        {!isLoading && !error && !stockData && <EmptyState />}
        
        {isLoading && (
          <div className="my-8 flex justify-center">
            <div className="text-center">
              <div className="inline-block animate-pulse mb-2">
                <div className="font-mono text-xl">[Analyzing]</div>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                Retrieving and analyzing SEC filings, earnings calls, and news...
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && stockData && (
          <StockInsightTabs data={stockData} />
        )}
        
        <footer className="text-center text-xs text-muted-foreground mt-16 pt-4 border-t">
          <p className="mb-1">Stoxity - AI-powered stock insights from SEC filings & earnings calls</p>
          <p>Powered by DeepSeek AI</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
