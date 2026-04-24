import { cn } from '../../utils/cn';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label, error, hint, icon, iconRight,
  fullWidth, className, id, ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g,'-');
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          {...rest}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
            error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 hover:border-slate-400',
            icon  && 'pl-9',
            iconRight && 'pr-9',
            className,
          )}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export function Select({ label, error, options, fullWidth, className, id, ...rest }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g,'-');
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        {...rest}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
          error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
          className,
        )}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}
export function Textarea({ label, error, fullWidth, className, id, ...rest }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g,'-');
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        id={inputId}
        {...rest}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
          error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
          className,
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
