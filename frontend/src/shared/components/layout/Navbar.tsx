import { Link, NavLink, useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser, logout } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { CartIcon } from '@/features/cart/components/CartIcon';
import { toast } from 'sonner';

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate(ROUTES.HOME);
    toast.success('Has cerrado sesión exitosamente.');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-bright border-b border-outline-variant">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex items-center gap-unit-sm">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-cta">
            <span className="material-symbols-outlined !text-white text-xl">sports</span>
          </div>
          <span className="text-headline-sm text-primary tracking-tight">SportCart</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to={ROUTES.PRODUCTS}
            className={({ isActive }) =>
              cn(
                'text-body-md transition-colors',
                isActive
                  ? 'text-primary font-semibold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary',
              )
            }
          >
            Productos
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to={ROUTES.ORDERS}
              className={({ isActive }) =>
                cn(
                  'text-body-md transition-colors',
                  isActive
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary',
                )
              }
            >
              Mis órdenes
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CartIcon />

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                aria-label="Menú de usuario"
              >
                <span className="material-symbols-outlined text-on-surface">person</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-outline-variant overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant">
                    <p className="text-body-md font-semibold text-on-surface truncate">
                      {user?.name}
                    </p>
                    <p className="text-label-md text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <Link
                    to={ROUTES.ORDERS}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline">receipt_long</span>
                    Mis órdenes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-body-md text-error hover:bg-error-container/30 transition-colors"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 text-body-md bg-primary text-white rounded-lg hover:bg-primary-container transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
