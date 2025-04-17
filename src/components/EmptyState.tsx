
import React from "react";
import { Terminal } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Terminal className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-mono mb-2 text-center">Welcome to Stoxity Terminal</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Enter a stock symbol or company name to get AI-powered insights from SEC filings and earnings reports
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="border border-dashed border-muted rounded-md p-3 text-center">
          <p className="font-mono text-lg">AAPL</p>
          <p className="text-xs text-muted-foreground">Stock Symbol</p>
        </div>
        <div className="border border-dashed border-muted rounded-md p-3 text-center">
          <p className="font-mono text-lg">Apple Inc.</p>
          <p className="text-xs text-muted-foreground">Company Name</p>
        </div>
      </div>
    </div>
  );
};
