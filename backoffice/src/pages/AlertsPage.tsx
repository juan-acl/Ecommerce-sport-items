import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ImageOff, ArrowRight } from 'lucide-react';
import { useGetLowStockQuery } from '@features/inventory/api/inventoryApi';
import { Spinner } from '@shared/components/ui/Spinner';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';
import type { Product } from '@shared/types/common';

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

type Filter = 'Todos' | 'Agotados' | 'Bajo mínimo';

/* ---------- Presentación ---------- */

/** % de cobertura del stock mínimo (0–100). */
function coverage(p: Product) {
  if (p.stock === 0) return 0;
  if (p.minStock <= 0) return 100;
  return Math.min(Math.round((p.stock / p.minStock) * 100), 100);
}

function StatusBadge({ out }: { out: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset whitespace-nowrap',
        out
          ? 'bg-error-container text-on-error-container ring-error/20'
          : 'bg-amber-50 text-amber-800 ring-amber-600/20',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', out ? 'bg-error' : 'bg-amber-500')} />
      {out ? 'Agotado' : 'Bajo mínimo'}
    </span>
  );
}

function AlertRow({ p }: { p: Product }) {
  const [imgError, setImgError] = useState(false);
  const out = p.stock === 0;
  const pct = coverage(p);
  const missing = Math.max(p.minStock - p.stock, 0);

  return (
    <li className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 hover:bg-surface-container-low transition-colors">
      <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant flex items-center justify-center">
            {p.imageUrl && !imgError ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageOff size={16} className="text-outline" />
            )}
          </div>
          <span
            className={cn(
              'absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white',
              out ? 'bg-error' : 'bg-amber-500',
            )}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-on-surface truncate" title={p.name}>
            {p.name}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {CATEGORY_LABELS[p.category] ?? p.category}
          </p>
        </div>
      </div>

      <div className="col-span-4 sm:col-span-2">
        <StatusBadge out={out} />
      </div>

      <div className="col-span-8 sm:col-span-3">
        <div className="flex items-baseline justify-between text-[11px] mb-1.5">
          <span className="text-on-surface-variant">
            <span className="font-semibold text-on-surface tabular-nums">{p.stock}</span> /{' '}
            {p.minStock} mín.
          </span>
          <span className="tabular-nums text-on-surface-variant">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', out ? 'bg-error' : 'bg-amber-500')}
            style={{ width: `${Math.max(pct, out ? 0 : 4)}%` }}
          />
        </div>
      </div>

      <div className="hidden sm:block sm:col-span-2 text-right">
        <p className="text-[13px] font-semibold tabular-nums text-on-surface">
          {missing > 0 ? `+${missing}` : '—'}
        </p>
        <p className="text-[11px] text-on-surface-variant">por reponer</p>
      </div>
    </li>
  );
}

const LEGEND = [
  { color: 'bg-error', label: 'Agotado', desc: 'Sin unidades disponibles' },
  { color: 'bg-amber-500', label: 'Bajo mínimo', desc: 'Stock igual o menor al mínimo' },
  { color: 'bg-[#54dcbc]', label: 'En rango', desc: 'Stock suficiente (no aparece aquí)' },
];

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 border-b border-outline-variant bg-surface-container-low/60">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
        Semáforo
      </span>
      {LEGEND.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-2 text-[12px]">
          <span className={cn('h-2.5 w-2.5 rounded-full', l.color)} />
          <span className="font-medium text-on-surface">{l.label}</span>
          <span className="text-on-surface-variant hidden md:inline">· {l.desc}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Página ---------- */

export function AlertsPage() {
  const { data: products = [], isLoading } = useGetLowStockQuery(undefined, { refetchOnMountOrArgChange: true });
  const [filter, setFilter] = useState<Filter>('Todos');

  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);

  const filtered: Product[] =
    filter === 'Agotados'
      ? outOfStock
      : filter === 'Bajo mínimo'
        ? lowStock
        : [...outOfStock, ...lowStock];

  const filters: Filter[] = ['Todos', 'Agotados', 'Bajo mínimo'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Solo para mostrar: los más críticos primero (menor cobertura).
  const ordered = [...filtered].sort((a, b) => coverage(a) - coverage(b));
  const total = outOfStock.length + lowStock.length;
  const counts: Record<Filter, number> = {
    Todos: total,
    Agotados: outOfStock.length,
    'Bajo mínimo': lowStock.length,
  };

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
              Alertas
            </h1>
            <p className="text-body-md text-on-surface-variant mt-0.5">
              Productos con stock crítico o agotado
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

      {/* Lista de productos */}
      <section className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
        <div className="px-5 h-16 border-b border-outline-variant flex items-center justify-between gap-4">
          <p className="text-[14px] font-semibold tracking-tight text-on-surface">
            Productos afectados
          </p>
          <div className="flex gap-1 p-1 bg-surface-container-low border border-outline-variant rounded-lg shrink-0">
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
              <span className="col-span-5">Producto</span>
              <span className="col-span-2">Estado</span>
              <span className="col-span-3">Cobertura del mínimo</span>
              <span className="col-span-2 text-right">Faltante</span>
            </div>
            <ul className="divide-y divide-outline-variant">
              {ordered.map((p) => (
                <AlertRow key={p.id} p={p} />
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
