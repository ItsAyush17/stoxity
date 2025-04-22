import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StockSearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const StockSearchForm: React.FC<StockSearchFormProps> = ({ 
  onSearch, 
  isLoading 
}) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-mono mb-2">Stock Analysis Terminal</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Enter any stock symbol or company name for AI-powered analysis
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any stock symbol or company name..."
              className="pl-10 font-mono border-2 bg-retro-yellow/30 focus:bg-white"
              disabled={isLoading}
            />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="bg-primary hover:bg-primary/80 font-mono"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </form>
    </div>
  );
};
