import { Link } from 'react-router-dom';
import { useState } from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '@shared/components/ui/Button';
import { buildRoute } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ItemThumb({ src, alt }: Readonly<{ src: string; alt: string }>) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center text-outline">
        <span className="material-symbols-outlined">image_not_supported</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-16 h-16 rounded-lg object-cover bg-surface-container-low"
    />
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const orderShortId = order.id.substring(0, 8).toUpperCase();
  const previewItems = order.items.slice(0, 3);
  const remainingItems = order.items.length - previewItems.length;

  return (
    <article className="bg-white rounded-xl shadow-card overflow-hidden">
      {/* Header con metadata */}
      <header className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant">
        <div>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Fecha
          </p>
          <p className="text-body-md text-on-surface font-semibold">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-body-md text-on-surface font-semibold">
            {formatCurrency(order.total)}
          </p>
        </div>
        <div className="hidden sm:block">
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Productos
          </p>
          <p className="text-body-md text-on-surface font-semibold">
            {order.totalQuantity} unidad{order.totalQuantity === 1 ? '' : 'es'}
          </p>
        </div>
        <div className="text-right col-span-2 sm:col-span-1">
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Orden
          </p>
          <p className="text-body-md text-primary font-semibold font-mono">#{orderShortId}</p>
        </div>
      </header>

      {/* Body con items y status */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Preview de items */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex -space-x-2">
              {previewItems.map((item) => (
                <div
                  key={item.productId}
                  className="border-2 border-white rounded-lg"
                  title={item.productName}
                >
                  <ItemThumb src={item.imageUrl} alt={item.productName} />
                </div>
              ))}
              {remainingItems > 0 && (
                <div className="w-16 h-16 rounded-lg bg-surface-container border-2 border-white flex items-center justify-center">
                  <span className="text-body-md font-semibold text-on-surface-variant">
                    +{remainingItems}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Link to={buildRoute.orderDetail(order.id)}>
              <Button variant="outline" fullWidth>
                Ver detalles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
