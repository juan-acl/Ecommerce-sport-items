import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout, selectCurrentUser } from '@features/auth/store/authSlice';
import { useLogoutMutation } from '@features/auth/api/authApi';
import { ROUTES } from '@shared/constants/routes';
import { toast } from 'sonner';

interface TopBarProps {
  onMobileMenuOpen: () => void;
}

export function TopBar({ onMobileMenuOpen }: Readonly<TopBarProps>) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logoutApi, { isLoading }] = useLogoutMutation();

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
    <header className="h-14 bg-white border-b border-outline-variant flex items-center gap-3 px-4 sticky top-0 z-20">
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-body-md font-semibold text-on-surface leading-tight">{user.name}</p>
              <p className="text-label-md text-on-surface-variant leading-tight">{user.email}</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-md font-bold select-none shrink-0">
              {initials}
            </div>

            <div className="w-px h-5 bg-outline-variant" />
          </>
        )}

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-md text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors disabled:opacity-50"
          title="Cerrar sesión"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
