import { Link } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { ROUTES, buildRoute } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const orderShortId = order.id.substring(0, 8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-card p-8 sm:p-12 text-center">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-on-secondary-container">
            check_circle
          </span>
        </div>

        <h1 className="text-headline-lg text-on-surface mb-3">¡Compra confirmada!</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          Tu orden ha sido procesada exitosamente. Recibirás un correo de confirmación en breve.
        </p>

        <div className="bg-surface-container-low rounded-lg p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-variant">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">
              Número de orden
            </span>
            <span className="text-headline-sm text-primary font-mono">#{orderShortId}</span>
          </div>

          <dl className="space-y-2 mb-4">
            <div className="flex justify-between text-body-md">
              <dt className="text-on-surface-variant">Productos</dt>
              <dd className="text-on-surface">{order.items.length}</dd>
            </div>
            <div className="flex justify-between text-body-md">
              <dt className="text-on-surface-variant">Estado</dt>
              <dd className="text-on-surface capitalize font-semibold">{order.status}</dd>
            </div>
          </dl>

          <div className="flex justify-between items-baseline pt-4 border-t border-outline-variant">
            <span className="text-body-lg text-on-surface">Total pagado</span>
            <span className="text-headline-md text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={buildRoute.orderDetail(order.id)} className="flex-1">
            <Button fullWidth variant="outline">
              <span className="material-symbols-outlined">receipt_long</span>
              Ver detalles
            </Button>
          </Link>
          <Link to={ROUTES.PRODUCTS} className="flex-1">
            <Button fullWidth>
              Seguir comprando
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
