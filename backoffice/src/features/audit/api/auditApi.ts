import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse, PaginatedData } from '@shared/types/api';
import type { AuditLog } from '@shared/types/common';
import { buildAuditParams, type AuditQueryParams } from '../utils/auditApiParams';

export type { AuditQueryParams } from '../utils/auditApiParams';

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
      query: (args = {}) => ({
        url: '/admin/audit',
        params: buildAuditParams(args),
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
