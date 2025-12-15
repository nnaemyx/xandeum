'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !connected) {
            // Optional: Redirect to home or show modal
            // router.push('/'); 
            // setVisible(true);
        }
    }, [isClient, connected, router, setVisible]);

    if (!isClient) return null;

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-3xl text-white/40">lock</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Connection Required</h2>
                <p className="text-white/60 mb-8 max-w-md">
                    Please connect your Solana wallet to view your dashboard and manage your pNodes.
                </p>
                <button
                    onClick={() => setVisible(true)}
                    className="px-6 py-3 bg-primary text-[#0B0E14] font-bold rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,228,255,0.4)] transition-all"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
