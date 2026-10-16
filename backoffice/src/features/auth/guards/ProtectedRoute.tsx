import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { useAppSelector } from '@app/hooks';
import { selectCanAccess, selectPermissions } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { Button } from '@shared/components/ui/Button';

interface ProtectedRouteProps {
  children: ReactNode;
  module: string;
  action?: string;
}

export function ProtectedRoute({ children, module, action = 'view' }: Readonly<ProtectedRouteProps>) {
  const permissions = useAppSelector(selectPermissions);
  const canAccess = useAppSelector(selectCanAccess(module, action));

  // Empty permissions array means super admin — unrestricted access
  if (permissions.length === 0) return <>{children}</>;

  if (!canAccess) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={40} className="text-error" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-3">Sin permiso</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            No tienes permiso para ver este módulo. Contacta a un administrador si crees que esto es un error.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
