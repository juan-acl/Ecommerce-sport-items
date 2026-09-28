import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@shared/types/api';
import type { Product } from '@shared/types/common';

export interface ListProductsQuery {
  limit?: number;
  cursor?: string;
  category?: string;
}

export interface ListProductsResponse {
  products: Product[];
  pagination: {
    limit: number;
    count: number;
    nextCursor?: string;
  };
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    listProducts: builder.query<ListProductsResponse, ListProductsQuery>({
      query: ({ limit = 12, cursor, category }) => ({
        url: '/products',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(category && { category }),
        },
      }),
      transformResponse: (response: ApiPaginatedResponse<Product>) => ({
        products: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiSuccessResponse<Product>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useListProductsQuery, useGetProductQuery, useLazyListProductsQuery } = productsApi;
