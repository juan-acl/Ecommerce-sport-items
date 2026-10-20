export const ORDER_STATUS = {
  PAID: 'paid',             // checkout confirmado (pago simulado)
  PROCESSING: 'processing', // admin preparando el pedido
  SHIPPED: 'shipped',       // pedido despachado
  DELIVERED: 'delivered',   // pedido entregado al cliente
  CANCELLED: 'cancelled',   // cancelado (solo desde paid o processing)
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Transiciones válidas que el admin puede aplicar
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  paid:       ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
};
