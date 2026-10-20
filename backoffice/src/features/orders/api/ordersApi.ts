import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { Order, OrderStatus } from '@shared/types/common';


export interface UpdateOrderStatusRequest {
  id: string;
  status: OrderStatus;
}

export interface ApproveOrderRequest {
  id: string;
  action: 'approve' | 'reject';
}

export interface OrdersQueryParams {
  limit?: number;
  cursor?: string;
  status?: OrderStatus | '';
}

type BackendOrdersResponse = { orders: Order[]; nextCursor?: string; count: number };

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedData<Order>, OrdersQueryParams>({
      query: ({ limit = 20, cursor, status } = {}) => ({
        url: '/admin/orders',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(status && { status }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendOrdersResponse>) => ({
        items: response.data.orders,
        nextCursor: response.data.nextCursor,
        count: response.data.count,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (cache, incoming, { arg }) => {
        if (!arg.cursor) {
          cache.items = incoming.items;
          cache.count = incoming.count;
        } else {
          cache.items.push(...incoming.items);
        }
        cache.nextCursor = incoming.nextCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.cursor !== previousArg?.cursor ||
        currentArg?.status !== previousArg?.status,
      providesTags: ['Orders'],
    }),

    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      invalidatesTags: ['Orders'],
    }),

    approveOrder: builder.mutation<Order, ApproveOrderRequest>({
      query: ({ id, action }) => ({
        url: `/admin/orders/${id}/approve`,
        method: 'POST',
        body: { action },
      }),
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      invalidatesTags: ['Orders'],
    }),

  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useApproveOrderMutation,
} = ordersApi;
