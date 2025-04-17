
import React, { useState } from "react";
import { StoxityHeader } from "@/components/StoxityHeader";
import { StockSearchForm } from "@/components/StockSearchForm";
import { StockInsightTabs } from "@/components/StockInsightTabs";
import { EmptyState } from "@/components/EmptyState";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { getStockAnalysisFromGemini } from "@/services/geminiService";
import { StockData } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key); // Store API key in localStorage (temporary solution)
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for this session.",
    });
  };

  const handleSearch = async (query: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide your Gemini API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call Gemini API service
      const data = await getStockAnalysisFromGemini(query, apiKey);
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

  // Check for previously saved API key on component mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StoxityHeader>
        <div className="ml-auto">
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        </div>
      </StoxityHeader>
      
      <main className="container mx-auto px-4 pb-16">
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
