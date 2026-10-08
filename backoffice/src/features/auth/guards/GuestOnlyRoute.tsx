import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks';
import { selectIsAuthenticated } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

export function GuestOnlyRoute({ children }: Readonly<GuestOnlyRouteProps>) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
