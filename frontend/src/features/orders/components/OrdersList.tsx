import { OrderCard } from './OrderCard';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { Order } from '../types';
import { v4 as uuid } from 'uuid';

interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrdersList({ orders, isLoading }: Readonly<OrdersListProps>) {
  if (isLoading) {
    return <OrdersListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_) => (
        <div key={uuid()} className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant">
            {Array.from({ length: 4 }).map((_) => (
              <div key={uuid()} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="p-6">
            <Skeleton className="h-7 w-24 mb-4" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_) => (
                  <Skeleton key={uuid()} className="w-16 h-16 !rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
