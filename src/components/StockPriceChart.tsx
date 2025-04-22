
import React from 'react';
import { StockData } from '@/types';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StockPriceChartProps {
  data: any[];
  className?: string;
}

const transformInsightsToChartData = (data: any[]) => {
  // If data is already in the right format or empty, return it
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Otherwise, transform it if needed
  return data.map((item, index) => ({
    name: item.name || item.date || `Point ${index + 1}`,
    value: typeof item.value === 'number' ? item.value : parseFloat(item.value || '0'),
  })).filter(item => !isNaN(item.value));
};

export const StockPriceChart: React.FC<StockPriceChartProps> = ({ data, className }) => {
  const chartData = transformInsightsToChartData(data || []);
  
  if (!chartData.length) {
    return null;
  }

  return (
    <Card className={`w-full bg-white animate-fade-in duration-500 ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">
          Financial Metrics Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer config={{
          line: {
            color: '#8B5CF6'
          }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name"
                tick={{ fill: '#666', fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                  padding: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorValue)"
                className="animate-fade-in"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
