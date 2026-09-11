import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DepartmentPerformance } from '../../types';

interface DeptPerformanceChartProps {
  data: DepartmentPerformance[];
}

export const DeptPerformanceChart: React.FC<DeptPerformanceChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    name: d.name.split('&')[0].trim().slice(0, 18),
    Resolved: d.resolved,
    InProgress: d.inProgress,
    Overdue: d.overdue
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 40, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#334155' }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar dataKey="Resolved" fill="#16a34a" stackId="a" radius={[0, 0, 0, 0]} />
          <Bar dataKey="InProgress" fill="#f97316" stackId="a" />
          <Bar dataKey="Overdue" fill="#dc2626" stackId="a" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
