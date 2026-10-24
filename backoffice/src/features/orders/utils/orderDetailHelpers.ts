import type { Order } from '@shared/types/common';

export interface OrderSummary {
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  total: number;
  hasDiscount: boolean;
}

export function computeOrderSummary(
  order: Pick<Order, 'subtotal' | 'total' | 'discountAmount' | 'discountCode'>,
): OrderSummary {
  const discountAmount = order.discountAmount ?? 0;
  return {
    subtotal: order.subtotal,
    discountCode: order.discountCode ?? null,
    discountAmount,
    total: order.total,
    hasDiscount: !!order.discountCode && discountAmount > 0,
  };
}
