import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';
import type { Cart, AddToCartPayload } from '../types';

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      transformResponse: (response: ApiSuccessResponse<Cart>) => response.data,
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<Cart, AddToCartPayload>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Cart>) => response.data,
      invalidatesTags: ['Cart'],
    }),

    updateQuantity: builder.mutation<Cart, UpdateQuantityPayload>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      transformResponse: (response: ApiSuccessResponse<Cart>) => response.data,
      invalidatesTags: ['Cart'],
    }),

    removeFromCart: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiSuccessResponse<Cart>) => response.data,
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveFromCartMutation,
} = cartApi;
