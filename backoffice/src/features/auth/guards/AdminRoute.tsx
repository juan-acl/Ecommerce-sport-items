import type { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
  logout,
  selectIsAuthenticated,
  selectHasBackofficeAccess,
} from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { Button } from '@shared/components/ui/Button';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: Readonly<AdminRouteProps>) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasAccess = useAppSelector(selectHasBackofficeAccess);
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bright">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={40} className="text-error" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-3">Acceso denegado</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            Tu cuenta no tiene permisos para acceder al panel de administración.
          </p>
          <Button variant="outline" onClick={handleBackToLogin}>
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
