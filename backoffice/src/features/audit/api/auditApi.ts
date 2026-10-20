import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { AuditLog } from '@shared/types/common';

export interface AuditQueryParams {
  limit?: number;
  cursor?: string;
  userId?: string;
  entityType?: string;
  action?: string;
}

type BackendAuditResponse = {
  items: AuditLog[];
  count: number;
  nextCursor?: string;
};

export const auditApi = createApi({
  reducerPath: 'auditApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['AuditLog'],
  endpoints: (builder) => ({
    getAuditLogs: builder.query<PaginatedData<AuditLog>, AuditQueryParams>({
      query: ({ limit = 20, cursor, userId, entityType, action } = {}) => ({
        url: '/admin/audit',
        params: {
          limit,
          ...(cursor && { cursor }),
          ...(userId && { userId }),
          ...(entityType && { entityType }),
          ...(action && { action }),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<BackendAuditResponse>) => ({
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
      providesTags: ['AuditLog'],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
