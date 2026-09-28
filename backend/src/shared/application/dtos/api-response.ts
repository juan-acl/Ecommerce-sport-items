export interface ApiMeta {
  timestamp: string;
  requestId: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    limit: number;
    count: number;
    nextCursor?: string;
  };
  meta: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[] | string>;
  };
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
