import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TransparencyStats } from '../../types';

interface SlaPieChartProps {
  stats: TransparencyStats;
}

export const SlaPieChart: React.FC<SlaPieChartProps> = ({ stats }) => {
  const data = [
    { name: 'Resolved & Verified', value: stats.resolvedCount, color: '#16a34a' },
    { name: 'In Progress / Action', value: stats.inProgressCount, color: '#f97316' },
    { name: 'Under Review / Assigned', value: stats.pendingCount, color: '#3b82f6' },
    { name: 'SLA Overdue', value: stats.overdueCount, color: '#dc2626' }
  ].filter((d) => d.value > 0);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
