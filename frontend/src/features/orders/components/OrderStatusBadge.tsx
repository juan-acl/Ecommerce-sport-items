import { Badge } from '@shared/components/ui/Badge';
import type { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'primary' | 'success' | 'error' | 'outline'; icon: string }
> = {
  pending: { label: 'Pendiente', variant: 'outline', icon: 'schedule' },
  paid: { label: 'Pagado', variant: 'success', icon: 'check_circle' },
  shipped: { label: 'En tránsito', variant: 'success', icon: 'local_shipping' },
  cancelled: { label: 'Cancelado', variant: 'error', icon: 'cancel' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant}>
      <span className="material-symbols-outlined text-base">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
