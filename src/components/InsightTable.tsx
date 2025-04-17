
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InsightItem } from "./StockInsightTabs";

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
      <Card className="border-2 border-primary/20 bg-white">
        <CardContent className="p-0">
          <div className="bg-retro-blue/30 p-3 border-b border-primary/20">
            <h3 className="font-bold">Financial Performance</h3>
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
              {insights.financials.map((item, i) => (
                <TableRow key={i} className="font-mono text-sm">
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

      <Card className="border-2 border-primary/20 bg-white">
        <CardContent className="p-0">
          <div className="bg-retro-yellow/30 p-3 border-b border-primary/20">
            <h3 className="font-bold">Growth Indicators</h3>
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
              {insights.growth.map((item, i) => (
                <TableRow key={i} className="font-mono text-sm">
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

      <Card className="border-2 border-primary/20 bg-white">
        <CardContent className="p-0">
          <div className="bg-retro-pink/30 p-3 border-b border-primary/20">
            <h3 className="font-bold">Risk Factors</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px]">Factor</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead className="text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.risks.map((item, i) => (
                <TableRow key={i} className="font-mono text-sm">
                  <TableCell>{item.metric}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {item.change}
                    {item.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {item.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {item.trend === "neutral" && <Minus className="h-4 w-4 text-gray-500" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
