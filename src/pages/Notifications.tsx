import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { cn } from '../utils/cn';
import type { Notification } from '../models';

const TYPE_CONFIG: Record<Notification['type'], {
  icon: typeof Bell; color: string; bg: string; badge: 'success' | 'warning' | 'danger' | 'info';
}> = {
  success: { icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-50',  badge: 'success' },
  warning: { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-50',    badge: 'warning' },
  error:   { icon: XCircle,       color: 'text-red-500',     bg: 'bg-red-50',      badge: 'danger'  },
  info:    { icon: Info,          color: 'text-blue-500',    bg: 'bg-blue-50',     badge: 'info'    },
};

export default function Notifications() {
  const { state, markNotificationRead, markAllRead } = useApp();
  const { notifications } = state;
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5 fade-in max-w-3xl">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Bell size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">All Notifications</h2>
            <p className="text-xs text-slate-500">{unread} unread</p>
          </div>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" icon={<Check size={14} />} onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      <Card padding="none" className="overflow-hidden divide-y divide-slate-50">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
            <Bell size={40} className="text-slate-200" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
        {notifications.map(n => {
          const cfg  = TYPE_CONFIG[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-slate-50',
                !n.read && 'bg-indigo-50/40',
              )}
            >
              {/* Icon */}
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                <Icon size={18} className={cfg.color} />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={cn('text-sm font-semibold text-slate-800', !n.read && 'text-indigo-900')}>
                    {n.title}
                  </p>
                  <Badge variant={cfg.badge} className="capitalize">{n.type}</Badge>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1.5">
                  {format(new Date(n.createdAt), 'MMMM d, yyyy · h:mm a')}
                </p>
              </div>

              {/* Read indicator */}
              {n.read && (
                <CheckCircle size={14} className="text-slate-300 shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
