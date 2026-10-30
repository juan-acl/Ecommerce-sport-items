import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';
import type { SalesReport, InventoryReport, PurchasesReport, ClientAnalyticsReport, ProductsReport, StockStatus } from '@shared/types/common';

export type ReportPeriod = 'day' | 'week' | 'month';

export interface ReportQueryParams {
  period?: ReportPeriod;
  from?: string;
  to?: string;
}

export interface ProductsReportQueryParams {
  category?: string;
  name?: string;
  stockStatus?: StockStatus;
  page?: number;
  pageSize?: number;
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

    getProductsReport: builder.query<ProductsReport, ProductsReportQueryParams>({
      query: ({ category, name, stockStatus, page = 1, pageSize = 20 } = {}) => ({
        url: '/admin/reports/products',
        params: {
          ...(category ? { category } : {}),
          ...(name ? { name } : {}),
          ...(stockStatus ? { stockStatus } : {}),
          page,
          pageSize,
        },
      }),
      transformResponse: (response: ApiSuccessResponse<ProductsReport>) => response.data,
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetPurchasesReportQuery,
  useGetClientAnalyticsReportQuery,
  useGetProductsReportQuery,
} = reportsApi;
