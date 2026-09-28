import { Link } from 'react-router-dom';
import { useState } from 'react';
import { buildRoute } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { OrderItem } from '../types';

interface OrderItemsListProps {
  items: OrderItem[];
}

function ItemRow({ item }: Readonly<{ item: OrderItem }>) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-start gap-4 py-4 border-b border-outline-variant last:border-b-0">
      <div className="w-20 h-20 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined">image_not_supported</span>
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.productName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          to={buildRoute.productDetail(item.productId)}
          className="text-body-lg font-semibold text-on-surface hover:text-primary transition-colors line-clamp-2"
        >
          {item.productName}
        </Link>
        <p className="text-label-md text-on-surface-variant mt-1">
          {formatCurrency(item.unitPrice)} × {item.quantity}
        </p>
      </div>

      <p className="text-body-lg font-semibold text-primary whitespace-nowrap">
        {formatCurrency(item.subtotal)}
      </p>
    </div>
  );
}

export function OrderItemsList({ items }: Readonly<OrderItemsListProps>) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <h2 className="text-headline-sm text-on-surface mb-2">Productos ({items.length})</h2>
      <div>
        {items.map((item) => (
          <ItemRow key={item.productId} item={item} />
        ))}
      </div>
    </div>
  );
}
