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
  const { limit = 20, cursor, userId, entityType, action, userEmail, fromDate, toDate } = params;
  return {
    limit,
    ...(cursor ? { cursor } : {}),
    ...(userId ? { userId } : {}),
    ...(entityType ? { entityType } : {}),
    ...(action ? { action } : {}),
    ...(userEmail ? { userEmail } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  };
}
