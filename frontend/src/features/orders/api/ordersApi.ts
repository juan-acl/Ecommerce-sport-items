import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@shared/types/api';
import type { Order, CheckoutPayload } from '../types';

export interface ListOrdersQuery {
  limit?: number;
  cursor?: string;
}

export interface ListOrdersResponse {
  orders: Order[];
  pagination: {
    limit: number;
    count: number;
    nextCursor?: string;
  };
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    checkout: builder.mutation<Order, CheckoutPayload>({
      query: (body) => ({
        url: '/orders/checkout',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      invalidatesTags: ['Order'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidar el cache del carrito porque el backend lo vació
          const { cartApi } = await import('@features/cart/api/cartApi');
          dispatch(cartApi.util.invalidateTags(['Cart']));
        } catch {
          // Si el checkout falló, no invalidamos nada
        }
      },
    }),
    listOrders: builder.query<ListOrdersResponse, ListOrdersQuery>({
      query: ({ limit = 10, cursor } = {}) => ({
        url: '/orders',
        params: {
          limit,
          ...(cursor && { cursor }),
        },
      }),
      transformResponse: (response: ApiPaginatedResponse<Order>) => ({
        orders: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
  }),
});

export const { useCheckoutMutation, useListOrdersQuery, useGetOrderQuery, useLazyListOrdersQuery } =
  ordersApi;
