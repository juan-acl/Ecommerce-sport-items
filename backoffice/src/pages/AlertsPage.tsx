import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ImageOff, ArrowRight, PackageSearch } from 'lucide-react';
import { useGetLowStockQuery } from '@features/inventory/api/inventoryApi';
import type { StockAlertItem, StockStatus } from '@features/inventory/api/inventoryApi';
import { Spinner } from '@shared/components/ui/Spinner';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';

const CATEGORY_LABELS: Record<string, string> = {
  running: 'Running',
  football: 'Fútbol',
  basketball: 'Baloncesto',
  tennis: 'Tenis',
  swimming: 'Natación',
  cycling: 'Ciclismo',
  fitness: 'Fitness',
  other: 'Otros',
};

type Filter = 'Todos' | 'Agotados' | 'Bajo mínimo' | 'Nuevos';

function stockCoverage(item: StockAlertItem) {
  if (item.stock === 0) return 0;
  if (item.minStock <= 0) return 100;
  return Math.min(Math.round((item.stock / item.minStock) * 100), 100);
}

function StatusBadge({ status }: { status: StockStatus }) {
  const map: Record<StockStatus, { label: string; className: string; dot: string }> = {
    out: {
      label: 'Agotado',
      className: 'bg-error-container text-on-error-container ring-error/20',
      dot: 'bg-error',
    },
    low: {
      label: 'Bajo mínimo',
      className: 'bg-amber-50 text-amber-800 ring-amber-600/20',
      dot: 'bg-amber-500',
    },
    new: {
      label: 'Nuevo',
      className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      dot: 'bg-blue-500',
    },
  };
  const { label, className, dot } = map[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset whitespace-nowrap',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}

function AlertRow({ item }: { item: StockAlertItem }) {
  const [imgError, setImgError] = useState(false);
  const pct = stockCoverage(item);
  const isNew = item.status === 'new';
  const isOut = item.status === 'out';

  const barColor = isNew
    ? 'bg-blue-400'
    : isOut
      ? 'bg-error'
      : 'bg-amber-500';

  const dotColor = isNew ? 'bg-blue-500' : isOut ? 'bg-error' : 'bg-amber-500';

  return (
    <li className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 hover:bg-surface-container-low transition-colors">
      {/* Producto */}
      <div className="col-span-12 sm:col-span-4 flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant flex items-center justify-center">
            {item.imageUrl && !imgError ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageOff size={16} className="text-outline" />
            )}
          </div>
          <span
            className={cn('absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white', dotColor)}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-on-surface truncate" title={item.name}>
            {item.name}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {CATEGORY_LABELS[item.category] ?? item.category}
          </p>
        </div>
      </div>

      {/* Estado */}
      <div className="col-span-4 sm:col-span-2">
        <StatusBadge status={item.status} />
      </div>

      {/* Cobertura */}
      <div className="col-span-8 sm:col-span-3">
        <div className="flex items-baseline justify-between text-[11px] mb-1.5">
          <span className="text-on-surface-variant">
            <span className="font-semibold text-on-surface tabular-nums">{item.stock}</span>
            {' / '}{item.minStock} mín.
          </span>
          <span className="tabular-nums text-on-surface-variant">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', barColor)}
            style={{ width: `${Math.max(pct, isOut || isNew ? 0 : 4)}%` }}
          />
        </div>
      </div>

      {/* En camino */}
      <div className="hidden sm:block sm:col-span-3 text-right">
        {item.incomingQty > 0 ? (
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-md px-2.5 py-1">
            <PackageSearch size={12} className="text-blue-600 shrink-0" />
            <span className="text-[12px] font-semibold tabular-nums text-blue-700">
              +{item.incomingQty}
            </span>
            <span className="text-[11px] text-blue-600">en camino</span>
          </div>
        ) : isNew ? (
          <p className="text-[11px] text-on-surface-variant italic">Pendiente 1.ª compra</p>
        ) : (
          <div>
            <p className="text-[13px] font-semibold tabular-nums text-on-surface">
              +{Math.max(item.minStock - item.stock, 0)}
            </p>
            <p className="text-[11px] text-on-surface-variant">por reponer</p>
          </div>
        )}
      </div>
    </li>
  );
}

const LEGEND = [
  { color: 'bg-error', label: 'Agotado', desc: 'Sin unidades y sin compras pendientes' },
  { color: 'bg-amber-500', label: 'Bajo mínimo', desc: 'Stock menor al mínimo definido' },
  { color: 'bg-blue-500', label: 'Nuevo', desc: 'Producto sin primera compra aún' },
  { color: 'bg-[#54dcbc]', label: 'En rango / cubierto', desc: 'Stock + en camino ≥ mínimo (no aparece aquí)' },
];

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 border-b border-outline-variant bg-surface-container-low/60">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
        Semáforo
      </span>
      {LEGEND.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-2 text-[12px]">
          <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', l.color)} />
          <span className="font-medium text-on-surface">{l.label}</span>
          <span className="text-on-surface-variant hidden md:inline">· {l.desc}</span>
        </span>
      ))}
    </div>
  );
}

