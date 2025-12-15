'use client';

import { useState } from 'react';
import { PNode } from '@/lib/pnode-api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PNodeTableProps {
  pNodes: PNode[];
}

type SortField = 'id' | 'status' | 'uptime' | 'totalStake' | 'recentRewards';
type SortDirection = 'asc' | 'desc';

export default function PNodeTable({ pNodes }: PNodeTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('totalStake');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Increased slightly

  // Sort
  const sortedNodes = [...pNodes].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'status') {
      const statusOrder = { 'healthy': 3, 'warning': 2, 'critical': 1, 'online': 3, 'syncing': 2, 'offline': 1 };
      aVal = statusOrder[a.status || 'offline'] || 0;
      bVal = statusOrder[b.status || 'offline'] || 0;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedNodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNodes = sortedNodes.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Status', 'Uptime (%)', 'Stake (XAN)', 'Rewards (24h)', 'IP Address', 'Version'];

    const rows = pNodes.map(node => [
      node.id,
      node.status || 'unknown',
      node.uptime || 0,
      node.totalStake || 0,
      node.recentRewards || 0,
      node.ip || 'N/A',
      node.version || 'N/A'
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `xandeum_pnodes_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass flex flex-col gap-6 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div>
          <h3 className="text-white text-lg font-bold">Active pNodes</h3>
          <p className="text-white/40 text-sm">Real-time node performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="w-full relative z-10 overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/40 uppercase tracking-wider font-semibold text-xs backdrop-blur-md">
            <tr>
              <SortableHeader label="pNode ID" field="id" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} className="pl-6" />
              <SortableHeader label="Status" field="status" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Uptime" field="uptime" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Stake (XAN)" field="totalStake" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Rewards (24h)" field="recentRewards" currentSort={sortField} sortDirection={sortDirection} onSort={handleSort} className="pr-6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedNodes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/40 italic">
                  No pNodes found
                </td>
              </tr>
            ) : (
              paginatedNodes.map((node, i) => (
                <tr
                  key={node.pubkey}
                  className="group hover:bg-white/[0.02] transition-colors duration-200"
                  style={{ animation: `fadeIn 0.3s ease-out forwards ${i * 0.05}s`, opacity: 0 }}
                >
                  <td className="py-4 pl-6 font-mono text-primary font-medium">
                    <Link href={`/pnode/${node.id}`} className="hover:underline decoration-primary/50 underline-offset-4 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_8px_#00E4FF] transition-all"></span>
                      {node.id}
                    </Link>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={node.status || 'offline'} />
                  </td>
                  <td className="py-4 text-white/80 font-medium">
                    {node.uptime ? (
                      <span className={node.uptime > 98 ? 'text-success' : node.uptime > 95 ? 'text-warning' : 'text-error'}>
                        {node.uptime.toFixed(2)}%
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-4 text-white/80">
                    {node.totalStake ? node.totalStake.toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-4 pr-6 text-white/80 font-mono">
                    {node.recentRewards ? (
                      <span className="text-secondary font-bold">+{node.recentRewards.toFixed(2)}</span>
                    ) : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 z-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="size-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          <div className="flex items-center gap-1">
            <span className="text-sm text-white/60">
              Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="size-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SortableHeader({ label, field, currentSort, sortDirection, onSort, className = '' }: any) {
  return (
    <th
      className={`py-3 text-left font-semibold cursor-pointer group hover:text-white transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={`material-symbols-outlined text-[10px] h-[6px] leading-[0] ${currentSort === field && sortDirection === 'asc' ? 'text-primary' : 'text-white/30'}`}>expand_less</span>
          <span className={`material-symbols-outlined text-[10px] h-[6px] leading-[0] ${currentSort === field && sortDirection === 'desc' ? 'text-primary' : 'text-white/30'}`}>expand_more</span>
        </div>
      </div>
    </th>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    healthy: { label: 'HEALTHY', className: 'bg-success/10 text-success border-success/20 shadow-[0_0_10px_rgba(0,255,157,0.2)]' },
    warning: { label: 'WARNING', className: 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_10px_rgba(255,184,0,0.2)]' },
    critical: { label: 'CRITICAL', className: 'bg-error/10 text-error border-error/20 shadow-[0_0_10px_rgba(255,59,48,0.2)]' },
    online: { label: 'ONLINE', className: 'bg-success/10 text-success border-success/20 shadow-[0_0_10px_rgba(0,255,157,0.2)]' },
    syncing: { label: 'SYNCING', className: 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,228,255,0.2)]' },
    offline: { label: 'OFFLINE', className: 'bg-white/5 text-white/40 border-white/10' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
