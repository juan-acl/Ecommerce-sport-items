import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, LogOut, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout, selectCurrentUser } from '@features/auth/store/authSlice';
import { useLogoutMutation } from '@features/auth/api/authApi';
import { ROUTES } from '@shared/constants/routes';
import { toast } from 'sonner';

const SECTION_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PRODUCTS]: 'Productos',
  [ROUTES.USERS]: 'Usuarios',
  [ROUTES.CLIENTS]: 'Clientes',
  [ROUTES.ORDERS]: 'Órdenes',
  [ROUTES.ROLES]: 'Roles y permisos',
};

interface TopBarProps {
  onMobileMenuOpen: () => void;
}

export function TopBar({ onMobileMenuOpen }: Readonly<TopBarProps>) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const { pathname } = useLocation();
  const section = SECTION_TITLES[pathname];

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
    }
    dispatch(logout());
    navigate(ROUTES.LOGIN);
    toast.success('Has cerrado sesión exitosamente.');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className="h-16 bg-white/75 backdrop-blur-md border-b border-outline-variant flex items-center gap-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      <nav className="flex-1 min-w-0 flex items-center gap-2 text-[13px]" aria-label="Ruta actual">
        <span className="text-outline">Backoffice</span>
        {section && (
          <>
            <ChevronRight size={14} className="text-outline" />
            <span className="truncate font-medium text-on-surface">{section}</span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        <span className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-container-low border border-outline-variant text-[12px] text-on-surface-variant capitalize">
          <CalendarDays size={13} />
          {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-medium text-on-surface leading-tight">{user.name}</p>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-mint-dim text-white ring-2 ring-white shadow-[0_0_0_1px_rgba(0,107,88,0.15)] flex items-center justify-center text-[12px] font-semibold select-none shrink-0">
              {initials}
            </div>
          </div>
        )}

        <div className="w-px h-6 bg-outline-variant" />

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 h-8 px-2.5 rounded-md text-[13px] text-on-surface-variant hover:text-error hover:bg-error-container transition-colors disabled:opacity-50"
          title="Cerrar sesión"
        >
          <LogOut size={15} strokeWidth={1.75} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