export function AlertsPage() {
  const { data: items = [], isLoading } = useGetLowStockQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [filter, setFilter] = useState<Filter>('Todos');

  const outOfStock  = items.filter((i) => i.status === 'out');
  const lowStock    = items.filter((i) => i.status === 'low');
  const newProducts = items.filter((i) => i.status === 'new');

  const filtered: StockAlertItem[] =
    filter === 'Agotados'    ? outOfStock :
    filter === 'Bajo mínimo' ? lowStock :
    filter === 'Nuevos'      ? newProducts :
    [...outOfStock, ...lowStock, ...newProducts];

  const filters: Filter[] = ['Todos', 'Agotados', 'Bajo mínimo', 'Nuevos'];

  const counts: Record<Filter, number> = {
    Todos:        items.length,
    Agotados:     outOfStock.length,
    'Bajo mínimo': lowStock.length,
    Nuevos:       newProducts.length,
  };

  // Sort: out first (most critical), then low, then new; within group by coverage
  const sortOrder: Record<StockStatus, number> = { out: 0, low: 1, new: 2 };
  const ordered = [...filtered].sort((a, b) => {
    const byStatus = sortOrder[a.status] - sortOrder[b.status];
    if (byStatus !== 0) return byStatus;
    return stockCoverage(a) - stockCoverage(b);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
            <Bell size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
              Alertas de inventario
            </h1>
            <p className="text-body-md text-on-surface-variant mt-0.5">
              Stock crítico · incluye unidades en camino de compras pendientes
            </p>
          </div>
        </div>
        <Link
          to={ROUTES.PURCHASES}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#006b58] text-white text-[13px] font-medium hover:bg-[#005142] transition-colors self-start sm:self-auto"
        >
          Ir a compras
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Resumen rápido */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Agotados', count: outOfStock.length, color: 'text-error' },
            { label: 'Bajo mínimo', count: lowStock.length, color: 'text-amber-600' },
            { label: 'Nuevos', count: newProducts.length, color: 'text-blue-600' },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="bg-white border border-outline-variant rounded-xl px-4 py-3 text-center shadow-soft"
            >
              <p className={cn('text-[22px] font-bold tabular-nums', color)}>{count}</p>
              <p className="text-[12px] text-on-surface-variant mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabla */}
      <section className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
        <div className="px-5 h-16 border-b border-outline-variant flex items-center justify-between gap-4">
          <p className="text-[14px] font-semibold tracking-tight text-on-surface">
            Productos afectados
          </p>
          <div className="flex gap-1 p-1 bg-surface-container-low border border-outline-variant rounded-lg shrink-0 flex-wrap">
            {filters.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors',
                  filter === tab
                    ? 'bg-white text-[#006b58] shadow-card ring-1 ring-outline-variant'
                    : 'text-on-surface-variant hover:text-on-surface',
                )}
              >
                {tab}
                <span
                  className={cn(
                    'tabular-nums text-[10px] px-1.5 rounded',
                    filter === tab
                      ? 'bg-[#ddfbf2] text-[#006b58]'
                      : 'bg-surface-container text-on-surface-variant',
                  )}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Legend />

        {ordered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ddfbf2] text-[#006b58] flex items-center justify-center">
              <CheckCircle2 size={22} strokeWidth={1.75} />
            </div>
            <p className="text-[14px] font-semibold text-on-surface">Todo en orden</p>
            <p className="text-body-md text-on-surface-variant">
              {filter === 'Todos'
                ? 'No hay alertas de inventario.'
                : `No hay productos en estado "${filter}".`}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-12 gap-3 px-5 h-9 items-center bg-surface-container-low border-b border-outline-variant text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              <span className="col-span-4">Producto</span>
              <span className="col-span-2">Estado</span>
              <span className="col-span-3">Cobertura del mínimo</span>
              <span className="col-span-3 text-right">En camino / Por reponer</span>
            </div>
            <ul className="divide-y divide-outline-variant">
              {ordered.map((item) => (
                <AlertRow key={item.id} item={item} />
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
