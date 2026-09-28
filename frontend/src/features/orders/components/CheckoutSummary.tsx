import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Cart } from '@features/cart/types';

interface CheckoutSummaryProps {
  cart: Cart;
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <aside className="bg-surface-container-low rounded-xl p-6 shadow-card sticky top-24 self-start">
      <h2 className="text-headline-sm text-on-surface mb-6">Resumen del pedido</h2>

      {/* Items */}
      <div className="space-y-4 mb-6 pb-6 border-b border-outline-variant max-h-80 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 leading-none">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-md text-on-surface line-clamp-1 font-medium">
                {item.productName}
              </p>
              <p className="text-label-md text-on-surface-variant">
                {formatCurrency(item.unitPrice)}
              </p>
            </div>
            <p className="text-body-md text-on-surface whitespace-nowrap">
              {formatCurrency(item.subtotal)}
            </p>
          </div>
        ))}
      </div>

      {/* Totales */}
      <dl className="space-y-3 mb-6">
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Subtotal</dt>
          <dd className="text-on-surface">{formatCurrency(cart.total)}</dd>
        </div>
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Envío</dt>
          <dd className="text-secondary font-semibold">A calcular</dd>
        </div>
      </dl>

      <div className="border-t border-outline-variant pt-4">
        <div className="flex justify-between items-baseline">
          <span className="text-headline-sm text-on-surface">Total</span>
          <span className="text-headline-md text-primary">{formatCurrency(cart.total)}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-outline-variant space-y-2">
        <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
          Pago seguro con cifrado SSL
        </div>
      </div>
    </aside>
  );
}
