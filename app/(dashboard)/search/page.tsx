'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PNODES } from '@/lib/pnode-api';

export default function SearchPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [uptimeRange, setUptimeRange] = useState(0); // Default to 0 to show all
  const [activeFilters, setActiveFilters] = useState<string[]>([]); // Start empty

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Status:')) setStatusFilter('All');
    if (filter.startsWith('Location:')) setLocationFilter('');
    if (filter.startsWith('Uptime')) setUptimeRange(0);
    // Note: State updates will trigger re-render and update activeFilters via the UI render logic, 
    // strictly speaking we should probably drive activeFilters from the primitive states to avoid sync issues.
    // The previous implementation had a disconnect between activeFilters state and the actual filter states.
    // For this pass, I will fix the UI to derive tags from the state.
  };

  // Use shared mock data
  const mockNodes = MOCK_PNODES;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-success/20 text-success border-success/20';
      case 'warning':
        return 'bg-warning/20 text-warning border-warning/20';
      case 'offline':
        return 'bg-error/20 text-error border-error/20';
      default:
        return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-success shadow-[0_0_10px_#0BDA51]';
      case 'warning':
        return 'bg-warning shadow-[0_0_10px_#FFB02E]';
      case 'offline':
        return 'bg-error shadow-[0_0_10px_#D0021B]';
      default:
        return 'bg-slate-400';
    }
  };

  // Search and Filter Logic
  const filteredNodes = mockNodes.filter((node) => {
    // Status Filter (Case insensitive match as API uses lowercase)
    if (statusFilter !== 'All' && node.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;

    // Location/Region Filter
    if (locationFilter && !node.region?.toLowerCase().includes(locationFilter.toLowerCase())) return false;

    // Uptime Filter
    if ((node.uptime || 0) < uptimeRange) return false;

    return true;
  });

  return (
    <>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          pNode <span className="text-primary">Explorer</span>
        </h1>
        <p className="text-white/40 text-lg">
          Search, filter, and analyze individual nodes in the Xandeum network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 glass p-6 rounded-2xl h-fit sticky top-4">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            Filters
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2" htmlFor="status-filter">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 appearance-none focus:outline-none focus:border-primary/50"
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option className="bg-[#0B0E14]">All</option>
                  <option className="bg-[#0B0E14]">online</option>
                  <option className="bg-[#0B0E14]">offline</option>
                  <option className="bg-[#0B0E14]">warning</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2" htmlFor="location-filter">
                Location
              </label>
              <input
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                id="location-filter"
                placeholder="e.g. USA, Tokyo"
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2" htmlFor="uptime-range">
                Min. Uptime: <span className="text-primary font-bold">{uptimeRange}%</span>
              </label>
              <input
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                id="uptime-range"
                max="100"
                min="0"
                type="range"
                value={uptimeRange}
                onChange={(e) => setUptimeRange(Number(e.target.value))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  // Apply logic is implicit in state
                  console.log('Filters Applied');
                }}
                className="flex-1 h-10 rounded-lg bg-primary text-[#0B0E14] font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setLocationFilter('');
                  setUptimeRange(0);
                }}
                className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Search Bar */}
          <div className="glass p-2 pl-4 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-white/40">search</span>
            <input
              className="flex-1 bg-transparent border-none text-white h-10 focus:outline-none placeholder:text-white/20"
              placeholder="Search by pNode name, ID, or wallet address..."
            />
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </div>

          {/* Active Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {statusFilter !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                <span className="font-medium capitalize">Status: {statusFilter}</span>
                <button onClick={() => setStatusFilter('All')} className="hover:text-white transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
            {locationFilter && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                <span className="font-medium">Location: {locationFilter}</span>
                <button onClick={() => setLocationFilter('')} className="hover:text-white transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
            {uptimeRange > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                <span className="font-medium">Uptime &gt; {uptimeRange}%</span>
                <button onClick={() => setUptimeRange(0)} className="hover:text-white transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            <p className="ml-auto text-sm text-white/40">Showing {filteredNodes.length} results</p>
          </div>

          {/* Table */}
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Name/ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Uptime</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNodes.length > 0 ? (
                  filteredNodes.map((node) => (
                    <tr key={node.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {node.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border capitalize ${getStatusColor(node.status || 'offline')}`}>
                          <div className={`size-1.5 rounded-full ${getStatusDot(node.status || 'offline')}`}></div>
                          {node.status || 'offline'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {node.region || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${node.uptime || 0}%` }}></div>
                          </div>
                          <span className="text-sm font-mono text-primary">{node.uptime || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/pnode/${node.id}`} className="text-sm font-medium text-white/40 group-hover:text-primary transition-colors flex items-center justify-end gap-1">
                          Details
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                      No pNodes found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <button className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`size-8 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${page === 1
                    ? 'bg-primary text-[#0B0E14] shadow-[0_0_10px_rgba(0,228,255,0.3)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-white/40">...</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

