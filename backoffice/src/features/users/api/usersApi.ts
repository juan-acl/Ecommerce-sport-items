import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { User } from '@shared/types/common';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  role?: string;
}

export interface UsersQueryParams {
  limit?: number;
  cursor?: string;
  role?: string;
}

type BackendUsersResponse = { users: User[]; nextCursor?: string };

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedData<User>, UsersQueryParams>({
      query: ({ limit = 20, cursor, role } = {}) => ({
        url: '/admin/users',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(role && { role }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendUsersResponse>) => ({
        items: response.data.users,
        nextCursor: response.data.nextCursor,
        count: response.data.users.length,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { cursor: _cursor, ...rest } = queryArgs ?? {};
        return `${endpointName}-${JSON.stringify(rest)}`;
      },
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
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
