import { cartApi } from '@/features/cart/api/cartApi';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';
import type { User } from '@shared/types/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApi.util.invalidateTags(['Cart']));
        } catch {
          console.log('Login Failed, cart cache not invalidated');
        }
      },
      transformResponse: (response: ApiSuccessResponse<AuthResponse>) => response.data,
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiSuccessResponse<AuthResponse>) => response.data,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
