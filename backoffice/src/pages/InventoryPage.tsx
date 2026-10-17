import { useState } from 'react';
import { Boxes, PackageSearch } from 'lucide-react';
import { useGetMovementsQuery } from '@features/inventory/api/inventoryApi';
import { useGetProductsQuery } from '@features/products/api/productsApi';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import type { InventoryMovement, Product } from '@shared/types/common';
import { cn } from '@shared/utils/cn';

const LIMIT = 50;

const MOVEMENT_LABELS: Record<string, string> = {
  purchase: 'Compra',
  sale: 'Venta',
  adjustment: 'Ajuste',
  return: 'Devolución',
};

const MOVEMENT_CLASSES: Record<string, string> = {
  purchase: 'bg-[#ddfbf2] text-[#006b58] border border-[#006b58]/20',
  sale: 'bg-blue-50 text-blue-700 border border-blue-200',
  adjustment: 'bg-[#f3f5f8] text-[#45484a] border border-[#e0e3e5]',
  return: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const MOVEMENT_DOTS: Record<string, string> = {
  purchase: 'bg-[#006b58]',
  sale: 'bg-blue-500',
  adjustment: 'bg-[#45484a]',
  return: 'bg-purple-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  running: 'Running', football: 'Fútbol', basketball: 'Baloncesto',
  tennis: 'Tenis', swimming: 'Natación', cycling: 'Ciclismo',
  fitness: 'Fitness', other: 'Otros',
};

function StockBadge({ product }: { product: Product }) {
  const isOut = product.stock === 0;
  const isLow = !isOut && product.minStock > 0 && product.stock <= product.minStock;

  if (isOut) return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-error-container text-on-error-container ring-1 ring-inset ring-error/20">
      <span className="h-1.5 w-1.5 rounded-full bg-error" />Agotado
    </span>
  );
  if (isLow) return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Bajo mínimo
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ddfbf2] text-[#006b58] ring-1 ring-inset ring-[#006b58]/20">
      <span className="h-1.5 w-1.5 rounded-full bg-[#006b58]" />OK
    </span>
  );
}

function StockBar({ product }: { product: Product }) {
  const isOut = product.stock === 0;
  const pct = isOut ? 0 : product.minStock > 0
    ? Math.min(Math.round((product.stock / product.minStock) * 100), 100)
    : 100;
  const isLow = !isOut && product.minStock > 0 && product.stock <= product.minStock;
  const color = isOut ? 'bg-error' : isLow ? 'bg-amber-500' : 'bg-[#006b58]';

  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums text-[13px] font-semibold text-on-surface w-8 text-right">{product.stock}</span>
      <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden min-w-[60px]">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${Math.max(pct, isOut ? 0 : 4)}%` }} />
      </div>
      <span className="text-[11px] text-on-surface-variant tabular-nums">/{product.minStock || '—'}</span>
    </div>
  );
}

const stockColumns: Column<Product>[] = [
  {
    key: 'name',
    header: 'Producto',
    sortable: true,
    sortValue: (p) => p.name,
    render: (p) => (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md overflow-hidden bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <PackageSearch size={14} className="text-outline" />
          )}
        </div>
        <span className="text-[13px] font-medium text-on-surface truncate">{p.name}</span>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Categoría',
    render: (p) => <span className="text-on-surface-variant text-[12px]">{CATEGORY_LABELS[p.category] ?? p.category}</span>,
  },
  {
    key: 'stock',
    header: 'Stock / Mínimo',
    render: (p) => <StockBar product={p} />,
  },
  {
    key: 'status',
    header: 'Estado',
    align: 'center',
    render: (p) => <StockBadge product={p} />,
  },
  {
    key: 'price',
    header: 'Precio',
    align: 'right',
    sortable: true,
    sortValue: (p) => p.price,
    render: (p) => <span className="font-medium tabular-nums">Q{p.price.toFixed(2)}</span>,
  },
];

