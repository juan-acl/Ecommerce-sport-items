export interface PaginationParams {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  count: number;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
