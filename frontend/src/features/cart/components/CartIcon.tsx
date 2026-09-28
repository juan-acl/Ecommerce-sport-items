import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '@shared/constants/routes';

export function CartIcon() {
  const { cart } = useCart();

  return (
    <Link
      to={ROUTES.CART}
      className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors"
      aria-label={`Carrito (${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'producto' : 'productos'})`}
    >
      <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
      {cart.totalQuantity > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 leading-none">
          {cart.totalQuantity > 99 ? '99+' : cart.totalQuantity}
        </span>
      )}
    </Link>
  );
}
