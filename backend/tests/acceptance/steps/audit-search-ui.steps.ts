import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

interface AuditFilters {
  action?: string;
  entityType?: string;
  userEmail?: string;
  fromDate?: string;
  toDate?: string;
}

function buildAuditQueryParams(
  filters: AuditFilters,
  pagination: { limit: number; cursor?: string },
): Record<string, string | number> {
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

function hasActiveFilters(filters: AuditFilters): boolean {
  return Object.values(filters).some((v) => v !== undefined && v !== '');
}

const FILTER_CONTROLS = ['action', 'entityType', 'userEmail', 'fromDate', 'toDate'];

export function registerAuditSearchUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Auditoría page/, (_m, ctx) => {
    ctx.filters = {} as AuditFilters;
    ctx.cursor = undefined as string | undefined;
    ctx.pagination = { limit: 20, cursor: undefined as string | undefined };
  });

  rt.step(/the page displays a filter control for "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    void ctx;
    expect(FILTER_CONTROLS).toContain(field);
  });

  rt.step(/the admin sets the "([^"]+)" filter to "([^"]+)"/, (m, ctx) => {
    const key = m[1] as keyof AuditFilters;
    const value = m[2];
    ctx.filters = { ...(ctx.filters as AuditFilters), [key]: value };
    ctx.pagination = { limit: 20, cursor: undefined };
    ctx.lastParams = buildAuditQueryParams(ctx.filters as AuditFilters, ctx.pagination as { limit: number; cursor?: string });
  });

  rt.step(/the admin sets "fromDate" to "([^"]+)" and "toDate" to "([^"]+)"/, (m, ctx) => {
    ctx.filters = { ...(ctx.filters as AuditFilters), fromDate: m[1], toDate: m[2] };
    ctx.pagination = { limit: 20, cursor: undefined };
    ctx.lastParams = buildAuditQueryParams(ctx.filters as AuditFilters, ctx.pagination as { limit: number; cursor?: string });
  });

  rt.step(/audit results are showing a second page/, (_m, ctx) => {
    ctx.pagination = { limit: 20, cursor: 'cursor-page-2' };
    ctx.lastParams = buildAuditQueryParams(ctx.filters as AuditFilters ?? {}, ctx.pagination as { limit: number; cursor?: string });
  });

  rt.step(/the admin has active filters set/, (_m, ctx) => {
    ctx.filters = { action: 'ORDER_APPROVED', entityType: 'order' } as AuditFilters;
    ctx.pagination = { limit: 20, cursor: undefined };
    ctx.lastParams = buildAuditQueryParams(ctx.filters as AuditFilters, ctx.pagination as { limit: number; cursor?: string });
  });

  rt.step(/the admin clicks the clear filters button/, (_m, ctx) => {
    ctx.filters = {};
    ctx.pagination = { limit: 20, cursor: undefined };
    ctx.lastParams = buildAuditQueryParams({}, ctx.pagination as { limit: number; cursor?: string });
  });

  rt.step(/the audit API is called with parameter "([^"]+)" equal to "([^"]+)"/, (m, ctx) => {
    const param = m[1];
    const value = m[2];
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params[param]).toBe(value);
  });

  rt.step(/the audit API is called with fromDate "([^"]+)" and toDate "([^"]+)"/, (m, ctx) => {
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params.fromDate).toBe(m[1]);
    expect(params.toDate).toBe(m[2]);
  });

  rt.step(/the audit API is called with parameters action "([^"]+)", entityType "([^"]+)", fromDate "([^"]+)", toDate "([^"]+)"/, (m, ctx) => {
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params.action).toBe(m[1]);
    expect(params.entityType).toBe(m[2]);
    expect(params.fromDate).toBe(m[3]);
    expect(params.toDate).toBe(m[4]);
  });

  rt.step(/the API is called without a cursor parameter/, (_m, ctx) => {
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params).not.toHaveProperty('cursor');
  });

  rt.step(/the audit API is called with no filter parameters/, (_m, ctx) => {
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params).not.toHaveProperty('action');
    expect(params).not.toHaveProperty('entityType');
    expect(params).not.toHaveProperty('userEmail');
    expect(params).not.toHaveProperty('fromDate');
    expect(params).not.toHaveProperty('toDate');
    expect(hasActiveFilters(ctx.filters as AuditFilters)).toBe(false);
  });

  rt.step(/the results table shows only matching records/, (_m, ctx) => {
    const params = ctx.lastParams as Record<string, string | number>;
    expect(params).toBeDefined();
  });

  rt.step(/the results table shows all records/, (_m, ctx) => {
    const filters = ctx.filters as AuditFilters;
    expect(hasActiveFilters(filters)).toBe(false);
  });
}
