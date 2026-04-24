import { useState, useMemo, type ReactNode } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Search,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { TableSkeleton } from './Skeleton';
import { Input } from './Input';
import type { SortConfig } from '../../models';

export interface Column<T> {
  key:       keyof T | string;
  header:    string;
  sortable?: boolean;
  width?:    string;
  render?:   (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data:        T[];
  columns:     Column<T>[];
  loading?:    boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?:   number;
  actions?:    ReactNode;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  filterSlot?: ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data, columns, loading, searchable=true,
  searchPlaceholder='Search…', pageSize:initialPageSize=10,
  actions, emptyMessage='No records found.', onRowClick, filterSlot,
}: DataTableProps<T>) {
  const [sort,    setSort]    = useState<SortConfig | null>(null);
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(initialPageSize);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v =>
        String(v ?? '').toLowerCase().includes(q)
      )
    );
  }, [data, search]);

  // Sort
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key as keyof T];
      const bv = b[sort.key as keyof T];
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric:true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated  = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page, perPage]);

  const handleSort = (key: string) => {
    setSort(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction:'desc' } : null;
      }
      return { key, direction:'asc' };
    });
    setPage(1);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sort?.key !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />;
    return sort.direction === 'asc'
      ? <ChevronUp size={13} className="text-indigo-500" />
      : <ChevronDown size={13} className="text-indigo-500" />;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {(searchable || actions || filterSlot) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="flex-1 min-w-48 max-w-xs">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                icon={<Search size={14} />}
              />
            </div>
          )}
          {filterSlot}
          <div className="ml-auto flex gap-2">{actions}</div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={columns.length} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    style={col.width ? { width: col.width } : {}}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap',
                      col.sortable && 'cursor-pointer select-none hover:text-slate-700',
                    )}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && <SortIcon colKey={String(col.key)} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={28} className="text-slate-300" />
                      <span>{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'table-row-hover transition-colors',
                    onRowClick && 'cursor-pointer',
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => {
                    const val = row[col.key as keyof T];
                    return (
                      <td key={String(col.key)} className="px-4 py-3 text-slate-700">
                        {col.render ? col.render(val, row) : String(val ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="border border-slate-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-2">
            {sorted.length === 0 ? '0' : `${(page-1)*perPage+1}–${Math.min(page*perPage, sorted.length)}`} of {sorted.length}
          </span>
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pg = i + 1;
            if (totalPages > 5 && page > 3) pg = page - 2 + i;
            if (pg > totalPages) return null;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  pg === page ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100',
                )}
              >{pg}</button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p+1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
