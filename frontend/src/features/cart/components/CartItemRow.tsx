import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { buildRoute } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: Readonly<CartItemRowProps>) {
  const { updateQuantity, removeItem, isMutating } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item.quantity < 99) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_auto_1fr_auto] gap-4 sm:gap-6 items-center py-6 border-b border-outline-variant last:border-b-0">
      {/* Producto */}
      <div className="flex items-center gap-4 col-span-full sm:col-span-1">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
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
            className="text-headline-sm text-on-surface hover:text-primary transition-colors line-clamp-2"
          >
            {item.productName}
          </Link>
          <p className="text-label-md text-on-surface-variant mt-1">
            {formatCurrency(item.unitPrice)} c/u
          </p>
        </div>
      </div>

      {/* Selector de cantidad */}
      <div className="inline-flex items-center border border-outline-variant rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={item.quantity <= 1 || isMutating}
          className="px-3 py-2 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Disminuir cantidad"
        >
          <span className="material-symbols-outlined text-base">remove</span>
        </button>
        <span className="px-4 py-2 text-body-md font-semibold min-w-[40px] text-center">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={item.quantity >= 99 || isMutating}
          className="px-3 py-2 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Aumentar cantidad"
        >
          <span className="material-symbols-outlined text-base">add</span>
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-headline-sm text-primary">{formatCurrency(item.subtotal)}</p>
      </div>

      {/* Eliminar */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={isMutating}
        className="p-2 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors disabled:opacity-40"
        aria-label={`Eliminar ${item.productName} del carrito`}
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
}
