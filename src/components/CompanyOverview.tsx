import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { StockData } from "@/types";

interface CompanyOverviewProps {
  data: StockData;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({ data }) => {
  if (!data) return null;

  const {
    name,
    symbol,
    sector,
    industry,
    marketCap,
    beta,
    dividendYield,
    description
  } = data;

  // Format market cap to display in billions/millions with B/M suffix
  const formatMarketCap = (cap?: number) => {
    if (!cap) return "N/A";
    return cap >= 1 
      ? `$${cap.toFixed(2)}B` 
      : `$${(cap * 1000).toFixed(2)}M`;
  };

  // Format dividend yield with % sign
  const formatDividend = (dividend?: number) => {
    if (!dividend && dividend !== 0) return "N/A";
    return `${dividend.toFixed(2)}%`;
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="text-2xl font-bold mr-2">{symbol}</span>
            <span className="text-xl text-muted-foreground">{name}</span>
          </div>
          {/* Can add stock price change indicator here */}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sector</p>
            <p className="font-semibold">{sector || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Industry</p>
            <p className="font-semibold">{industry || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">{formatMarketCap(marketCap)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Beta</p>
            <p className="font-semibold">{beta?.toFixed(2) || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dividend Yield</p>
            <p className="font-semibold">{formatDividend(dividendYield)}</p>
          </div>
        </div>

        {/* Company description */}
        {description && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Company Description</h4>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyOverview; 