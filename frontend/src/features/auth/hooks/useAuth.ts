import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  setCredentials,
  logout as logoutAction,
} from '../store/authSlice';
import type { User } from '@shared/types/common';
import { toast } from 'sonner';

export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const setAuth = (payload: { user: User; token: string }) => {
    dispatch(setCredentials(payload));
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success('Has cerrado sesión exitosamente.');
  };

  return {
    isAuthenticated,
    user,
    setAuth,
    logout,
  };
}
