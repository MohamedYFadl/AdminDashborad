import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Menu, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':     { title: 'Dashboard',     subtitle: 'Welcome back, Alex 👋' },
  '/products':      { title: 'Products',      subtitle: 'Manage your product catalogue' },
  '/orders':        { title: 'Orders',        subtitle: 'Track and manage customer orders' },
  '/customers':     { title: 'Customers',     subtitle: 'View and manage your customer base' },
  '/analytics':     { title: 'Analytics',     subtitle: 'Insights and performance metrics' },
  '/settings':      { title: 'Settings',      subtitle: 'Configure your preferences' },
  '/notifications': { title: 'Notifications', subtitle: 'Stay up to date' },
};

const NOTIF_STYLE: Record<string, { dot: string; bg: string; text: string }> = {
  success: { dot: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  warning: { dot: 'bg-amber-500',   bg: 'bg-amber-100',   text: 'text-amber-700'   },
  error:   { dot: 'bg-red-500',     bg: 'bg-red-100',     text: 'text-red-700'     },
  info:    { dot: 'bg-blue-500',    bg: 'bg-blue-100',    text: 'text-blue-700'    },
};

export function Navbar() {
  const { state, toggleSidebar, markNotificationRead, markAllRead } = useApp();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const page   = PAGE_TITLES[location.pathname] ?? PAGE_TITLES['/dashboard'];
  const unread = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white/95 backdrop-blur border-b border-slate-100 z-20',
        'flex items-center gap-4 px-5 transition-all duration-300',
        state.sidebarCollapsed ? 'left-[68px]' : 'left-64',
      )}
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 leading-tight truncate">{page.title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block truncate">{page.subtitle}</p>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-52 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input
          placeholder="Quick search…"
          className="flex-1 text-sm bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-mono">⌘K</kbd>
      </div>

      {/* Notifications */}
      <div className="relative shrink-0" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
          className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold leading-none ring-2 ring-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                <p className="text-[11px] text-slate-400">{unread} unread</p>
              </div>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <CheckCheck size={13} /> All read
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
              {state.notifications.slice(0, 5).map(n => {
                const style = NOTIF_STYLE[n.type];
                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn('px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3', !n.read && 'bg-indigo-50/40')}
                  >
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', style.dot)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{format(new Date(n.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
              <button
                onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View all notifications →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative shrink-0" ref={profileRef}>
        <button
          onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
          className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-[11px] font-bold">AK</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Alex Kim</p>
            <p className="text-[11px] text-slate-400 leading-tight">Administrator</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 fade-in overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
              <p className="text-sm font-bold text-slate-800">Alex Kim</p>
              <p className="text-xs text-slate-400">alex@adminpro.com</p>
            </div>
            {[
              { label: 'Profile Settings', action: () => { navigate('/settings'); setProfileOpen(false); } },
              { label: 'Billing & Plans',   action: () => {} },
              { label: 'Help Center',       action: () => {} },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
