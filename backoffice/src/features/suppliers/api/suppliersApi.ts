import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { Supplier } from '@shared/types/common';

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: string;
  isActive?: boolean;
}

type BackendSuppliersResponse = {
  items: Supplier[];
  count: number;
  nextCursor?: string;
};

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Suppliers'],
  endpoints: (builder) => ({
    getSuppliers: builder.query<PaginatedData<Supplier>, { limit?: number; cursor?: string }>({
      query: ({ limit = 20, cursor } = {}) => ({
        url: '/admin/suppliers',
        params: { limit, ...(cursor && { cursor }) },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendSuppliersResponse>) => ({
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
      providesTags: ['Suppliers'],
    }),

    createSupplier: builder.mutation<Supplier, CreateSupplierRequest>({
      query: (body) => ({ url: '/admin/suppliers', method: 'POST', body }),
      transformResponse: (response: ApiSuccessResponse<Supplier>) => response.data,
      invalidatesTags: ['Suppliers'],
    }),

    updateSupplier: builder.mutation<Supplier, UpdateSupplierRequest>({
      query: ({ id, ...body }) => ({ url: `/admin/suppliers/${id}`, method: 'PUT', body }),
      transformResponse: (response: ApiSuccessResponse<Supplier>) => response.data,
      invalidatesTags: ['Suppliers'],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/suppliers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Suppliers'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
