import { useState, useEffect, useRef } from "react";
import { StockSuggestion } from "@/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: StockSuggestion[];
}

export function SearchBar({ value, onChange, onSearch, suggestions }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    onChange(suggestion.symbol);
    setShowSuggestions(false);
    onSearch(suggestion.symbol);
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Enter stock symbol or company name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.symbol}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.symbol}</div>
              <div className="text-sm text-gray-600">{suggestion.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 