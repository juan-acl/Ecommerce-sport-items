import { Link } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';

export function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-card py-20 px-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-outline">shopping_cart</span>
      </div>
      <h2 className="text-headline-md text-on-surface mb-2">Tu carrito está vacío</h2>
      <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
        Explora nuestro catálogo y agrega productos para comenzar tu compra.
      </p>
      <Link to={ROUTES.PRODUCTS}>
        <Button size="lg">
          <span className="material-symbols-outlined">storefront</span>
          Explorar productos
        </Button>
      </Link>
    </div>
  );
}
