
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightTable } from "./InsightTable";
import { InsightTweets } from "./InsightTweets";
import { FileText, FileBadge } from "lucide-react";
import { StockData } from "@/types";

interface StockInsightTabsProps {
  data: StockData | null;
}

export const StockInsightTabs: React.FC<StockInsightTabsProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full my-8 font-mono">
      <div className="px-4 py-2 bg-retro-blue/50 border border-retro-blue rounded-md mb-4">
        <h3 className="font-bold text-lg mb-2">{data.name} ({data.symbol})</h3>
        <p className="text-sm text-muted-foreground">
          Analysis based on latest SEC filings and earnings reports
        </p>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="w-full mb-4 bg-retro-gray/70">
          <TabsTrigger value="table" className="flex items-center gap-2 flex-1">
            <FileText className="h-4 w-4" />
            <span>Table View</span>
          </TabsTrigger>
          <TabsTrigger value="tweets" className="flex items-center gap-2 flex-1">
            <FileBadge className="h-4 w-4" />
            <span>News Report</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <InsightTable insights={data.insights} />
        </TabsContent>
        
        <TabsContent value="tweets">
          <InsightTweets tweets={data.tweets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
