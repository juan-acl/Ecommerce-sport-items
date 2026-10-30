import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { PurchasesReportUseCase } from '../../../src/modules/reports/application/use-cases/purchases-report.use-case';
import { Purchase } from '../../../src/modules/purchases/domain/entities/purchase.entity';
import type { PurchaseStatus } from '../../../src/modules/purchases/domain/entities/purchase.entity';

function makePurchase(overrides: {
  id?: string;
  supplierId?: string;
  supplierName?: string;
  total?: number;
  status?: PurchaseStatus;
  createdAt?: string;
}): Purchase {
  return new Purchase({
    id: overrides.id ?? 'p1',
    supplierId: overrides.supplierId ?? 's1',
    supplierName: overrides.supplierName ?? 'Supplier A',
    items: [],
    total: overrides.total ?? 100,
    status: overrides.status ?? 'received',
    createdAt: overrides.createdAt ?? new Date().toISOString(),
  });
}

function buildMockRepo(purchases: Purchase[]) {
  return {
    list: async () => ({ items: purchases, count: purchases.length }),
    listAll: async () => ({ items: purchases, nextCursor: undefined, count: purchases.length }),
    findById: async () => null,
    save: async () => undefined,
    update: async () => undefined,
    listActive: async () => [],
  };
}

export function registerReportsPurchasesApiSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    const purchases = [
      makePurchase({ id: 'p1', supplierId: 's1', supplierName: 'SupA', total: 500, status: 'received' }),
      makePurchase({ id: 'p2', supplierId: 's2', supplierName: 'SupB', total: 300, status: 'pending' }),
      makePurchase({ id: 'p3', supplierId: 's1', supplierName: 'SupA', total: 200, status: 'partial' }),
      makePurchase({ id: 'p4', supplierId: 's3', supplierName: 'SupC', total: 100, status: 'cancelled' }),
    ];
    ctx.repo = buildMockRepo(purchases);
    ctx.useCase = new PurchasesReportUseCase(ctx.repo as never);
  });

  rt.step(/the client requests the purchases report with period "([^"]+)"/, async (m, ctx) => {
    const period = m[1] as 'day' | 'week' | 'month';
    const repo = buildMockRepo([
      makePurchase({ id: 'p1', supplierId: 's1', supplierName: 'SupA', total: 500, status: 'received' }),
      makePurchase({ id: 'p2', supplierId: 's2', supplierName: 'SupB', total: 300, status: 'pending' }),
      makePurchase({ id: 'p3', supplierId: 's1', supplierName: 'SupA', total: 200, status: 'partial' }),
      makePurchase({ id: 'p4', supplierId: 's3', supplierName: 'SupC', total: 100, status: 'cancelled' }),
    ]);
    const uc = new PurchasesReportUseCase(repo as never);
    ctx.response = await uc.execute({ period });
    ctx.period = period;
  });

  rt.step(/the response includes field "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    expect(ctx.response).toHaveProperty(field);
  });

  rt.step(/the "([^"]+)" object contains key "([^"]+)"/, (m, ctx) => {
    const objField = m[1];
    const key = m[2];
    const response = ctx.response as Record<string, unknown>;
    const obj = response[objField] as Record<string, unknown>;
    expect(obj).toHaveProperty(key);
  });

  rt.step(/each entry in "([^"]+)" contains field "([^"]+)"/, (m, ctx) => {
    const arrayField = m[1];
    const field = m[2];
    const response = ctx.response as Record<string, unknown>;
    const arr = response[arrayField] as Record<string, unknown>[];
    expect(arr.length).toBeGreaterThan(0);
    for (const entry of arr) {
      expect(entry).toHaveProperty(field);
    }
  });

  rt.step(/the "([^"]+)" list is ordered by "([^"]+)" descending/, (m, ctx) => {
    const arrayField = m[1];
    const sortKey = m[2];
    const response = ctx.response as Record<string, unknown>;
    const arr = response[arrayField] as Record<string, number>[];
    expect(arr.length).toBeGreaterThan(1);
    for (let i = 1; i < arr.length; i++) {
      expect(arr[i - 1][sortKey]).toBeGreaterThanOrEqual(arr[i][sortKey]);
    }
  });

  rt.step(/the response "([^"]+)" counts only purchases created within "([^"]+)"/, async (m, ctx) => {
    const field = m[1];
    const period = m[2] as 'day' | 'week' | 'month';
    const now = new Date();
    const inPeriod = makePurchase({ id: 'recent', total: 200, createdAt: now.toISOString() });
    const old = new Date(now);
    old.setFullYear(old.getFullYear() - 1);
    const outPeriod = makePurchase({ id: 'old', total: 100, createdAt: old.toISOString() });
    const repo = buildMockRepo([inPeriod, outPeriod]);
    const uc = new PurchasesReportUseCase(repo as never);
    const result = await uc.execute({ period });
    const value = (result as unknown as Record<string, unknown>)[field] as number;
    expect(value).toBe(1);
    void ctx;
  });
}
