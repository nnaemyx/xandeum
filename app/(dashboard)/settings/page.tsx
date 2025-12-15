'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [primaryRpc, setPrimaryRpc] = useState('');
    const [backupRpc, setBackupRpc] = useState('');
    const [showAnimations, setShowAnimations] = useState(true);
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [devMode, setDevMode] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('xandeum-settings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setPrimaryRpc(parsed.primaryRpc || 'https://api.mainnet.xandeum.network');
            setBackupRpc(parsed.backupRpc || '');
            setShowAnimations(parsed.showAnimations ?? true);
            setEnableNotifications(parsed.enableNotifications ?? false);
            setDevMode(parsed.devMode ?? false);
        } else {
            // Default values
            setPrimaryRpc('https://api.mainnet.xandeum.network');
        }
    }, []);

    const handleSave = () => {
        const settings = {
            primaryRpc,
            backupRpc,
            showAnimations,
            enableNotifications,
            devMode
        };
        localStorage.setItem('xandeum-settings', JSON.stringify(settings));

        // Show toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Settings <span className="text-primary">& Config</span>
                </h1>
                <p className="text-white/40 text-lg">
                    Configure your dashboard preferences and network connections.
                </p>
            </div>

            {/* RPC Configuration */}
            <section className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">dns</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">RPC Configuration</h2>
                        <p className="text-white/40 text-sm">Manage your connection endpoints</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Primary RPC Endpoint</label>
                        <input
                            type="text"
                            value={primaryRpc}
                            onChange={(e) => setPrimaryRpc(e.target.value)}
                            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                            placeholder="https://api.mainnet.xandeum.network"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Backup RPC Endpoint</label>
                        <input
                            type="text"
                            value={backupRpc}
                            onChange={(e) => setBackupRpc(e.target.value)}
                            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                            placeholder="Optional backup endpoint"
                        />
                    </div>
                </div>
            </section>

            {/* Display & Notifications */}
            <section className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-xl">tune</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Display & Notifications</h2>
                        <p className="text-white/40 text-sm">Customize your viewing experience</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-white/60">animation</span>
                            <div>
                                <p className="font-medium text-white">Enable Real-time Animations</p>
                                <p className="text-xs text-white/40">Show live data updates and transitions</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={showAnimations} onChange={(e) => setShowAnimations(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-white/60">notifications_active</span>
                            <div>
                                <p className="font-medium text-white">Browser Notifications</p>
                                <p className="text-xs text-white/40">Get alerts when pNodes go offline</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={enableNotifications} onChange={(e) => setEnableNotifications(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-white/60">code</span>
                            <div>
                                <p className="font-medium text-white">Developer Mode</p>
                                <p className="text-xs text-white/40">Show extended network metrics</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="px-8 py-3 rounded-xl bg-primary text-[#0B0E14] font-bold text-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,228,255,0.3)] flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-[#0B0E14] border border-success/20 text-success px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-fade-in-up z-50">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Success</span>
                        <span className="text-xs opacity-80">Settings saved successfully</span>
                    </div>
                </div>
            )}
        </div>
    );
}
