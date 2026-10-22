import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { InventoryMovement } from '@shared/types/common';

export type StockStatus = 'new' | 'low' | 'out';

export interface StockAlertItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  stock: number;
  minStock: number;
  incomingQty: number;
  status: StockStatus;
}

type BackendMovementsResponse = {
  items: InventoryMovement[];
  count: number;
  nextCursor?: string;
};

type BackendLowStockResponse = {
  products: StockAlertItem[];
};

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Movements', 'LowStock'],
  endpoints: (builder) => ({
    getMovements: builder.query<PaginatedData<InventoryMovement>, { limit?: number; cursor?: string; productId?: string }>({
      query: ({ limit = 50, cursor, productId } = {}) => ({
        url: '/admin/inventory/movements',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(productId && { productId }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendMovementsResponse>) => ({
        items: response.data.items,
        count: response.data.count,
        nextCursor: response.data.nextCursor,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { cursor: _cursor, ...rest } = queryArgs ?? {};
        return `${endpointName}-${JSON.stringify(rest)}`;
      },
      merge: (cache, incoming, { arg }) => {
        if (!arg.cursor) {
          cache.items = incoming.items;
          cache.count = incoming.count;
        } else {
          cache.items.push(...incoming.items);
        }
        cache.nextCursor = incoming.nextCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      providesTags: ['Movements'],
    }),

    getLowStock: builder.query<StockAlertItem[], void>({
      query: () => ({ url: '/admin/inventory/low-stock' }),
      transformResponse: (response: ApiSuccessResponse<BackendLowStockResponse>) =>
        response.data.products,
      providesTags: ['LowStock'],
    }),
  }),
});

export const { useGetMovementsQuery, useGetLowStockQuery } = inventoryApi;
