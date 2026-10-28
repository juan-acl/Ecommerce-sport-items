import type { AuditQueryParams } from './auditApiParams';

export interface AuditFilters {
  action?: string;
  entityType?: string;
  userEmail?: string;
  fromDate?: string;
  toDate?: string;
}

export function setFilter(filters: AuditFilters, key: keyof AuditFilters, value: string | undefined): AuditFilters {
  return { ...filters, [key]: value };
}

export function buildAuditQueryParams(
  filters: AuditFilters,
  pagination: { limit: number; cursor?: string },
): AuditQueryParams {
  const { limit, cursor } = pagination;
  const defined = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined),
  ) as Partial<AuditFilters>;
  return { limit, ...(cursor ? { cursor } : {}), ...defined };
}

export function hasActiveFilters(filters: AuditFilters): boolean {
  return Object.values(filters).some((v) => v !== undefined && v !== '');
}

export function clearAllFilters(): AuditFilters {
  return {};
}
