import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@shared/constants/routes';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PRODUCTS} replace />;
  }

  return <>{children}</>;
}
