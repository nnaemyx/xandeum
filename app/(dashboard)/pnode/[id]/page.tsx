'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { PNode, MOCK_PNODES, generateMockLogs, generateMockRewards } from '@/lib/pnode-api';

export default function PNodeDetailsPage() {
    const params = useParams();
    const nodeId = params.id as string;
    const [activeTab, setActiveTab] = useState('overview');
    const [pNode, setPNode] = useState<PNode | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [logs] = useState(generateMockLogs(15));
    const [rewards] = useState(generateMockRewards(8));

    // Initial Load
    useEffect(() => {
        const foundNode = MOCK_PNODES.find(n => n.id === nodeId) || MOCK_PNODES[0];
        setPNode(foundNode);
        setLoading(false);
    }, [nodeId]);

    // Real-time Simulation
    useEffect(() => {
        if (!pNode) return;

        const interval = setInterval(() => {
            setPNode(prev => {
                if (!prev) return undefined;

                // Fluctuate stats
                const newUptime = Math.min(100, Math.max(0, (prev.uptime || 99) + (Math.random() - 0.5) * 0.01));
                const newUsedStorage = Math.min(prev.storageCapacity || 1000, (prev.storageUsed || 0) + (Math.random() - 0.5) * 5);

                return {
                    ...prev,
                    uptime: parseFloat(newUptime.toFixed(3)),
                    storageUsed: parseFloat(newUsedStorage.toFixed(1)),
                };
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [pNode]);

    if (loading || !pNode) {
        return <div className="p-8 text-white">Loading pNode details...</div>;
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'storage', label: 'Storage Details' },
        { id: 'logs', label: 'Network Logs' },
        { id: 'rewards', label: 'Rewards History' },
    ];



    // Chart Data for Storage
    const storageChartData = [
        { name: 'Used', value: pNode.storageUsed || 0, color: '#00E4FF' },
        { name: 'Free', value: (pNode.storageCapacity || 1000) - (pNode.storageUsed || 0), color: 'rgba(255,255,255,0.1)' },
    ];

    return (
        <>
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        pNode <span className="text-primary">#{pNode.id}</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${pNode.status === 'online' ? 'bg-[#0bda62] shadow-[#0bda62]' : 'bg-red-500 shadow-red-500'}`}></div>
                        <p className="text-white/60 text-base font-normal leading-normal capitalize">{pNode.status || 'Unknown'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-white/10">
                <div className="flex gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center border-b-2 pb-4 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-white/40 hover:text-white'
                                }`}
                        >
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards (Always Visible) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-white/40 text-sm font-medium leading-normal">Uptime</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight mt-1">{pNode.uptime}%</p>
                    <p className="text-[#0bda62] text-sm font-medium leading-normal mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm animate-pulse">activity_zone</span> Live
                    </p>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-white/40 text-sm font-medium leading-normal">CPU Load</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight mt-1">{15 + Math.floor((pNode.uptime || 0) % 10)}%</p>
                    <p className="text-white/40 text-sm font-medium leading-normal mt-1">Stable</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-white/40 text-sm font-medium leading-normal">Used Storage</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight mt-1">{pNode.storageUsed} GB</p>
                    <p className="text-primary text-sm font-medium leading-normal mt-1">{((pNode.storageUsed || 0) / (pNode.storageCapacity || 1000) * 100).toFixed(1)}% Full</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-white/40 text-sm font-medium leading-normal">Latency</p>
                    <p className="text-white tracking-light text-2xl font-bold leading-tight mt-1">{pNode.latency} ms</p>
                    <p className="text-[#0bda62] text-sm font-medium leading-normal mt-1">Optimal</p>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Configuration */}
                        <div className="glass rounded-2xl border border-white/5 p-6 h-fit">
                            <h3 className="text-white text-lg font-bold mb-4">Configuration</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/40">Node Version</span>
                                    <span className="text-white font-mono">{pNode.version || 'v2.1.8-beta'}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/40">IP Address</span>
                                    <span className="text-white font-mono">{pNode.ip || '192.168.1.101'}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/40">Location</span>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base text-white/60">public</span>
                                        <span className="text-white">{pNode.region || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/40">Wallet</span>
                                    <span className="text-white font-mono text-xs">{pNode.pubkey.substring(0, 16)}...</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Preview */}
                        <div className="glass rounded-2xl border border-white/5 p-6 h-fit">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white text-lg font-bold">Recent Logs</h3>
                                <button onClick={() => setActiveTab('logs')} className="text-primary text-sm hover:underline">View All</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {logs.slice(0, 4).map(log => (
                                    <div key={log.id} className="flex gap-3 text-sm border-b border-white/5 pb-2 last:border-0">
                                        <span className={`material-symbols-outlined text-base ${log.level === 'error' ? 'text-error' : log.level === 'warning' ? 'text-warning' : 'text-success'}`}>
                                            {log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'check_circle'}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-white/80">{log.message}</p>
                                            <p className="text-white/30 text-xs">{log.timestamp.toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'storage' && (
                <div className="animate-fade-in-up">
                    <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-white text-xl font-bold">Storage Distribution</h3>
                            <div className="text-right">
                                <p className="text-white/40 text-sm">Total Capacity</p>
                                <p className="text-2xl font-bold text-white">{pNode.storageCapacity} GB</p>
                            </div>
                        </div>

                        {/* Custom Bar Visual for Storage */}
                        <div className="relative h-12 w-full bg-white/5 rounded-xl overflow-hidden mb-4">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(100, ((pNode.storageUsed || 0) / (pNode.storageCapacity || 1) * 100))}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-white font-bold drop-shadow-md">
                                    {((pNode.storageUsed || 0) / (pNode.storageCapacity || 1) * 100).toFixed(1)}% Used
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-white/40 text-xs mb-1">Available</p>
                                <p className="text-xl font-bold text-white">{((pNode.storageCapacity || 0) - (pNode.storageUsed || 0)).toFixed(1)} GB</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-white/40 text-xs mb-1">Efficiency score</p>
                                <p className="text-xl font-bold text-success">98.5%</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-white/40 text-xs mb-1">Redundancy Factor</p>
                                <p className="text-xl font-bold text-primary">3x</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="animate-fade-in-up glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-white text-lg font-bold">System Logs</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white/60">Last 24h</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white/60">All Levels</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/40 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Level</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${log.level === 'error' ? 'bg-error/10 text-error border-error/20' :
                                                log.level === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                                                    'bg-success/10 text-success border-success/20'
                                                }`}>
                                                {log.level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/80 font-mono text-sm">{log.message}</td>
                                        <td className="p-4 text-right text-white/40 text-xs font-mono">{log.timestamp.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'rewards' && (
                <div className="animate-fade-in-up glass rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-white text-lg font-bold">Staking Rewards</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/40 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Epoch</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Amount (XAN)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rewards.map(reward => (
                                    <tr key={reward.epoch} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-primary font-mono">#{reward.epoch}</td>
                                        <td className="p-4 text-white/60 text-sm">{reward.date.toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${reward.status === 'claimed' ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}`}>
                                                {reward.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-white">+{reward.amount.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
