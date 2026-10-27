import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { InMemoryAuditLogRepository } from '../helpers/in-memory-audit-log.repository';
import { AuditLogEntity } from '../../../src/modules/audit/domain/entities/audit-log.entity';
import { ListAuditLogsUseCase } from '../../../src/modules/audit/application/use-cases/list-audit-logs.use-case';

const BACKGROUND_LOGS: AuditLogEntity[] = [
  new AuditLogEntity({ id: 'l1', userId: 'user-1', userEmail: 'admin@example.com',    action: 'ORDER_APPROVED',       entityType: 'order',   entityId: 'ord-1', details: {}, createdAt: '2026-10-01T10:00:00Z' }),
  new AuditLogEntity({ id: 'l2', userId: 'user-1', userEmail: 'admin@example.com',    action: 'ORDER_REJECTED',       entityType: 'order',   entityId: 'ord-2', details: {}, createdAt: '2026-10-01T11:00:00Z' }),
  new AuditLogEntity({ id: 'l3', userId: 'user-2', userEmail: 'operator@example.com', action: 'ORDER_STATUS_CHANGED', entityType: 'order',   entityId: 'ord-3', details: {}, createdAt: '2026-10-02T09:00:00Z' }),
  new AuditLogEntity({ id: 'l4', userId: 'user-2', userEmail: 'operator@example.com', action: 'PRODUCT_UPDATED',      entityType: 'product', entityId: 'prd-1', details: {}, createdAt: '2026-10-02T15:00:00Z' }),
  new AuditLogEntity({ id: 'l5', userId: 'user-3', userEmail: 'operator@example.com', action: 'ORDER_STATUS_CHANGED', entityType: 'order',   entityId: 'ord-4', details: {}, createdAt: '2026-10-03T08:00:00Z' }),
];

export function registerAuditSteps(rt: AcceptanceRuntime): void {
  rt.step(/the user is authenticated as an admin with permission "audit:view"/, (_m, ctx) => {
    ctx.repo = new InMemoryAuditLogRepository();
    ctx.useCase = new ListAuditLogsUseCase(ctx.repo as InMemoryAuditLogRepository);
  });

  rt.step(/the following audit logs exist:/, (_m, ctx) => {
    (ctx.repo as InMemoryAuditLogRepository).seed(BACKGROUND_LOGS);
  });

  rt.step(/there are "(\d+)" audit logs with action "([^"]+)"/, (m, ctx) => {
    const total = parseInt(m[1], 10);
    ctx.totalLogs = total;
    const action = m[2];
    const extra: AuditLogEntity[] = Array.from({ length: total }, (_, i) =>
      new AuditLogEntity({
        id: `extra-${i}`,
        userId: 'user-x',
        userEmail: 'x@example.com',
        action,
        entityType: 'order',
        entityId: `ord-x-${i}`,
        details: {},
        createdAt: `2026-10-10T${String(i).padStart(2, '0')}:00:00Z`,
      }),
    );
    (ctx.repo as InMemoryAuditLogRepository).seed(extra);
  });

  rt.step(/the admin requests audit logs with filter action "([^"]+)" and limit "(\d+)"/, async (m, ctx) => {
    const action = m[1];
    const limit = parseInt(m[2], 10);
    ctx.requestedLimit = limit;
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered({ action }, { limit });
  });

  rt.step(/the admin requests audit logs with filter action "([^"]+)" from "([^"]+)" to "([^"]+)"/, async (m, ctx) => {
    assertIsoDatetime(m[2]);
    assertIsoDatetime(m[3]);
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered(
      { action: m[1], fromDate: m[2], toDate: m[3] },
      { limit: 20 },
    );
  });

  rt.step(/the admin requests audit logs with filter action "([^"]+)"/, async (m, ctx) => {
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered({ action: m[1] }, { limit: 20 });
  });

  rt.step(/the admin requests audit logs with filter userId "([^"]+)"/, async (m, ctx) => {
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered({ userId: m[1] }, { limit: 20 });
  });

  rt.step(/the admin requests audit logs from "([^"]+)" to "([^"]+)"/, async (m, ctx) => {
    assertIsoDatetime(m[1]);
    assertIsoDatetime(m[2]);
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered(
      { fromDate: m[1], toDate: m[2] },
      { limit: 20 },
    );
  });

  rt.step(/the admin requests audit logs with filter entityType "([^"]+)"/, async (m, ctx) => {
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered({ entityType: m[1] }, { limit: 20 });
  });

  rt.step(/the admin requests audit logs with filter userEmail "([^"]+)"/, async (m, ctx) => {
    ctx.result = await (ctx.useCase as ListAuditLogsUseCase).executeFiltered({ userEmail: m[1] }, { limit: 20 });
  });

  rt.step(/the response contains only logs with action "([^"]+)"/, (m, ctx) => {
    const action = m[1];
    const result = ctx.result as { items: { action: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => expect(item.action).toBe(action));
  });

  rt.step(/the response contains only logs with userId "([^"]+)"/, (m, ctx) => {
    const userId = m[1];
    const result = ctx.result as { items: { userId: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => expect(item.userId).toBe(userId));
  });

  rt.step(/the response contains only logs created between "([^"]+)" and "([^"]+)"/, (m, ctx) => {
    const from = m[1];
    const to = m[2];
    const result = ctx.result as { items: { createdAt: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.createdAt >= from).toBe(true);
      expect(item.createdAt <= to).toBe(true);
    });
  });

  rt.step(/the response contains only logs with action "([^"]+)" created between "([^"]+)" and "([^"]+)"/, (m, ctx) => {
    const action = m[1];
    const from = m[2];
    const to = m[3];
    const result = ctx.result as { items: { action: string; createdAt: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.action).toBe(action);
      expect(item.createdAt >= from).toBe(true);
      expect(item.createdAt <= to).toBe(true);
    });
  });

  rt.step(/the response contains an empty list of audit logs/, (_m, ctx) => {
    const result = ctx.result as { items: unknown[] };
    expect(result.items).toHaveLength(0);
  });

  rt.step(/the response contains only logs with entityType "([^"]+)"/, (m, ctx) => {
    const entityType = m[1];
    const result = ctx.result as { items: { entityType: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => expect(item.entityType).toBe(entityType));
  });

  rt.step(/the response contains only logs with userEmail "([^"]+)"/, (m, ctx) => {
    const userEmail = m[1];
    const result = ctx.result as { items: { userEmail: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => expect(item.userEmail).toBe(userEmail));
  });

  rt.step(/the response contains at most "(\d+)" logs/, (m, ctx) => {
    const limit = parseInt(m[1], 10);
    const result = ctx.result as { items: unknown[] };
    expect(result.items.length).toBeLessThanOrEqual(limit);
  });

  rt.step(/the response includes a cursor when more results exist/, (_m, ctx) => {
    const result = ctx.result as { items: unknown[]; nextCursor?: string };
    const total = ctx.totalLogs as number | undefined;
    const limit = ctx.requestedLimit as number | undefined;
    if (total !== undefined && limit !== undefined && total > limit) {
      expect(result.nextCursor).toBeDefined();
    } else {
      expect(result.nextCursor).toBeUndefined();
    }
  });
}

const ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function assertIsoDatetime(value: string): void {
  if (!ISO_DATETIME_RE.test(value)) {
    throw new Error(`Invalid ISO-8601 datetime: ${value}`);
  }
}
