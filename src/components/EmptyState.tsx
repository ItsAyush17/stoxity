
import React from "react";
import { Terminal } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-retro-beige flex items-center justify-center mb-6 border-2 border-dashed">
        <Terminal className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-mono mb-2 text-center">Welcome to Stoxity Terminal</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6 font-mono">
        Enter any stock symbol or company name to get AI-powered insights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
        <div className="border-2 border-dashed border-muted rounded-md p-3 text-center bg-retro-blue/40">
          <p className="font-mono text-lg">AAPL</p>
          <p className="text-xs text-muted-foreground font-mono">Apple Inc.</p>
        </div>
        <div className="border-2 border-dashed border-muted rounded-md p-3 text-center bg-retro-pink/40">
          <p className="font-mono text-lg">MSFT</p>
          <p className="text-xs text-muted-foreground font-mono">Microsoft</p>
        </div>
        <div className="border-2 border-dashed border-muted rounded-md p-3 text-center bg-retro-yellow/40">
          <p className="font-mono text-lg">TSLA</p>
          <p className="text-xs text-muted-foreground font-mono">Tesla Inc.</p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-retro-gray/50 border-2 border-dashed w-full max-w-lg text-center">
        <p className="font-mono text-sm">Type any company name or ticker symbol to begin analysis</p>
      </div>
    </div>
  );
};
