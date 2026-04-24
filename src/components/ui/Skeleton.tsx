import { cn } from '../../utils/cn';

interface SkeletonProps { className?: string; }
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn('h-10 flex-1', c === 0 && 'max-w-10')} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="flex items-end gap-3 h-48">
        {[40,65,45,80,55,90,70,85,60,75,95,88].map((h,i) => (
          <div key={i} className="flex-1 skeleton rounded-t-md" style={{ height:`${h}%` }} />
        ))}
      </div>
    </div>
  );
}
