'use client';
import React from 'react';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
                {/* Header */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 sm:p-8 lg:p-10 relative">
                    {/* Ambient Background Glows used globally in dashboard */}
                    <div className="fixed top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="fixed bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="mx-auto max-w-7xl flex flex-col gap-8 relative z-10 pb-20">
                        <ProtectedRoute>
                            {children}
                        </ProtectedRoute>
                    </div>
                </main>
            </div>
        </div>
    );
}
