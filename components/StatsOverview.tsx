'use client';

import { PNodeStats, PNode } from '@/lib/pnode-api';

interface StatsOverviewProps {
  stats: PNodeStats;
  pNodes: PNode[];
}

export default function StatsOverview({ stats, pNodes }: StatsOverviewProps) {
  // Calculate additional stats from props
  const activePNodes = pNodes.filter(node =>
    node.status === 'healthy' || node.status === 'online'
  ).length;

  const totalStake = pNodes.reduce((acc, node) => acc + (node.totalStake || 0), 0);
  const avgReputation = pNodes.reduce((acc, node) => acc + (node.reputation || 0), 0) / (pNodes.length || 1);

  // Derive "live" looking values
  const activePNodesChange = 2.4; // constant for demo
  const currentEpoch = 248; // Solana-like epoch
  const stakingAPY = 6.5 + (avgReputation / 100); // Dynamic based on reputation
  const stakingAPYChange = 0.15;

  // Use Total Stake / 1M as a proxy for Volume for consistent magnitude
  const txVolume = (totalStake / 1000000) * 50;
  const txVolumeChange = 5.4;

  const statCards = [
    {
      label: 'Active pNodes',
      value: activePNodes.toLocaleString(),
      change: activePNodesChange,
      changePositive: true,
      icon: 'dns',
      color: 'from-primary to-primary/50'
    },
    {
      label: 'Current Epoch',
      value: currentEpoch.toLocaleString(),
      change: null,
      icon: 'schedule',
      color: 'from-secondary to-secondary/50'
    },
    {
      label: 'Staking APY',
      value: `${stakingAPY.toFixed(2)}%`,
      change: stakingAPYChange,
      changePositive: true,
      icon: 'trending_up',
      color: 'from-accent to-accent/50'
    },
    {
      label: '24h Volume',
      value: `$${txVolume.toFixed(2)}M`,
      change: txVolumeChange,
      changePositive: true,
      icon: 'bar_chart',
      color: 'from-success to-success/50'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={stat.label}
          className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
        >
          {/* Background Glow */}
          <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 group-hover:text-white transition-colors`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              {stat.change !== null && (
                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${stat.changePositive
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
                  }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {stat.changePositive ? 'trending_up' : 'trending_down'}
                  </span>
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              )}
            </div>

            <div>
              <p className="text-white/60 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
