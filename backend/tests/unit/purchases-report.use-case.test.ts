import { PurchasesReportUseCase } from '@modules/reports/application/use-cases/purchases-report.use-case';
import { Purchase } from '@modules/purchases/domain/entities/purchase.entity';
import type { PurchaseStatus } from '@modules/purchases/domain/entities/purchase.entity';

function makeP(overrides: {
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

describe('PurchasesReportUseCase', () => {
  const mockRepo = {
    list: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    listActive: jest.fn(),
    listAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo.listAll.mockResolvedValue({ items: [], nextCursor: undefined, count: 0 });
  });

  it('result includes required top-level fields', async () => {
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result).toHaveProperty('totalPurchases');
    expect(result).toHaveProperty('totalCost');
    expect(result).toHaveProperty('averagePurchaseCost');
    expect(result).toHaveProperty('purchasesByStatus');
    expect(result).toHaveProperty('topSuppliers');
  });

  it('purchasesByStatus contains all required status keys', async () => {
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.purchasesByStatus).toHaveProperty('pending');
    expect(result.purchasesByStatus).toHaveProperty('partial');
    expect(result.purchasesByStatus).toHaveProperty('received');
    expect(result.purchasesByStatus).toHaveProperty('cancelled');
  });

  it('topSuppliers entries contain required fields', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [makeP({ supplierId: 's1', supplierName: 'SupA', total: 200 })],
      nextCursor: undefined,
      count: 1,
    });
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    const entry = result.topSuppliers[0];
    expect(entry).toHaveProperty('supplierId');
    expect(entry).toHaveProperty('supplierName');
    expect(entry).toHaveProperty('totalPurchases');
    expect(entry).toHaveProperty('totalSpent');
  });

  it('topSuppliers is ordered by totalSpent descending', async () => {
    const purchases = [
      makeP({ id: 'a', supplierId: 's1', supplierName: 'SupA', total: 100 }),
      makeP({ id: 'b', supplierId: 's2', supplierName: 'SupB', total: 300 }),
      makeP({ id: 'c', supplierId: 's1', supplierName: 'SupA', total: 50 }),
    ];
    mockRepo.listAll.mockResolvedValueOnce({ items: purchases, nextCursor: undefined, count: 3 });
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.topSuppliers[0].supplierId).toBe('s2');
    expect(result.topSuppliers[0].totalSpent).toBe(300);
    expect(result.topSuppliers[1].supplierId).toBe('s1');
    expect(result.topSuppliers[1].totalSpent).toBe(150);
  });

  it('aggregates totals and status counts correctly', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeP({ id: 'a', total: 200, status: 'received' }),
        makeP({ id: 'b', total: 100, status: 'pending' }),
      ],
      nextCursor: undefined,
      count: 2,
    });
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.totalPurchases).toBe(2);
    expect(result.totalCost).toBe(300);
    expect(result.averagePurchaseCost).toBe(150);
    expect(result.purchasesByStatus.received).toBe(1);
    expect(result.purchasesByStatus.pending).toBe(1);
    expect(result.purchasesByStatus.partial).toBe(0);
    expect(result.purchasesByStatus.cancelled).toBe(0);
  });

  it('scopes results to the period start date', async () => {
    const now = new Date();
    const oldDate = new Date(now);
    oldDate.setMonth(oldDate.getMonth() - 2);
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeP({ id: 'recent', createdAt: now.toISOString() }),
        makeP({ id: 'old', createdAt: oldDate.toISOString() }),
      ],
      nextCursor: undefined,
      count: 2,
    });
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.totalPurchases).toBe(1);
  });

  it('averagePurchaseCost is 0 when no purchases exist', async () => {
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.averagePurchaseCost).toBe(0);
    expect(result.totalPurchases).toBe(0);
  });

  it('explicit from/to range overrides period for scoping', async () => {
    mockRepo.listAll.mockResolvedValueOnce({
      items: [
        makeP({ id: 'a', createdAt: '2026-01-15T00:00:00.000Z' }),
        makeP({ id: 'b', createdAt: '2026-04-01T00:00:00.000Z' }),
      ],
      nextCursor: undefined,
      count: 2,
    });
    const uc = new PurchasesReportUseCase(mockRepo as never);
    const result = await uc.execute({ period: 'day', from: '2026-01-01', to: '2026-03-31' });
    expect(result.totalPurchases).toBe(1);
  });
});
