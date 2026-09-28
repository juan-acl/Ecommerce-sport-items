import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetOrderQuery } from '@features/orders/api/ordersApi';
import { OrderTracking } from '@features/orders/components/OrderTracking';
import { OrderItemsList } from '@features/orders/components/OrderItemsList';
import { OrderSummaryCard } from '@features/orders/components/OrderSummaryCard';
import { ShippingAddressCard } from '@features/orders/components/ShippingAddressCard';
import { SupportCard } from '@features/orders/components/SupportCard';
import { OrderStatusBadge } from '@features/orders/components/OrderStatusBadge';
import { Button } from '@shared/components/ui/Button';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useAppSelector } from '@app/hooks';
import { selectCurrentUser } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const { data: order, isLoading, error } = useGetOrderQuery(orderId!, { skip: !orderId });

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <EmptyState
          icon="error"
          title="Orden no encontrada"
          description="La orden que buscas no existe o no tienes permisos para verla."
          action={<Button onClick={() => navigate(ROUTES.ORDERS)}>Ver mis órdenes</Button>}
        />
      </div>
    );
  }

  const orderShortId = order.id.substring(0, 8).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-body-md text-on-surface-variant mb-6">
        <Link to={ROUTES.ORDERS} className="hover:text-primary transition-colors">
          Mis órdenes
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-on-surface">Orden #{orderShortId}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-headline-lg text-on-surface">Orden #{orderShortId}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-body-md text-on-surface-variant">
            Realizada el {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <span className="material-symbols-outlined">download</span>
            Descargar factura
          </Button>
          <Button>
            <span className="material-symbols-outlined">local_shipping</span>
            Rastrear envío
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Columna izquierda */}
        <section className="space-y-6">
          <OrderTracking status={order.status} createdAt={order.createdAt} />
          <OrderItemsList items={order.items} />
        </section>

        {/* Columna derecha */}
        <aside className="space-y-6">
          <OrderSummaryCard order={order} />
          <ShippingAddressCard address={order.shippingAddress} recipientName={user?.name} />
          <SupportCard />
        </aside>
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
