import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@shared/api/baseQuery";
import type { ApiSuccessResponse } from "@shared/types/api";
import type { RoleEntity, ModulePermission } from "@shared/types/common";

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: ModulePermission[];
  isSystem?: boolean;
}

export interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  permissions?: ModulePermission[];
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getRoles: builder.query<RoleEntity[], void>({
      query: () => "/admin/roles",
      transformResponse: (response: ApiSuccessResponse<RoleEntity[]>) => response.data,
      providesTags: ["Roles"],
    }),

    createRole: builder.mutation<RoleEntity, CreateRoleRequest>({
      query: (body) => ({
        url: "/admin/roles",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<RoleEntity>) => response.data,
      invalidatesTags: ["Roles"],
    }),

    updateRole: builder.mutation<RoleEntity, UpdateRoleRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<RoleEntity>) => response.data,
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = rolesApi;
