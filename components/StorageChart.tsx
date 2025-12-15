'use client';

import { PNode } from '@/lib/pnode-api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StorageChartProps {
  pNodes: PNode[];
}

export default function StorageChart({ pNodes }: StorageChartProps) {
  // Group by region and calculate totals
  const regionData = pNodes.reduce((acc, node) => {
    const region = node.region || 'Unknown';
    if (!acc[region]) {
      acc[region] = { region, total: 0, used: 0 };
    }
    acc[region].total += node.storageCapacity || 0;
    acc[region].used += node.storageUsed || 0;
    return acc;
  }, {} as Record<string, { region: string; total: number; used: number }>);

  const chartData = Object.values(regionData).map((data) => ({
    region: data.region,
    'Total Capacity': parseFloat((data.total / 1000).toFixed(2)),
    'Used Storage': parseFloat((data.used / 1000).toFixed(2)),
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Storage by Region (PB)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis 
            dataKey="region" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--foreground)',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="Total Capacity" fill="#3b82f6" />
          <Bar dataKey="Used Storage" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

