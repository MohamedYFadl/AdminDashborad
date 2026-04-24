import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Toast as ToastType } from '../../models';
import { cn } from '../../utils/cn';

const toastConfig = {
  success: { icon: CheckCircle,    bg: 'bg-emerald-50 border-emerald-200', icon_color: 'text-emerald-500', title_color: 'text-emerald-800' },
  error:   { icon: XCircle,        bg: 'bg-red-50    border-red-200',     icon_color: 'text-red-500',     title_color: 'text-red-800'     },
  warning: { icon: AlertTriangle,  bg: 'bg-amber-50  border-amber-200',   icon_color: 'text-amber-500',   title_color: 'text-amber-800'   },
  info:    { icon: Info,           bg: 'bg-blue-50   border-blue-200',    icon_color: 'text-blue-500',    title_color: 'text-blue-800'    },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useApp();
  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;
  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-72 max-w-sm toast-enter',
      cfg.bg,
    )}>
      <Icon size={18} className={cn('shrink-0 mt-0.5', cfg.icon_color)} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', cfg.title_color)}>{toast.title}</p>
        {toast.message && <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)} className="shrink-0 text-slate-400 hover:text-slate-600">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { state } = useApp();
  if (!state.toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {state.toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
