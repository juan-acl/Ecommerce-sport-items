import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { Purchase } from '@shared/types/common';

export interface CreatePurchaseItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseRequest {
  supplierId: string;
  items: CreatePurchaseItemRequest[];
  notes?: string;
}

export interface PartialReceiveItemRequest {
  productId: string;
  receivedQuantity: number;
}

export interface PartialReceivePurchaseRequest {
  id: string;
  items: PartialReceiveItemRequest[];
}

type BackendPurchasesResponse = {
  items: Purchase[];
  count: number;
  nextCursor?: string;
};

export const purchasesApi = createApi({
  reducerPath: 'purchasesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Purchases'],
  endpoints: (builder) => ({
    getPurchases: builder.query<PaginatedData<Purchase>, { limit?: number; cursor?: string; supplierId?: string }>({
      query: ({ limit = 20, cursor, supplierId } = {}) => ({
        url: '/admin/purchases',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(supplierId && { supplierId }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendPurchasesResponse>) => ({
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
      providesTags: ['Purchases'],
    }),

    getPurchase: builder.query<Purchase, string>({
      query: (id) => ({ url: `/admin/purchases/${id}` }),
      transformResponse: (response: ApiSuccessResponse<Purchase>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Purchases', id }],
    }),

    createPurchase: builder.mutation<Purchase, CreatePurchaseRequest>({
      query: (body) => ({ url: '/admin/purchases', method: 'POST', body }),
      transformResponse: (response: ApiSuccessResponse<Purchase>) => response.data,
      invalidatesTags: ['Purchases'],
    }),

    receivePurchase: builder.mutation<Purchase, string>({
      query: (id) => ({ url: `/admin/purchases/${id}/receive`, method: 'PUT' }),
      transformResponse: (response: ApiSuccessResponse<Purchase>) => response.data,
      invalidatesTags: ['Purchases'],
    }),

    cancelPurchase: builder.mutation<Purchase, string>({
      query: (id) => ({ url: `/admin/purchases/${id}/cancel`, method: 'PUT' }),
      transformResponse: (response: ApiSuccessResponse<Purchase>) => response.data,
      invalidatesTags: ['Purchases'],
    }),

    partialReceivePurchase: builder.mutation<Purchase, PartialReceivePurchaseRequest>({
      query: ({ id, items }) => ({
        url: `/admin/purchases/${id}/partial-receive`,
        method: 'PUT',
        body: { items },
      }),
      transformResponse: (response: ApiSuccessResponse<Purchase>) => response.data,
      invalidatesTags: ['Purchases'],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useCreatePurchaseMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  usePartialReceivePurchaseMutation,
} = purchasesApi;
