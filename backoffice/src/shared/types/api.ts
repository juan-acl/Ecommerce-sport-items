export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  count: number;
  nextCursor?: string;
}
