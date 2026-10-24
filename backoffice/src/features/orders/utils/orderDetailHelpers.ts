import type { Order, OrderStatus } from '@shared/types/common';

export type BadgeVariant = 'warning' | 'success' | 'info' | 'error' | 'default';

export const ORDER_STATUS_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  paid:       'success',
  processing: 'warning',
  shipped:    'info',
  delivered:  'default',
  cancelled:  'error',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  paid:       'Pagado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

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
