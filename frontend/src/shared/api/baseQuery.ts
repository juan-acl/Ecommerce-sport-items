import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@app/store';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

export const baseQueryWithAuth: AppBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401) {
      const { logout } = await import('@features/auth/store/authSlice');
      toast.info('Tu sesión ha expirado.');
      api.dispatch(logout());
    }
    return result;
  }

  const body = result.data as { success: boolean; data?: unknown; error?: unknown };

  if (body.success) {
    return { data: body };
  }

  return {
    error: {
      status: 'CUSTOM_ERROR',
      data: body.error,
      error: 'API returned error',
    } as FetchBaseQueryError,
  };
};
