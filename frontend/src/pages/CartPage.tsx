import { Link } from 'react-router-dom';
import { useCart } from '@features/cart/hooks/useCart';
import { CartItemRow } from '@features/cart/components/CartItemRow';
import { CartSummary } from '@features/cart/components/CartSummary';
import { EmptyCart } from '@features/cart/components/EmptyCart';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { ROUTES } from '@shared/constants/routes';

export function CartPage() {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-headline-lg text-on-surface mb-2">Carrito de compras</h1>
        <p className="text-body-md text-on-surface-variant">
          Revisa tu selección y procede al pago.
        </p>
      </header>

      {cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <section>
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <header className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_auto_1fr_auto] gap-4 sm:gap-6 px-6 py-4 bg-surface-container-low border-b border-outline-variant">
                <span className="text-label-md text-on-surface-variant uppercase tracking-wider col-span-full sm:col-span-1">
                  Producto
                </span>
                <span className="hidden sm:block text-label-md text-on-surface-variant uppercase tracking-wider text-center">
                  Cantidad
                </span>
                <span className="hidden sm:block text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Subtotal
                </span>
                <span className="sr-only">Acciones</span>
              </header>

              <div className="px-6">
                {cart.items.map((item) => (
                  <CartItemRow key={item.productId} item={item} />
                ))}
              </div>
            </div>

            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 mt-6 text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Continuar comprando
            </Link>
          </section>

          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
