import { AcceptanceRuntime } from '../runtime/acceptance-runtime';

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

function buildAuditParams(params: AuditQueryParams): Record<string, string | number> {
  const { limit = 20, ...rest } = params;
  const defined = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined),
  ) as Record<string, string>;
  return { limit, ...defined };
}

export function registerAuditApiParamsSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    ctx.params = {};
  });

  rt.step(/the client requests audit logs with filter "([^"]+)" set to "([^"]+)"/, (m, ctx) => {
    const field = m[1] as keyof AuditQueryParams;
    const value = m[2];
    ctx.builtParams = buildAuditParams({ [field]: value });
  });

  rt.step(/the client requests audit logs with no filters/, (_m, ctx) => {
    ctx.builtParams = buildAuditParams({});
  });

  rt.step(/the HTTP request includes query parameter "([^"]+)" equal to "([^"]+)"/, (m, ctx) => {
    const param = m[1];
    const value = m[2];
    const built = ctx.builtParams as Record<string, string | number>;
    expect(built[param]).toBe(value);
  });

  rt.step(/the HTTP request does not include parameters action, userId, userEmail, entityType, fromDate, toDate/, (_m, ctx) => {
    const built = ctx.builtParams as Record<string, string | number>;
    expect(built).not.toHaveProperty('action');
    expect(built).not.toHaveProperty('userId');
    expect(built).not.toHaveProperty('userEmail');
    expect(built).not.toHaveProperty('entityType');
    expect(built).not.toHaveProperty('fromDate');
    expect(built).not.toHaveProperty('toDate');
  });

  rt.step(/the HTTP request does not include the cursor parameter/, (_m, ctx) => {
    const built = ctx.builtParams as Record<string, string | number>;
    expect(built).not.toHaveProperty('cursor');
  });
}
