import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';
import type { SalesReport, InventoryReport } from '@shared/types/common';

export type ReportPeriod = 'day' | 'week' | 'month';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getSalesReport: builder.query<SalesReport, { period?: ReportPeriod }>({
      query: ({ period = 'month' } = {}) => ({
        url: '/admin/reports/sales',
        params: { period },
      }),
      transformResponse: (response: ApiSuccessResponse<SalesReport>) => response.data,
      providesTags: ['Reports'],
    }),

    getInventoryReport: builder.query<InventoryReport, void>({
      query: () => ({ url: '/admin/reports/inventory' }),
      transformResponse: (response: ApiSuccessResponse<InventoryReport>) => response.data,
      providesTags: ['Reports'],
    }),
  }),
});

export const { useGetSalesReportQuery, useGetInventoryReportQuery } = reportsApi;
