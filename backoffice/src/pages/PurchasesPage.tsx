import { useState, useEffect } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useGetPurchasesQuery } from '@features/purchases/api/purchasesApi';
import { useGetSuppliersQuery } from '@features/suppliers/api/suppliersApi';
import { useGetProductsQuery } from '@features/products/api/productsApi';
import { PurchaseFormModal } from '@features/purchases/components/PurchaseFormModal';
import { PurchaseDetailModal } from '@features/purchases/components/PurchaseDetailModal';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import { Button } from '@shared/components/ui/Button';
import type { Purchase } from '@shared/types/common';
import { cn } from '@shared/utils/cn';

const LIMIT = 20;

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  partial: 'Parcialmente recibida',
  received: 'Recibida',
  cancelled: 'Cancelada',
};

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  partial: 'bg-blue-50 text-blue-700 border border-blue-200',
  received: 'bg-[#ddfbf2] text-[#006b58] border border-[#006b58]/20',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const STATUS_DOTS: Record<string, string> = {
  pending: 'bg-amber-400',
  partial: 'bg-blue-500',
  received: 'bg-[#006b58]',
  cancelled: 'bg-red-500',
};

export function PurchasesPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, refetch } = useGetPurchasesQuery({ limit: LIMIT, cursor });
  const { data: suppliersData } = useGetSuppliersQuery({ limit: 100 });
  const { data: productsData } = useGetProductsQuery({ limit: 100 });

  const purchases = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const [formOpen, setFormOpen] = useState(false);
  const [detailPurchase, setDetailPurchase] = useState<Purchase | null>(null);

  // Keep the open detail modal in sync with fresh data after any mutation
  useEffect(() => {
    if (!detailPurchase) return;
    const fresh = purchases.find((p) => p.id === detailPurchase.id);
    if (fresh) setDetailPurchase(fresh);
  }, [purchases]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<Purchase>[] = [
    {
      key: 'supplierName',
      header: 'Proveedor',
      sortable: true,
      sortValue: (p) => p.supplierName,
      render: (p) => <span className="font-medium text-on-surface">{p.supplierName}</span>,
    },
    {
      key: 'items',
      header: 'Productos',
      align: 'center',
      render: (p) => <span>{p.items.length}</span>,
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      sortValue: (p) => p.total,
      render: (p) => <span className="font-semibold">Q{p.total.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      render: (p) => (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
            STATUS_CLASSES[p.status],
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOTS[p.status])} />
          {STATUS_LABELS[p.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      sortable: true,
      sortValue: (p) => p.createdAt,
      render: (p) => (
        <span className="text-on-surface-variant">
          {new Date(p.createdAt).toLocaleDateString('es-GT')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Detalle',
      align: 'center',
      render: (p) => (
        <button
          type="button"
          onClick={() => setDetailPurchase(p)}
          className="text-[12px] font-medium text-[#006b58] hover:underline"
        >
          Ver
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <ShoppingCart size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Compras
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Gestión de órdenes de compra a proveedores
          </p>
        </div>
      </div>

      <DataTable
        data={purchases}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        title="Compras"
        totalLabel="compras"
        searchPlaceholder="Buscar por proveedor..."
        searchFilter={(p, q) => p.supplierName.toLowerCase().includes(q)}
        emptyTitle="Sin compras"
        emptyDescription="Aún no hay compras registradas."
        emptyIcon={ShoppingCart}
        onRefresh={() => refetch()}
        actions={
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} />
            Nueva Compra
          </Button>
        }
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <PurchaseFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setCursor(undefined); }}
        suppliers={suppliersData?.items ?? []}
        products={productsData?.items ?? []}
      />

      <PurchaseDetailModal
        isOpen={!!detailPurchase}
        onClose={() => { setDetailPurchase(null); setCursor(undefined); }}
        purchase={detailPurchase}
      />
    </div>
  );
}
