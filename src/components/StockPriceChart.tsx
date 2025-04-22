import React from 'react';
import { StockData } from '@/types';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className={`w-full h-[60px] bg-white rounded-lg border-2 border-primary/20 p-6 mb-8 animate-fade-in ${className || ''}`}>
      <h3 className="font-bold mb-6 text-lg">Financial Metrics Chart</h3>
      <div className="h-[460px]">
        <ChartContainer config={{
          line: {
            color: '#8B5CF6'
          }
        }}>
          <ResponsiveContainer width="40%" height="20%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  <stop offset="20%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  <stop offset="80%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name"
                hide={true}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '0px solid #ccc',
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
      </div>
    </div>
  );
};
