import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@shared/api/baseQuery';
import type { ApiSuccessResponse } from '@shared/types/api';

export interface ValidateDiscountRequest {
  code: string;
  orderTotal: number;
  cartCategories?: string[];
}

export interface ValidateDiscountResponse {
  discountId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  finalTotal: number;
}

export const discountsApi = createApi({
  reducerPath: 'discountsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Discount'],
  endpoints: (builder) => ({
    validateDiscount: builder.mutation<ValidateDiscountResponse, ValidateDiscountRequest>({
      query: (body) => ({
        url: '/discounts/validate',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<ValidateDiscountResponse>) => response.data,
    }),
  }),
});

export const { useValidateDiscountMutation } = discountsApi;
