import { Link } from 'react-router-dom';
import { useOrders } from '@features/orders/hooks/useOrders';
import { ProfileSidebar } from '@features/orders/components/ProfileSidebar';
import { OrdersList } from '@features/orders/components/OrdersList';
import { Button } from '@shared/components/ui/Button';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { ROUTES } from '@shared/constants/routes';

export function OrderHistoryPage() {
  const { orders, isLoading, isFetching, hasMore, loadMore } = useOrders();
  const isInitialLoading = isLoading && orders.length === 0;
  const isEmpty = !isInitialLoading && orders.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <ProfileSidebar />

        <section>
          <header className="mb-6">
            <h1 className="text-headline-lg text-on-surface mb-2">Mis órdenes</h1>
            <p className="text-body-md text-on-surface-variant">
              Consulta el historial de tus compras y el estado de tus pedidos.
            </p>
          </header>

          {isEmpty ? (
            <EmptyState
              icon="inventory_2"
              title="Aún no tienes órdenes"
              description="Cuando hagas tu primera compra, aparecerá aquí."
              action={
                <Link to={ROUTES.PRODUCTS}>
                  <Button>
                    <span className="material-symbols-outlined">storefront</span>
                    Explorar productos
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <OrdersList orders={orders} isLoading={isInitialLoading} />

              {hasMore && !isInitialLoading && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" size="lg" onClick={loadMore} isLoading={isFetching}>
                    Cargar más órdenes
                  </Button>
                </div>
              )}

              {!hasMore && orders.length > 0 && (
                <div className="text-center mt-8 py-6 border-t border-outline-variant">
                  <p className="text-body-md text-on-surface-variant">
                    Has visto todas tus órdenes
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
