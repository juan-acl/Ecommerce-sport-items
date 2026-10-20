import { ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '@shared/types/common';
import { DataTable, type Column, type ServerPagination } from '@shared/components/ui/DataTable';
import { Badge } from '@shared/components/ui/Badge';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useUpdateOrderStatusMutation, useApproveOrderMutation } from '@features/orders/api/ordersApi';
import { toast } from 'sonner';

const STATUS_VARIANTS: Record<OrderStatus, 'warning' | 'success' | 'info' | 'error' | 'default'> = {
  paid:       'success',
  processing: 'warning',
  shipped:    'info',
  delivered:  'default',
  cancelled:  'error',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  paid:       'Pagado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

// Transiciones permitidas por el admin (espeja las del backend)
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  paid:       ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
};

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  serverPagination?: ServerPagination;
  statusFilter?: OrderStatus | '';
  onStatusFilterChange?: (status: OrderStatus | '') => void;
}

export function OrdersTable({ orders, isLoading, serverPagination, statusFilter, onStatusFilterChange }: Readonly<OrdersTableProps>) {
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [approveOrder] = useApproveOrderMutation();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      toast.success(`Estado actualizado a "${STATUS_LABELS[status]}".`);
    } catch (err) {
      const msg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message;
      toast.error(msg ?? 'Error al actualizar el estado.');
    }
  };

  const handleApprove = async (orderId: string, action: 'approve' | 'reject') => {
    const label = action === 'approve' ? 'aprobada' : 'rechazada';
    try {
      await approveOrder({ id: orderId, action }).unwrap();
      toast.success(`Orden ${label} correctamente.`);
    } catch (err) {
      const msg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message;
      toast.error(msg ?? `Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} la orden.`);
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'ID Orden',
      render: (o) => (
        <span className="font-mono text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
          #{o.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'client',
      header: 'Cliente',
      sortable: true,
      sortValue: (o) => o.userEmail ?? o.userId,
      render: (o) => (
        <span className="text-on-surface-variant">{o.userEmail ?? o.userId}</span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      align: 'center',
      render: (o) => (
        <span className="text-on-surface-variant">{o.items?.length ?? 0}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      sortValue: (o) => o.total,
      render: (o) => (
        <div className="flex flex-col items-end gap-1">
          <span className="font-medium">{formatCurrency(o.total)}</span>
          {o.discountCode && o.discountAmount != null && o.discountAmount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#ddfbf2] text-[#005142]">
              {o.discountCode} -{formatCurrency(o.discountAmount)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      sortValue: (o) => o.status,
      render: (o) => (
        <Badge variant={STATUS_VARIANTS[o.status] ?? 'default'}>{STATUS_LABELS[o.status] ?? o.status}</Badge>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      sortable: true,
      sortValue: (o) => o.createdAt,
      render: (o) => (
        <span className="text-on-surface-variant text-label-md">
          {new Date(o.createdAt).toLocaleDateString('es-GT')}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Acciones',
      width: '200px',
      render: (o) => {
        if (o.status === 'paid') {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleApprove(o.id, 'approve')}
                title="Aprobar orden"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-[#d4f5e2] text-[#166534] hover:bg-[#bbf0d0] transition-colors"
              >
                <CheckCircle size={13} />
                Aprobar
              </button>
              <button
                onClick={() => handleApprove(o.id, 'reject')}
                title="Rechazar orden"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca] transition-colors"
              >
                <XCircle size={13} />
                Rechazar
              </button>
            </div>
          );
        }
        const nextOptions = NEXT_STATUSES[o.status] ?? [];
        if (nextOptions.length === 0) {
          return <span className="text-on-surface-variant text-label-sm">—</span>;
        }
        return (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) handleStatusChange(o.id, e.target.value as OrderStatus);
            }}
            className="h-7 pl-2 pr-6 text-body-md bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="" disabled>Mover a…</option>
            {nextOptions.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        );
      },
    },
  ];

  const ALL_STATUSES: Array<{ value: OrderStatus | ''; label: string }> = [
    { value: '', label: 'Todos los estados' },
    { value: 'paid', label: STATUS_LABELS.paid },
    { value: 'processing', label: STATUS_LABELS.processing },
    { value: 'shipped', label: STATUS_LABELS.shipped },
    { value: 'delivered', label: STATUS_LABELS.delivered },
    { value: 'cancelled', label: STATUS_LABELS.cancelled },
  ];

  return (
    <div className="space-y-3">
      {onStatusFilterChange && (
        <div className="flex items-center gap-2">
          <span className="text-label-md text-on-surface-variant">Filtrar por estado:</span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onStatusFilterChange(value as OrderStatus | '')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === value
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <DataTable
        data={orders}
        columns={columns}
        keyExtractor={(o) => o.id}
        isLoading={isLoading}
        title="Órdenes"
        totalLabel="órdenes"
        searchFilter={(o, q) =>
          o.id.toLowerCase().includes(q) ||
          (o.userEmail ?? '').toLowerCase().includes(q) ||
          o.userId.toLowerCase().includes(q)
        }
        searchPlaceholder="Buscar por ID o cliente..."
        emptyTitle="No hay órdenes"
        emptyDescription="Las órdenes de clientes aparecerán aquí."
        emptyIcon={ShoppingBag}
        serverPagination={serverPagination}
      />
    </div>
  );
}
