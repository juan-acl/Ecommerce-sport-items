import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@features/cart/hooks/useCart';
import { useCheckoutMutation } from '@features/orders/api/ordersApi';
import { CheckoutSteps, type CheckoutStep } from '@features/orders/components/CheckoutSteps';
import { ShippingForm } from '@features/orders/components/ShippingForm';
import { PaymentMethod } from '@features/orders/components/PaymentMethod';
import { ReviewOrder } from '@features/orders/components/ReviewOrder';
import { CheckoutSummary } from '@features/orders/components/CheckoutSummary';
import { OrderConfirmation } from '@features/orders/components/OrderConfirmation';
import { ROUTES } from '@shared/constants/routes';
import type { ShippingAddressFormData } from '@features/orders/api/schemas';
import type { Order } from '@features/orders/types';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [checkout, { isLoading: isProcessing }] = useCheckoutMutation();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressFormData | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Si llegan al checkout con carrito vacío, redirigir
  if (cart.items.length === 0 && !completedOrder) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  // Si ya hay orden creada, mostrar pantalla de confirmación
  if (completedOrder) {
    return <OrderConfirmation order={completedOrder} />;
  }

  const handleShippingSubmit = (data: ShippingAddressFormData) => {
    setShippingAddress(data);
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentContinue = () => {
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;

    try {
      const order = await checkout({ shippingAddress }).unwrap();
      setCompletedOrder(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const error = err as { data?: { error: { message?: string; code?: string } } };
      const code = error.data?.error?.code;

      if (code === 'CONFLICT') {
        toast.error(
          error.data?.error?.message ?? 'Algunos productos ya no tienen stock suficiente',
        );
        // Volvemos al carrito para que el usuario revise
        setTimeout(() => navigate(ROUTES.CART), 1500);
      } else if (code === 'EMPTY_CART') {
        toast.error('Tu carrito está vacío');
        navigate(ROUTES.CART);
      } else {
        toast.error(error.data?.error?.message ?? 'No se pudo procesar tu orden');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-headline-lg text-on-surface mb-2">Finalizar compra</h1>
        <p className="text-body-md text-on-surface-variant">
          Completa tu información para procesar la orden.
        </p>
      </header>

      <CheckoutSteps currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <section>
          {currentStep === 'shipping' && (
            <ShippingForm
              defaultValues={shippingAddress ?? undefined}
              onSubmit={handleShippingSubmit}
              onBack={() => navigate(ROUTES.CART)}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentMethod
              onContinue={handlePaymentContinue}
              onBack={() => setCurrentStep('shipping')}
            />
          )}

          {currentStep === 'review' && shippingAddress && (
            <ReviewOrder
              cart={cart}
              shippingAddress={shippingAddress}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setCurrentStep('payment')}
              isProcessing={isProcessing}
            />
          )}
        </section>

        <CheckoutSummary cart={cart} />
      </div>
    </div>
  );
}
