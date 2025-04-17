
import React, { useState } from "react";
import { StoxityHeader } from "@/components/StoxityHeader";
import { StockSearchForm } from "@/components/StockSearchForm";
import { StockInsightTabs } from "@/components/StockInsightTabs";
import { EmptyState } from "@/components/EmptyState";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { mockApiCall } from "@/services/mockData";
import { StockData } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!apiKey) {
      setError("API key is required. Please add your API key.");
      toast({
        title: "API Key Required",
        description: "Please add your API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we'd use the apiKey for authentication
      // For now, we'll just use the mock data
      const data = await mockApiCall(query);
      setStockData(data);
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
      });
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setError(null);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoxityHeader />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-end mt-4">
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        </div>
        
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
                Retrieving and analyzing SEC filings and earnings reports...
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && stockData && (
          <StockInsightTabs data={stockData} />
        )}
        
        <footer className="text-center text-xs text-muted-foreground mt-16 pt-4 border-t">
          <p className="mb-1">Stoxity - AI-powered retro stock insights</p>
          <p>Data provided for demonstration purposes only</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
