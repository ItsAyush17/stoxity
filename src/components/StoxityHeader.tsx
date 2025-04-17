
import React from "react";
import { PieChart } from "lucide-react";

interface StoxityHeaderProps {
  children?: React.ReactNode;
}

export const StoxityHeader: React.FC<StoxityHeaderProps> = ({ children }) => {
  return (
    <header className="bg-retro-blue py-4 border-b-4 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-mono tracking-tight">STOXITY</h1>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
};
