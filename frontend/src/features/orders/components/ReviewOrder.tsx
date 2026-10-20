import { useState } from 'react';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Cart } from '@features/cart/types';
import type { ShippingAddress, PaymentMethodInfo } from '../types';
import type { AppliedDiscount } from './DiscountCodeInput';

const CARD_LABELS: Record<PaymentMethodInfo['cardType'], string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  other: 'Tarjeta',
};

interface ReviewOrderProps {
  cart: Cart;
  shippingAddress: ShippingAddress;
  paymentMethod?: PaymentMethodInfo | null;
  onPlaceOrder: () => void;
  onBack: () => void;
  isProcessing: boolean;
  appliedDiscount?: AppliedDiscount | null;
}

export function ReviewOrder({
  cart,
  shippingAddress,
  paymentMethod,
  onPlaceOrder,
  onBack,
  isProcessing,
  appliedDiscount,
}: ReviewOrderProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const finalTotal = appliedDiscount ? appliedDiscount.finalTotal : cart.total;

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

        {/* Método de pago */}
        {paymentMethod && (
          <section className="mb-6 pb-6 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">credit_card</span>
              <div className="flex-1">
                <h3 className="text-body-lg font-semibold text-on-surface mb-0.5">
                  Método de pago
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {CARD_LABELS[paymentMethod.cardType]} •••• {paymentMethod.last4}
                  <span className="ml-3 text-label-md">
                    Vence {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

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

        {/* Resumen de precios */}
        <section className="pt-4 border-t border-outline-variant">
          <dl className="space-y-2">
            <div className="flex justify-between text-body-md">
              <dt className="text-on-surface-variant">Subtotal</dt>
              <dd className="text-on-surface">{formatCurrency(cart.total)}</dd>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-body-md">
                <dt className="text-on-surface-variant">
                  Descuento{' '}
                  <span className="font-mono text-[11px] font-semibold text-secondary">
                    ({appliedDiscount.code})
                  </span>
                </dt>
                <dd className="text-secondary font-semibold">
                  -{formatCurrency(appliedDiscount.discountAmount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant">
              <dt className="text-body-lg font-semibold text-on-surface">Total</dt>
              <dd className="text-headline-sm text-primary font-bold">
                {formatCurrency(finalTotal)}
              </dd>
            </div>
          </dl>
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
              Confirmar y pagar {formatCurrency(finalTotal)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
