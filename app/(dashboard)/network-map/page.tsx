'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PNODES } from '@/lib/pnode-api';

export default function NetworkMapPage() {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

  // Use shared data
  const mockActiveNodes = MOCK_PNODES
    .filter(n => n.status === 'online' || n.status === 'warning')
    .slice(0, 10);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Network <span className="text-primary">Topology</span>
        </h1>
        <p className="text-white/40 text-lg">
          Live geographical distribution of Xandeum pNodes.
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] relative">
        {/* Map Container */}
        <div className="flex-1 glass rounded-2xl overflow-hidden relative min-h-[500px] group">
          {/* Background Map Image (Placeholder) */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-500 ease-out"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpLO4gFhN24tiQetd4znoHZiERIOA8y5yWsUykc0Yga4g82ANs5flYfmMXAf9F2E-a7on0um8U_TfRFphSHqYrwpk_IzmLrY0qBIpS7yqRtcAEFq45Iv8Llm8OlOY-mnGkFgB9dgY-LjkzLDb8yEp7hSxhSHl1Nj7hxXWNCIWgnm6HE0g0LK4e4o4sh4817ttWpqurOEQ4YTpU2j7AoLQb9mjDxAuscVkwFIIjLeAQAdLRUiPf7v1Axnr9OS8QWrd3w59OHKUqGEM')",
              transform: `scale(${zoom})`,
            }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent pointer-events-none" />

          {/* Map Controls */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <button
              onClick={() => setZoom(1)}
              className="size-10 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors mt-2 text-glow shadow-lg"
            >
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
        </div>

        {/* Sidebar / Overlay Stats */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Stats Cards */}
          <div className="glass p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40">Active Nodes</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <div className="size-10 rounded-full bg-success/20 flex items-center justify-center text-success">
              <span className="material-symbols-outlined">dns</span>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40">Regions</p>
              <p className="text-2xl font-bold text-white">14</p>
            </div>
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">public</span>
            </div>
          </div>

          {/* Active List */}
          <div className="glass p-5 rounded-2xl flex flex-col gap-4 flex-1 max-h-[400px]">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list</span>
              Top Active Nodes
            </h3>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
              {mockActiveNodes.map((node) => (
                <Link
                  key={node.id}
                  href={`/pnode/${node.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-primary group-hover:text-primary/80 transition-colors">{node.id}</span>
                    <span className="text-[10px] text-white/40">{node.region}</span>
                  </div>
                  <span className={`size-2 rounded-full ${node.status === 'online' ? 'bg-success shadow-[0_0_5px_#0BDA51]' : 'bg-warning'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="glass p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="font-bold text-white">Map Layers</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                <span className="material-symbols-outlined text-white/60">schedule</span>
                <span className="text-sm font-medium text-white/80 flex-1">Latency Heatmap</span>
                <input type="checkbox" className="accent-primary" />
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                <span className="material-symbols-outlined text-white/60">verified_user</span>
                <span className="text-sm font-medium text-white/80 flex-1">Verified Only</span>
                <input type="checkbox" className="accent-primary" defaultChecked />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

