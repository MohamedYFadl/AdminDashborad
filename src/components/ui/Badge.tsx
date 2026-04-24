import { cn } from '../../utils/cn';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

const variantMap: Record<Variant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100  text-amber-700  border border-amber-200',
  danger:  'bg-red-100    text-red-700    border border-red-200',
  info:    'bg-blue-100   text-blue-700   border border-blue-200',
  neutral: 'bg-slate-100  text-slate-600  border border-slate-200',
  purple:  'bg-violet-100 text-violet-700 border border-violet-200',
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantMap[variant],
      className
    )}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-emerald-500': variant === 'success',
          'bg-amber-500':   variant === 'warning',
          'bg-red-500':     variant === 'danger',
          'bg-blue-500':    variant === 'info',
          'bg-slate-400':   variant === 'neutral',
          'bg-violet-500':  variant === 'purple',
        })} />
      )}
      {children}
    </span>
  );
}
