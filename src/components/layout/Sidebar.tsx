import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, ChevronLeft, ChevronRight, Zap, TrendingUp, Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products',  label: 'Products',  icon: Package          },
  { path: '/orders',    label: 'Orders',    icon: ShoppingCart     },
  { path: '/customers', label: 'Customers', icon: Users            },
  { path: '/analytics', label: 'Analytics', icon: BarChart3        },
];

const SYSTEM_ITEMS = [
  { path: '/notifications', label: 'Notifications', icon: Bell     },
  { path: '/settings',      label: 'Settings',      icon: Settings },
];

interface NavItemProps {
  path:      string;
  label:     string;
  icon:      React.ElementType;
  collapsed: boolean;
  badge?:    number;
}

function NavItem({ path, label, icon: Icon, collapsed, badge }: NavItemProps) {
  const location = useLocation();
  const active = location.pathname === path
    || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <Link
      to={path}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium',
        active
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100',
        collapsed ? 'justify-center px-0' : '',
      )}
    >
      <div className="relative shrink-0">
        <Icon size={18} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>

      {!collapsed && <span className="flex-1 truncate">{label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
        </div>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { state, toggleSidebar } = useApp();
  const collapsed = state.sidebarCollapsed;
  const unread    = state.notifications.filter(n => !n.read).length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col z-30 bg-slate-900 border-r border-slate-800/60',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      {/* ── Logo ────────────────────────────────────────── */}
      <div className={cn(
        'flex h-16 shrink-0 items-center border-b border-slate-800/60 px-4',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/40">
            <Zap size={15} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <p className="text-white font-bold text-sm whitespace-nowrap">AdminPro</p>
              <p className="text-slate-500 text-[10px] whitespace-nowrap">Management Suite</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          >
            <ChevronLeft size={13} />
          </button>
        )}
      </div>

      {/* ── Expand button when collapsed ────────────────── */}
      {collapsed && (
        <button
          onClick={toggleSidebar}
          className="mx-auto mt-3 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <ChevronRight size={13} />
        </button>
      )}

      {/* ── Main nav ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Main Menu
          </p>
        )}
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}

        <div className={collapsed ? 'pt-4' : 'pt-5'}>
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              System
            </p>
          )}
          {SYSTEM_ITEMS.map(item => (
            <NavItem
              key={item.path}
              {...item}
              collapsed={collapsed}
              badge={item.path === '/notifications' ? unread : undefined}
            />
          ))}
        </div>
      </nav>

      {/* ── Upgrade card ────────────────────────────────── */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/30 flex items-center justify-center">
              <TrendingUp size={12} className="text-indigo-300" />
            </div>
            <p className="text-xs font-semibold text-slate-300">Pro Plan Active</p>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
            Unlock advanced analytics and unlimited seats.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
            Manage Plan
          </button>
        </div>
      )}

      {/* ── User profile ────────────────────────────────── */}
      <div className={cn(
        'flex items-center gap-3 p-3 border-t border-slate-800/60',
        collapsed ? 'justify-center' : '',
      )}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0 shadow">
          <span className="text-white text-[11px] font-bold">AK</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Alex Kim</p>
            <p className="text-slate-500 text-[11px] truncate">alex@adminpro.com</p>
          </div>
        )}
      </div>
    </aside>
  );
}
