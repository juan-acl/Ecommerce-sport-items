import { useState } from 'react';
import { useGetOrdersQuery } from '@features/orders/api/ordersApi';
import { OrdersTable } from '@features/orders/components/OrdersTable';

const LIMIT = 20;

export function OrdersPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching } = useGetOrdersQuery({ limit: LIMIT, cursor });

  const orders = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md text-on-surface">Órdenes</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Gestión de órdenes de clientes
        </p>
      </div>

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />
    </div>
  );
}
