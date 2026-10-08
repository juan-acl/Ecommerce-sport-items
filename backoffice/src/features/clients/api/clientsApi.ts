import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { User } from '@shared/types/common';

export interface CreateClientRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateClientRequest {
  id: string;
  name?: string;
  email?: string;
}

export interface ClientsQueryParams {
  limit?: number;
  cursor?: string;
}

type BackendUsersResponse = { users: User[]; nextCursor?: string };

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Clients'],
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedData<User>, ClientsQueryParams>({
      query: ({ limit = 20, cursor } = {}) => ({
        url: '/admin/users',
        params: {
          limit,
          role: 'client',
          ...(cursor && { cursor }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendUsersResponse>) => ({
        items: response.data.users,
        nextCursor: response.data.nextCursor,
        count: response.data.users.length,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (cache, incoming, { arg }) => {
        if (!arg.cursor) {
          cache.items = incoming.items;
          cache.count = incoming.items.length;
        } else {
          cache.items.push(...incoming.items);
          cache.count = cache.items.length;
        }
        cache.nextCursor = incoming.nextCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.cursor !== previousArg?.cursor,
      providesTags: ['Clients'],
    }),

    createClient: builder.mutation<User, CreateClientRequest>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body: { ...body, role: 'client' },
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: ['Clients'],
    }),

    updateClient: builder.mutation<User, UpdateClientRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: ['Clients'],
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
