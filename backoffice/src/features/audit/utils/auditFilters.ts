import type { AuditQueryParams } from './auditApiParams';

export interface AuditFilters {
  action?: string;
  entityType?: string;
  userEmail?: string;
  fromDate?: string;
  toDate?: string;
}

export function setFilter(filters: AuditFilters, key: keyof AuditFilters, value: string): AuditFilters {
  return { ...filters, [key]: value };
}

export function buildAuditQueryParams(
  filters: AuditFilters,
  pagination: { limit: number; cursor?: string },
): AuditQueryParams {
  const { limit, cursor } = pagination;
  const { action, entityType, userEmail, fromDate, toDate } = filters;
  return {
    limit,
    ...(cursor ? { cursor } : {}),
    ...(action ? { action } : {}),
    ...(entityType ? { entityType } : {}),
    ...(userEmail ? { userEmail } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  };
}

export function hasActiveFilters(filters: AuditFilters): boolean {
  return Object.values(filters).some((v) => v !== undefined && v !== '');
}

export function clearAllFilters(): AuditFilters {
  return {};
}