const movementColumns: Column<InventoryMovement>[] = [
  {
    key: 'productName',
    header: 'Producto',
    sortable: true,
    sortValue: (m) => m.productName,
    render: (m) => <span className="font-medium text-on-surface">{m.productName}</span>,
  },
  {
    key: 'type',
    header: 'Tipo',
    align: 'center',
    render: (m) => (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold', MOVEMENT_CLASSES[m.type] ?? 'bg-surface-container text-on-surface')}>
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', MOVEMENT_DOTS[m.type] ?? 'bg-outline')} />
        {MOVEMENT_LABELS[m.type] ?? m.type}
      </span>
    ),
  },
  {
    key: 'quantity',
    header: 'Cantidad',
    align: 'right',
    sortable: true,
    sortValue: (m) => m.quantity,
    render: (m) => (
      <span className={cn('font-semibold tabular-nums', m.quantity > 0 ? 'text-[#006b58]' : 'text-error')}>
        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
      </span>
    ),
  },
  {
    key: 'referenceId',
    header: 'Referencia',
    render: (m) => (
      <span className="text-on-surface-variant text-[12px] font-mono truncate max-w-[100px] block">
        {m.referenceId ? m.referenceId.slice(0, 8) + '...' : '—'}
      </span>
    ),
  },
  {
    key: 'note',
    header: 'Nota',
    render: (m) => <span className="text-on-surface-variant text-[13px]">{m.note ?? '—'}</span>,
  },
  {
    key: 'createdAt',
    header: 'Fecha',
    sortable: true,
    sortValue: (m) => m.createdAt,
    render: (m) => <span className="text-on-surface-variant">{new Date(m.createdAt).toLocaleDateString('es-GT')}</span>,
  },
];

export function InventoryPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data: movData, isLoading: movLoading, isFetching, refetch } = useGetMovementsQuery(
    { limit: LIMIT, cursor },
    { refetchOnMountOrArgChange: true },
  );
  const { data: prodData, isLoading: prodLoading } = useGetProductsQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true },
  );

  const movements = movData?.items ?? [];
  const products = prodData?.items ?? [];
  const hasMore = !!movData?.nextCursor;

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const alerts = products.filter(p => p.stock === 0 || (p.minStock > 0 && p.stock <= p.minStock));

  const kpis = [
    { label: 'Total SKUs', value: products.length, sub: 'productos registrados', highlight: false },
    { label: 'Unidades en stock', value: totalUnits.toLocaleString('es-GT'), sub: 'unidades totales', highlight: false },
    { label: 'Con alertas', value: alerts.length, sub: 'bajo mínimo o agotados', highlight: alerts.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Boxes size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Inventario</h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">Stock actual y movimientos de inventario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-outline-variant rounded-xl p-5 shadow-soft">
            <p className="text-label-md text-on-surface-variant">{k.label}</p>
            <p className={cn('text-[28px] font-bold tracking-tight mt-1', k.highlight ? 'text-error' : 'text-on-surface')}>
              {k.value}
            </p>
            <p className="text-label-sm text-on-surface-variant mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={products}
        columns={stockColumns}
        keyExtractor={(p) => p.id}
        isLoading={prodLoading}
        title="Stock actual por producto"
        totalLabel="productos"
        searchFilter={(p, q) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)}
        searchPlaceholder="Buscar producto..."
        emptyTitle="Sin productos"
        emptyDescription="No hay productos registrados en el sistema."
        emptyIcon={Boxes}
      />

      <DataTable
        data={movements}
        columns={movementColumns}
        keyExtractor={(m) => m.id}
        isLoading={movLoading}
        title="Movimientos de inventario"
        totalLabel="movimientos"
        searchPlaceholder="Buscar por producto..."
        searchFilter={(m, q) => m.productName.toLowerCase().includes(q)}
        emptyTitle="Sin movimientos"
        emptyDescription="Los movimientos de stock (compras, ventas, devoluciones) aparecerán aquí."
        emptyIcon={Boxes}
        onRefresh={() => refetch()}
        serverPagination={{ hasMore, onLoadMore: () => setCursor(movData?.nextCursor), isLoading: isFetching }}
      />
    </div>
  );
}
