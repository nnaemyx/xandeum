'use client';

import { PNode } from '@/lib/pnode-api';

interface NetworkHealthProps {
  lastUpdated?: Date;
  pNodes?: PNode[];
}

export default function NetworkHealth({ lastUpdated, pNodes = [] }: NetworkHealthProps) {
  // Calculate stats from pNodes
  const avgLatency = pNodes.length > 0
    ? Math.round(pNodes.reduce((acc, node) => acc + (node.latency || 0), 0) / pNodes.length)
    : 0;

  const totalPeers = pNodes.length * 12 + 450; // Simulation: each node has ~12 peers + base

  return (
    <div className="glass flex flex-col gap-6 rounded-2xl p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-white text-lg font-bold">Network Health</h3>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className="relative size-40 flex items-center justify-center">
          {/* Animated Circles */}
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-success/30 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-4 border-4 border-success/50 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '5s' }} />

          {/* Center Icon */}
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-4xl text-success drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
              check_circle
            </span>
            <span className="text-sm font-bold text-white tracking-wider">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
          <p className="text-xs text-white/40 mb-1">Avg Latency</p>
          <p className="text-sm font-bold text-success">{avgLatency}ms</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
          <p className="text-xs text-white/40 mb-1">Active Peers</p>
          <p className="text-sm font-bold text-primary">{totalPeers}</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <div className="h-full bg-success/50 w-full animate-pulse"></div>
      </div>
    </div>
  );
}
