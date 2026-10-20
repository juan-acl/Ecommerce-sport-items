import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { Discount } from '@shared/types/common';

export interface CreateDiscountRequest {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxUses: number;
  expiresAt: string | null;
  applicableCategories?: string[];
}

type BackendDiscountsResponse = {
  items: Discount[];
  count: number;
  nextCursor?: string;
};

export const discountsApi = createApi({
  reducerPath: 'discountsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Discount'],
  endpoints: (builder) => ({
    getDiscounts: builder.query<PaginatedData<Discount>, { limit?: number; cursor?: string }>({
      query: ({ limit = 20, cursor } = {}) => ({
        url: '/admin/discounts',
        params: {
          limit,
          ...(cursor && { cursor }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendDiscountsResponse>) => ({
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
      providesTags: ['Discount'],
    }),

    createDiscount: builder.mutation<Discount, CreateDiscountRequest>({
      query: (body) => ({ url: '/admin/discounts', method: 'POST', body }),
      transformResponse: (response: ApiSuccessResponse<Discount>) => response.data,
      invalidatesTags: ['Discount'],
    }),

    toggleDiscount: builder.mutation<Discount, string>({
      query: (id) => ({ url: `/admin/discounts/${id}/toggle`, method: 'PUT' }),
      transformResponse: (response: ApiSuccessResponse<Discount>) => response.data,
      invalidatesTags: ['Discount'],
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useToggleDiscountMutation,
} = discountsApi;
