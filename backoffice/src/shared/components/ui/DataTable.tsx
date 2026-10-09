import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type ComponentType,
} from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { Spinner } from './Spinner';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
}

export interface ServerPagination {
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  title?: string;
  totalLabel?: string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSizes?: number[];
  defaultPageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ComponentType<{ size?: number; className?: string }>;
  onRefresh?: () => void;
  serverPagination?: ServerPagination;
}

type SortDir = 'asc' | 'desc';

const DEFAULT_PAGE_SIZES = [10, 25, 50];

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  title,
  totalLabel = 'resultados',
  actions,
  searchPlaceholder = 'Buscar...',
  searchFilter,
  pageSizes = DEFAULT_PAGE_SIZES,
  defaultPageSize = 10,
  emptyTitle = 'Sin resultados',
  emptyDescription = 'No hay elementos para mostrar.',
  emptyIcon: EmptyIcon,
  onRefresh,
  serverPagination,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Used to auto-advance page when server loads new items
  const prevSortedLengthRef = useRef(0);
  const pendingAdvance = useRef(false);

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
    setPage(1);
  }, []);

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!searchFilter || !search.trim()) return data;
    return data.filter((item) => searchFilter(item, search.toLowerCase()));
  }, [data, search, searchFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sorted.length);
  const pageData = sorted.slice(startIndex, endIndex);

  const isFiltering = !!searchFilter && search.trim().length > 0;
  const onLastPage = safePage >= totalPages;

  useEffect(() => {
    if (pendingAdvance.current && sorted.length > prevSortedLengthRef.current) {
      setPage((p) => p + 1);
      pendingAdvance.current = false;
    }
    prevSortedLengthRef.current = sorted.length;
  }, [sorted.length]);

  const handleNextPage = useCallback(() => {
    if (!onLastPage) {
      setPage((p) => Math.min(totalPages, p + 1));
    } else if (serverPagination?.hasMore) {
      pendingAdvance.current = true;
      serverPagination.onLoadMore();
    }
  }, [onLastPage, totalPages, serverPagination]);

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-outline-variant">
        <div className="flex items-center gap-2 min-w-0">
          {title && (
            <span className="text-[14px] font-semibold tracking-tight text-on-surface">{title}</span>
          )}
          {!isLoading && (
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-px rounded text-[11px] font-medium tabular-nums transition-colors',
                isFiltering
                  ? 'bg-[#ddfbf2] text-[#006b58]'
                  : 'bg-surface-container text-on-surface-variant',
              )}
            >
              {isFiltering ? `${sorted.length} / ${data.length}` : sorted.length}
            </span>
          )}
          {isFiltering && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant text-xs text-on-surface-variant">
              <span className="truncate max-w-[100px]">"{search}"</span>
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="text-on-surface-variant hover:text-on-surface ml-0.5 flex-shrink-0"
                aria-label="Limpiar búsqueda"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {searchFilter && (
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8 pr-3 h-8 text-body-md border border-outline-variant rounded-md bg-surface-container-low text-on-surface placeholder:text-outline focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary w-56 transition-all"
              />
            </div>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors disabled:opacity-40"
              title="Actualizar"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-body-md border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  className={cn(
                    'px-5 h-10 text-left text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap select-none transition-colors',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    sortKey === col.key
                      ? 'text-primary'
                      : 'text-on-surface-variant',
                    col.sortable &&
                      'cursor-pointer hover:text-on-surface',
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex opacity-70">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : (
                          <ChevronsUpDown size={12} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex items-center justify-center py-16">
                    <Spinner size="lg" />
                  </div>
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center gap-2 py-14 text-center">
                    {isFiltering ? (
                      <>
                        <p className="text-body-lg font-semibold text-on-surface">
                          Sin coincidencias
                        </p>
                        <p className="text-body-md text-on-surface-variant">
                          No se encontraron resultados para{' '}
                          <span className="font-medium">"{search}"</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearchChange('')}
                          className="mt-1 text-body-md text-primary hover:underline"
                        >
                          Limpiar búsqueda
                        </button>
                      </>
                    ) : (
                      <>
                        {EmptyIcon && (
                          <EmptyIcon
                            size={40}
                            className="text-on-surface-variant opacity-25 mb-1"
                          />
                        )}
                        <p className="text-body-lg font-semibold text-on-surface">
                          {emptyTitle}
                        </p>
                        <p className="text-body-md text-on-surface-variant max-w-xs">
                          {emptyDescription}
                        </p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-5 py-3.5 text-on-surface',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                      )}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && sorted.length > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 h-14 border-t border-outline-variant bg-surface-container-low/60">
          <p className="text-body-md text-on-surface-variant whitespace-nowrap">
            Mostrando{' '}
            <span className="font-medium text-on-surface">
              {startIndex + 1}–{endIndex}
            </span>{' '}
            de{' '}
            <span className="font-medium text-on-surface">
              {sorted.length}{serverPagination?.hasMore ? '+' : ''}
            </span>{' '}
            {totalLabel}
            {isFiltering && (
              <span className="text-xs ml-1 text-on-surface-variant/70">
                (filtrado de {data.length})
              </span>
            )}
          </p>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-body-md text-on-surface-variant whitespace-nowrap">
              <span>Por página</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-7 pl-2 pr-5 text-body-md border border-outline-variant rounded-md bg-white text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary cursor-pointer"
              >
                {pageSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-1">
              <PageBtn
                onClick={() => setPage(1)}
                disabled={safePage <= 1}
                aria-label="Primera página"
              >
                <ChevronsLeft size={14} />
              </PageBtn>
              <PageBtn
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={14} />
              </PageBtn>
              <span className="text-body-md text-on-surface-variant px-2.5 whitespace-nowrap tabular-nums">
                {safePage} / {totalPages}
              </span>
              <PageBtn
                onClick={handleNextPage}
                disabled={onLastPage && !serverPagination?.hasMore}
                loading={onLastPage && !!serverPagination?.isLoading}
                aria-label="Página siguiente"
              >
                <ChevronRight size={14} />
              </PageBtn>
              <PageBtn
                onClick={() => (serverPagination?.hasMore ? handleNextPage() : setPage(totalPages))}
                disabled={onLastPage && !serverPagination?.hasMore}
                aria-label="Última página"
              >
                <ChevronsRight size={14} />
              </PageBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  loading,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-md border border-outline-variant text-on-surface-variant transition-all',
        disabled || loading
          ? 'opacity-35 cursor-not-allowed'
          : 'bg-white hover:bg-surface-container-low hover:text-on-surface cursor-pointer',
      )}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : children}
    </button>
  );
}
