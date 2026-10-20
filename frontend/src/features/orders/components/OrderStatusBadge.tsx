import { Badge } from '@shared/components/ui/Badge';
import type { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'primary' | 'success' | 'error' | 'outline' | 'warning'; icon: string }
> = {
  paid:       { label: 'Confirmado',  variant: 'success', icon: 'check_circle' },
  processing: { label: 'En proceso',  variant: 'warning', icon: 'inventory_2' },
  shipped:    { label: 'En tránsito', variant: 'primary', icon: 'local_shipping' },
  delivered:  { label: 'Entregado',   variant: 'success', icon: 'home' },
  cancelled:  { label: 'Cancelado',   variant: 'error',   icon: 'cancel' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['paid'];

  return (
    <Badge variant={config.variant}>
      <span className="material-symbols-outlined text-base">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
