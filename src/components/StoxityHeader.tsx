
import React from "react";
import { Terminal } from "lucide-react";

export const StoxityHeader = () => {
  return (
    <header className="w-full py-6 border-b border-retro-gray/70">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-pixel tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            STOXITY
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-pixelify text-xs px-2 py-1 bg-retro-gray rounded-md">BETA v0.1</span>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};
