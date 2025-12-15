'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Mock Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'pNode Offline', message: 'pNode-Alpha-001 went offline.', time: '2m ago', type: 'error', read: false },
    { id: 2, title: 'Reward Received', message: 'You received 12.5 XAND.', time: '1h ago', type: 'success', read: false },
    { id: 3, title: 'System Update', message: 'Dashboard updated to v1.2.0.', time: '1d ago', type: 'info', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleConnect = () => {
    if (publicKey) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowUserMenu(false);
    router.push('/');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 py-4 px-8 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Mobile Logo (Visible only on small screens) */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/" className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <svg fill="none" viewBox="0 0 48 48" className="size-5 text-white">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
          </svg>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-white/5 rounded-xl leading-5 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 sm:text-sm transition-all duration-300"
            placeholder="Search pNodes by ID or Pubkey..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-white/20 border border-white/10 px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-colors ${showNotifications ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 bg-accent rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#111522] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up origin-top-right">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-white/40 text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${!notif.read ? 'bg-white/5' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`mt-1 size-2 rounded-full flex-shrink-0 ${notif.type === 'error' ? 'bg-error' :
                          notif.type === 'success' ? 'bg-success' : 'bg-primary'
                          }`} />
                        <div>
                          <p className={`text-sm font-medium group-hover:text-primary transition-colors ${notif.read ? 'text-white/70' : 'text-white'}`}>{notif.title}</p>
                          <p className="text-xs text-white/60 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-white/30 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 text-center bg-white/5">
                <button className="text-xs text-white/40 hover:text-white transition-colors">View All History</button>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connect */}
        <button
          onClick={handleConnect}
          className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${publicKey
            ? 'bg-surface-light border border-white/10 text-white hover:bg-white/5'
            : 'bg-primary text-[#0B0E14] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,228,255,0.4)]'
            }`}
        >
          {publicKey ? (
            <>
              <div className="size-2 rounded-full bg-green-400 animate-pulse" />
              {formatAddress(publicKey.toString())}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">wallet</span>
              Connect Wallet
            </>
          )}
        </button>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center justify-center size-10 rounded-full border transition-all ${showUserMenu
              ? 'bg-white/10 border-primary shadow-[0_0_15px_rgba(0,228,255,0.2)]'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-white/20'
              }`}
          >
            <span className="material-symbols-outlined text-white/80">person</span>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111522] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up origin-top-right">
              <div className="p-4 border-b border-white/5">
                <p className="text-sm font-bold text-white">Cyber Jay</p>
                <p className="text-xs text-white/40 font-mono">Verified Operator</p>
              </div>
              <div className="p-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Settings
                </Link>
                <button
                  onClick={handleConnect}
                  className="w-full flex sm:hidden items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">wallet</span>
                  {publicKey ? 'Disconnect Wallet' : 'Connect Wallet'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-sm text-error/80 hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
