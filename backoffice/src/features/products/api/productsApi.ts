import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { Product } from '@shared/types/common';

export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  imageUrl: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export interface ProductsQueryParams {
  limit?: number;
  cursor?: string;
  category?: string;
}

type BackendProductsResponse = {
  products: Product[];
  pagination: { limit: number; count: number; nextCursor?: string };
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedData<Product>, ProductsQueryParams>({
      query: ({ limit = 10, cursor, category } = {}) => ({
        url: '/admin/products',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(category && { category }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendProductsResponse>) => ({
        items: response.data.products,
        nextCursor: response.data.pagination.nextCursor,
        count: response.data.pagination.count,
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
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.cursor !== previousArg?.cursor,
      providesTags: ['Products'],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Product>) => response.data,
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Product>) => response.data,
      invalidatesTags: ['Products'],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    getUploadUrl: builder.mutation<UploadUrlResponse, UploadUrlRequest>({
      query: (body) => ({
        url: '/admin/products/upload-url',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<UploadUrlResponse>) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUploadUrlMutation,
} = productsApi;
