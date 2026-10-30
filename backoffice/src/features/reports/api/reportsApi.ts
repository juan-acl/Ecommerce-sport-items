import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';
import type { SalesReport, InventoryReport, PurchasesReport, ClientAnalyticsReport } from '@shared/types/common';

export type ReportPeriod = 'day' | 'week' | 'month';

export interface ReportQueryParams {
  period?: ReportPeriod;
  from?: string;
  to?: string;
}

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getSalesReport: builder.query<SalesReport, ReportQueryParams>({
      query: ({ period = 'month', from, to } = {}) => ({
        url: '/admin/reports/sales',
        params: { period, ...(from ? { from } : {}), ...(to ? { to } : {}) },
      }),
      transformResponse: (response: ApiSuccessResponse<SalesReport>) => response.data,
      providesTags: ['Reports'],
    }),

    getInventoryReport: builder.query<InventoryReport, void>({
      query: () => ({ url: '/admin/reports/inventory' }),
      transformResponse: (response: ApiSuccessResponse<InventoryReport>) => response.data,
      providesTags: ['Reports'],
    }),

    getPurchasesReport: builder.query<PurchasesReport, ReportQueryParams>({
      query: ({ period = 'month', from, to } = {}) => ({
        url: '/admin/reports/purchases',
        params: { period, ...(from ? { from } : {}), ...(to ? { to } : {}) },
      }),
      transformResponse: (response: ApiSuccessResponse<PurchasesReport>) => response.data,
      providesTags: ['Reports'],
    }),

    getClientAnalyticsReport: builder.query<ClientAnalyticsReport, ReportQueryParams>({
      query: ({ period = 'month', from, to } = {}) => ({
        url: '/admin/reports/clients',
        params: { period, ...(from ? { from } : {}), ...(to ? { to } : {}) },
      }),
      transformResponse: (response: ApiSuccessResponse<ClientAnalyticsReport>) => response.data,
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetPurchasesReportQuery,
  useGetClientAnalyticsReportQuery,
} = reportsApi;
