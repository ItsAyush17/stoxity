
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InsightItem } from "@/types";

interface InsightTableProps {
  insights: {
    financials: InsightItem[];
    growth: InsightItem[];
    risks: InsightItem[];
  };
}

export const InsightTable: React.FC<InsightTableProps> = ({ insights }) => {
  return (
    <div className="grid gap-6">
      {Object.entries(insights).map(([category, categoryInsights], categoryIndex) => (
        <Card 
          key={category} 
          className={`border-2 border-primary/20 bg-white opacity-0 animate-fade-in`}
          style={{ 
            animationDelay: `${categoryIndex * 200}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <CardContent className="p-0">
            <div className={`p-3 border-b border-primary/20 ${
              category === 'financials' ? 'bg-retro-blue/30' :
              category === 'growth' ? 'bg-retro-yellow/30' :
              'bg-retro-pink/30'
            }`}>
              <h3 className="font-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryInsights.map((item, i) => (
                  <TableRow 
                    key={i} 
                    className="font-mono text-sm opacity-0 animate-fade-in"
                    style={{ 
                      animationDelay: `${(categoryIndex * 200) + ((i + 1) * 100)}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <TableCell>{item.metric}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1">
                      {item.change}
                      {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {item.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {item.trend === "neutral" && <Minus className="h-4 w-4 text-gray-500" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
