import { cn } from '../../utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size    = 'xs' | 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary:   'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-200 hover:shadow-md',
  secondary: 'bg-slate-100  hover:bg-slate-200  text-slate-700',
  danger:    'bg-red-600    hover:bg-red-700    text-white shadow-sm',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600',
  outline:   'border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white',
};

const sizeMap: Record<Size, string> = {
  xs: 'px-2.5 py-1   text-xs  rounded-md gap-1',
  sm: 'px-3   py-1.5 text-sm  rounded-lg gap-1.5',
  md: 'px-4   py-2   text-sm  rounded-lg gap-2',
  lg: 'px-6   py-2.5 text-base rounded-xl gap-2',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, iconRight,
  children, fullWidth, className, disabled, ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </button>
  );
}
