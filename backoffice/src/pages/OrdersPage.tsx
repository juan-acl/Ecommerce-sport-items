import { ShoppingBag } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <ShoppingBag size={20} strokeWidth={1.75} />
        </div>
        <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Órdenes</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">
          Gestión de órdenes de clientes
        </p>
      </div>
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
