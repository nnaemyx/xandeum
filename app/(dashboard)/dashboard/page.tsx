'use client';

import { useEffect, useState } from 'react';
import { PNode, calculateStats } from '@/lib/pnode-api';
import StatsOverview from '@/components/StatsOverview';
import NetworkHealth from '@/components/NetworkHealth';
import ActivePNodesChart from '@/components/ActivePNodesChart';
import PNodeTable from '@/components/PNodeTable';

export default function Dashboard() {
  const [pNodes, setPNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPNodes = async () => {
    // setLoading(true); // Don't show full loader on refresh
    setError(null);
    try {
      const response = await fetch('/api/pnodes');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPNodes(data.pNodes || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pNodes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPNodes();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPNodes, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = calculateStats(pNodes);

  return (
    <>
      {/* Title Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Dashboard <span className="text-primary">Overview</span>
        </h1>
        <p className="text-white/40 text-lg">
          Monitor Xandeum network performance and pNode status in real-time.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 flex items-center gap-3 backdrop-blur-md">
          <span className="material-symbols-outlined text-red-400">warning</span>
          <p>
            <span className="font-bold">Connection Error:</span> {error}. Showing cached or mock data.
          </p>
        </div>
      )}

      {loading && pNodes.length === 0 ? (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
          <div className="relative size-20">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-light text-white/50 animate-pulse">Initializing Dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <section className="animate-float" style={{ animationDuration: '4s' }}>
            <StatsOverview stats={stats} pNodes={pNodes} />
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivePNodesChart pNodes={pNodes} />
            <NetworkHealth lastUpdated={lastUpdated || undefined} pNodes={pNodes} />
          </section>

          {/* Table Section */}
          <section className="pt-4">
            <PNodeTable pNodes={pNodes} />
          </section>
        </>
      )}
    </>
  );
}
