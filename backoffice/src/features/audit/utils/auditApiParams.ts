export interface AuditQueryParams {
  limit?: number;
  cursor?: string;
  userId?: string;
  entityType?: string;
  action?: string;
  userEmail?: string;
  fromDate?: string;
  toDate?: string;
}

export function buildAuditParams(params: AuditQueryParams): Record<string, string | number> {
  const { limit = 20, ...rest } = params;
  const defined = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined),
  ) as Record<string, string>;
  return { limit, ...defined };
}
