import { useState } from 'react';
import { Boxes } from 'lucide-react';
import { useGetMovementsQuery } from '@features/inventory/api/inventoryApi';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import type { InventoryMovement } from '@shared/types/common';
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

export function InventoryPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, refetch } = useGetMovementsQuery({ limit: LIMIT, cursor });

  const movements = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const columns: Column<InventoryMovement>[] = [
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
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
            MOVEMENT_CLASSES[m.type],
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', MOVEMENT_DOTS[m.type])} />
          {MOVEMENT_LABELS[m.type]}
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
        <span
          className={cn(
            'font-semibold tabular-nums',
            m.quantity > 0 ? 'text-[#006b58]' : 'text-error',
          )}
        >
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
      render: (m) => (
        <span className="text-on-surface-variant text-[13px]">
          {m.note ?? '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      sortable: true,
      sortValue: (m) => m.createdAt,
      render: (m) => (
        <span className="text-on-surface-variant">
          {new Date(m.createdAt).toLocaleDateString('es-GT')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Boxes size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Inventario
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Movimientos de inventario y alertas de stock
          </p>
        </div>
      </div>

      <DataTable
        data={movements}
        columns={columns}
        keyExtractor={(m) => m.id}
        isLoading={isLoading}
        title="Movimientos de inventario"
        totalLabel="movimientos"
        searchPlaceholder="Buscar por producto..."
        searchFilter={(m, q) => m.productName.toLowerCase().includes(q)}
        emptyTitle="Sin movimientos"
        emptyDescription="No hay movimientos de inventario registrados."
        emptyIcon={Boxes}
        onRefresh={() => refetch()}
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />
    </div>
  );
}
