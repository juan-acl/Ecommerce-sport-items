import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { useAppSelector } from '@app/hooks';
import { selectIsAuthenticated } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Cart } from '../types';
import { toast } from 'sonner';

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: Readonly<CartSummaryProps>) {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para completar tu compra');
      navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.CHECKOUT } } });
      return;
    }
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <aside className="bg-surface-container-low rounded-lg p-6 shadow-card sticky top-24 self-start">
      <h2 className="text-headline-sm text-on-surface mb-6">Resumen del pedido</h2>

      <dl className="space-y-3 mb-6">
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Subtotal</dt>
          <dd className="text-on-surface">{formatCurrency(cart.total)}</dd>
        </div>
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Productos</dt>
          <dd className="text-on-surface">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'unidad' : 'unidades'}
          </dd>
        </div>
        <div className="flex justify-between text-body-md">
          <dt className="text-on-surface-variant">Envío</dt>
          <dd className="text-secondary font-semibold">A calcular</dd>
        </div>
      </dl>

      <div className="border-t border-outline-variant pt-4 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-headline-sm text-on-surface">Total</span>
          <span className="text-headline-md text-primary">{formatCurrency(cart.total)}</span>
        </div>
      </div>

      <Button fullWidth size="lg" onClick={handleCheckout}>
        {isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para comprar'}
        <span className="material-symbols-outlined">arrow_forward</span>
      </Button>

      {!isAuthenticated && (
        <p className="text-label-md text-on-surface-variant text-center mt-3">
          Necesitas una cuenta para finalizar la compra
        </p>
      )}

      <div className="mt-6 pt-6 border-t border-outline-variant space-y-3">
        <div className="flex items-center gap-3 text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary">verified_user</span>
          Pago seguro con cifrado SSL
        </div>
        <div className="flex items-center gap-3 text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary">local_shipping</span>
          Envío en 3-5 días hábiles
        </div>
      </div>
    </aside>
  );
}
