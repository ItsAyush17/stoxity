
import React from 'react';
import { StockData } from '@/types';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockPriceChartProps {
  data: StockData;
}

const transformInsightsToChartData = (data: StockData) => {
  // Transform financial insights into chart data
  return data.insights.financials.map((item) => ({
    name: item.metric,
    value: parseFloat(item.value.replace(/[^0-9.-]/g, '')) || 0,
  })).filter(item => !isNaN(item.value));
};

export const StockPriceChart: React.FC<StockPriceChartProps> = ({ data }) => {
  const chartData = transformInsightsToChartData(data);

  return (
    <div className="w-full h-[300px] bg-white rounded-lg border-2 border-primary/20 p-4 mt-4 mb-6">
      <h3 className="font-bold mb-4">Financial Metrics Chart</h3>
      <ChartContainer config={{
        line: {
          color: '#8B5CF6'
        }
      }}>
        <AreaChart data={chartData}>
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
            height={80}
          />
          <YAxis tick={{ fill: '#666', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8B5CF6" 
            fillOpacity={1} 
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
