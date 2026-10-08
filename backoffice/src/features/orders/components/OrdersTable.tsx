import { ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '@shared/types/common';
import { DataTable, type Column, type ServerPagination } from '@shared/components/ui/DataTable';
import { Badge } from '@shared/components/ui/Badge';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useUpdateOrderStatusMutation } from '@features/orders/api/ordersApi';
import { toast } from 'sonner';

const STATUS_VARIANTS: Record<OrderStatus, 'warning' | 'success' | 'info' | 'error'> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  cancelled: 'error',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
};

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  serverPagination?: ServerPagination;
}

export function OrdersTable({ orders, isLoading, serverPagination }: Readonly<OrdersTableProps>) {
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      toast.success('Estado actualizado.');
    } catch {
      toast.error('Error al actualizar el estado.');
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
      render: (o) => <span className="font-medium">{formatCurrency(o.total)}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      sortValue: (o) => o.status,
      render: (o) => (
        <Badge variant={STATUS_VARIANTS[o.status]}>{STATUS_LABELS[o.status]}</Badge>
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
      header: 'Cambiar estado',
      width: '155px',
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
          className="h-7 pl-2 pr-6 text-body-md bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="shipped">Enviado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      ),
    },
  ];

  return (
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
  );
}
