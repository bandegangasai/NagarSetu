import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CategoryStat } from '../../types';

interface CategoryBarChartProps {
  data: CategoryStat[];
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  const chartData = data.slice(0, 6).map((item) => ({
    name: item.categoryName.split('/')[0].trim(),
    Total: item.count,
    Resolved: item.resolvedCount,
    color: item.color
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b' }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#16a34a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
