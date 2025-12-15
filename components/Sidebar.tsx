'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  activePage?: string;
  variant?: 'dashboard' | 'details' | 'search';
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ variant = 'dashboard', isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { id: 'network-map', label: 'Network Map', icon: 'hub', href: '/network-map' },
    { id: 'search', label: 'Search', icon: 'search', href: '/search' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0B0E14] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Background Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 pointer-events-none" />

        {/* Logo Section */}
        <div className="p-8 pb-10 z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,228,255,0.3)] group-hover:scale-105 transition-transform">
              <svg fill="none" viewBox="0 0 48 48" className="size-6 text-white">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">XANDEUM</h1>
              <p className="text-xs text-primary font-mono tracking-wider">PNODE ANALYTICS</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-2 z-10">
          <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Menu</p>

          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-primary/10 text-white shadow-[0_0_15px_rgba(0,228,255,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_#00E4FF]" />
                )}

                <span className={`material-symbols-outlined transition-colors ${isActive ? 'text-primary' : 'group-hover:text-white'
                  }`}>
                  {item.icon}
                </span>

                <span className="font-medium tracking-wide text-sm">{item.label}</span>

                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 z-10">
          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Pro Status</p>
                <p className="text-xs text-secondary">Active</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full w-3/4 animate-pulse-slow" />
            </div>
            <p className="text-xs text-white/40">75% Storage Used</p>
          </div>
        </div>
      </aside>
    </>
  );
}
