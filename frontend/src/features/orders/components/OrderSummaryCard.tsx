import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Order } from '../types';

interface OrderSummaryCardProps {
  order: Order;
}

export function OrderSummaryCard({ order }: Readonly<OrderSummaryCardProps>) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="text-headline-sm text-on-surface mb-4">Resumen del pedido</h3>

      <dl className="space-y-3 mb-4 pb-4 border-b border-outline-variant">
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Subtotal</dt>
          <dd className="text-on-surface">{formatCurrency(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Envío</dt>
          <dd className="text-secondary font-semibold">Gratis</dd>
        </div>
      </dl>

      <div className="flex justify-between items-baseline">
        <span className="text-body-lg font-semibold text-on-surface">Total</span>
        <span className="text-headline-md text-primary">{formatCurrency(order.total)}</span>
      </div>
    </div>
  );
}
