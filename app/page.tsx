'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0E14] text-white flex flex-col">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,228,255,0.3)]">
            <svg fill="none" viewBox="0 0 48 48" className="size-6 text-white">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide">XANDEUM</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-full bg-white text-[#0B0E14] font-bold hover:bg-white/90 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
          <span className="size-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-sm font-medium text-white/80">Xandeum Mainnet Beta Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            SCALABLE
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">
            STORAGE LAYER
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
          The first scalable storage layer for Solana dApps. Monitor pNodes, track storage efficiency, and participate in the next generation of decentralized storage.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 rounded-xl bg-primary text-[#0B0E14] font-bold text-lg min-w-[180px] overflow-hidden transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Enter Dashboard
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <a
            href="https://xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg min-w-[180px] hover:bg-white/10 transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full text-left">
          <div className="glass p-6 rounded-2xl hover:border-primary/50 transition-colors group">
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-2xl">dns</span>
            </div>
            <h3 className="text-xl font-bold mb-2">pNode Analytics</h3>
            <p className="text-white/50">Real-time monitoring of storage provider nodes with detailed performance metrics.</p>
          </div>
          <div className="glass p-6 rounded-2xl hover:border-secondary/50 transition-colors group">
            <div className="size-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary text-2xl">hub</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Network Topology</h3>
            <p className="text-white/50">Visualize the decentralized network structure and geographical distribution.</p>
          </div>
          <div className="glass p-6 rounded-2xl hover:border-accent/50 transition-colors group">
            <div className="size-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-accent text-2xl">token</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Rewards Tracking</h3>
            <p className="text-white/50">Track staking rewards, epoch progress, and projected earnings instantly.</p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 border-t border-white/5 text-center text-white/40 text-sm">
        <p>© 2025 Xandeum Labs. All rights reserved.</p>
      </footer>

      <style jsx global>{`
         @keyframes gradient-x {
           0% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
           100% { background-position: 0% 50%; }
         }
         .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
         }
         @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
         }
         .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
         }
       `}</style>
    </div>
  );
}
