
import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockSuggestion } from "@/types";
import { searchStocks, validateStockSymbol } from "@/services/stockService";
import { useToast } from "@/hooks/use-toast";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StockSearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const StockSearchForm: React.FC<StockSearchFormProps> = ({ 
  onSearch, 
  isLoading 
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (query) {
      const results = searchStocks(query);
      setSuggestions(results);
      setOpen(results.length > 0);
      
      // All non-empty queries are considered valid
      setIsValid(query.trim().length > 0);
    } else {
      setSuggestions([]);
      setOpen(false);
      setIsValid(null);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Any non-empty query is valid
    const isValidQuery = validateStockSymbol(query);
    setIsValid(isValidQuery);
    
    if (isValidQuery) {
      onSearch(query);
      setOpen(false);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a company name or stock symbol.",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionSelect = (value: string) => {
    setQuery(value);
    setOpen(false);
    setIsValid(true);
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
        <p className="text-muted-foreground">
          Enter any stock symbol or company name for AI-powered analysis
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search any stock symbol or company name..."
                  className="pl-10 font-mono border-2 bg-retro-yellow/30 focus:bg-white"
                  disabled={isLoading}
                />
                {query.trim() !== "" && !isLoading && (
                  <button 
                    type="button" 
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty className="py-2 px-2 text-sm text-center">
                    No suggestions found
                  </CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((stock) => (
                      <CommandItem
                        key={stock.symbol}
                        value={stock.symbol}
                        onSelect={() => handleSuggestionSelect(stock.symbol)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="font-mono">{stock.symbol}</div>
                        <div className="text-muted-foreground text-xs">{stock.name}</div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
