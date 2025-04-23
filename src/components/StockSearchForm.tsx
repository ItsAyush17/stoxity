import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { stockSuggestions } from "@/data/stockSuggestions";
import { CompanyNotFound } from "./CompanyNotFound";

interface StockSearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const StockSearchForm: React.FC<StockSearchFormProps> = ({ 
  onSearch, 
  isLoading 
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showNotFound, setShowNotFound] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredSuggestions = stockSuggestions.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Limit to 8 suggestions

  const isValidStock = (symbol: string): boolean => {
    return stockSuggestions.some(stock => 
      stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }

    if (!isValidStock(query.trim())) {
      setShowNotFound(true);
      return;
    }

    setShowSuggestions(false);
    setShowNotFound(false);
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex > -1) {
        setQuery(filteredSuggestions[selectedIndex].symbol);
        setShowSuggestions(false);
        setShowNotFound(false);
        onSearch(filteredSuggestions[selectedIndex].symbol);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-mono mb-2">Stock Analysis Terminal</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Search from our curated list of stocks for AI-powered analysis
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                  setSelectedIndex(-1);
                  setShowNotFound(false);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for a stock from our suggestions..."
                className="pl-10 font-mono border-2 bg-retro-yellow/30 focus:bg-white"
                disabled={isLoading}
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                {filteredSuggestions.map((stock, index) => (
                  <div
                    key={stock.symbol}
                    className={`px-4 py-2 cursor-pointer ${
                      index === selectedIndex ? 'bg-primary/10' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setQuery(stock.symbol);
                      setShowSuggestions(false);
                      setShowNotFound(false);
                      onSearch(stock.symbol);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-mono font-bold">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                      </div>
                      {stock.sector && (
                        <div className="text-xs text-gray-500">{stock.sector}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        </div>
      </form>

      {showNotFound && (
        <div className="mt-8">
          <CompanyNotFound searchQuery={query} />
        </div>
      )}
    </div>
  );
};
