import { useState } from 'react';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Cart } from '@features/cart/types';
import type { ShippingAddress } from '../types';

interface ReviewOrderProps {
  cart: Cart;
  shippingAddress: ShippingAddress;
  onPlaceOrder: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function ReviewOrder({
  cart,
  shippingAddress,
  onPlaceOrder,
  onBack,
  isProcessing,
}: ReviewOrderProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <h2 className="text-headline-sm text-on-surface mb-6">Revisión final</h2>

        {/* Dirección de envío */}
        <section className="mb-6 pb-6 border-b border-outline-variant">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <div className="flex-1">
              <h3 className="text-body-lg font-semibold text-on-surface mb-1">
                Dirección de envío
              </h3>
              <address className="text-body-md text-on-surface-variant not-italic">
                {shippingAddress.street}
                <br />
                {shippingAddress.city}, {shippingAddress.country}
                <br />
                {shippingAddress.postalCode}
              </address>
            </div>
          </div>
        </section>

        {/* Productos */}
        <section className="mb-6">
          <h3 className="text-body-lg font-semibold text-on-surface mb-4">Productos</h3>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-on-surface line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-label-md text-on-surface-variant">
                    {formatCurrency(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="text-body-md font-semibold text-on-surface whitespace-nowrap">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Términos */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="text-body-md text-on-surface-variant">
            Confirmo que la información proporcionada es correcta y acepto los{' '}
            <a href="#" className="text-primary font-bold hover:underline">
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-primary font-bold hover:underline">
              Política de Privacidad
            </a>
            .
          </span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={isProcessing}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onPlaceOrder}
          disabled={!acceptedTerms || isProcessing}
          isLoading={isProcessing}
        >
          {!isProcessing && (
            <>
              <span className="material-symbols-outlined">lock</span>
              Confirmar y pagar {formatCurrency(cart.total)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
