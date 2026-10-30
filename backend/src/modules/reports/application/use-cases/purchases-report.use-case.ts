import type { PurchaseRepository } from '@modules/purchases/domain/repositories/purchase.repository';
import type { Purchase } from '@modules/purchases/domain/entities/purchase.entity';

export type ReportPeriod = 'day' | 'week' | 'month';

export interface TopSupplier {
  supplierId: string;
  supplierName: string;
  totalPurchases: number;
  totalSpent: number;
}

export interface PurchasesReportResult {
  totalPurchases: number;
  totalCost: number;
  averagePurchaseCost: number;
  purchasesByStatus: {
    pending: number;
    partial: number;
    received: number;
    cancelled: number;
  };
  topSuppliers: TopSupplier[];
}

function getDateRange(input: {
  period?: ReportPeriod;
  from?: string;
  to?: string;
}): { start: Date; end: Date } {
  if (input.from && input.to) {
    return {
      start: new Date(input.from + 'T00:00:00.000Z'),
      end: new Date(input.to + 'T23:59:59.999Z'),
    };
  }
  const now = new Date();
  const start = new Date(now);
  const period = input.period ?? 'month';
  if (period === 'day') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}

export class PurchasesReportUseCase {
  constructor(private readonly purchaseRepo: PurchaseRepository) {}

  async execute(input: {
    period: ReportPeriod;
    from?: string;
    to?: string;
  }): Promise<PurchasesReportResult> {
    const { start, end } = getDateRange(input);

    const inRange: Purchase[] = [];
    let cursor: string | undefined;
    do {
      const page = await this.purchaseRepo.listAll({ limit: 100, cursor });
      for (const purchase of page.items) {
        const createdAt = new Date(purchase.createdAt);
        if (createdAt >= start && createdAt <= end) {
          inRange.push(purchase);
        }
      }
      cursor = page.nextCursor;
      if (page.items.length > 0) {
        const oldest = page.items[page.items.length - 1];
        if (new Date(oldest.createdAt) < start) break;
      }
    } while (cursor);

    const totalPurchases = inRange.length;
    const totalCost = parseFloat(inRange.reduce((sum, p) => sum + p.total, 0).toFixed(2));
    const averagePurchaseCost =
      totalPurchases > 0 ? parseFloat((totalCost / totalPurchases).toFixed(2)) : 0;

    const purchasesByStatus = {
      pending: inRange.filter((p) => p.status === 'pending').length,
      partial: inRange.filter((p) => p.status === 'partial').length,
      received: inRange.filter((p) => p.status === 'received').length,
      cancelled: inRange.filter((p) => p.status === 'cancelled').length,
    };

    const supplierMap = new Map<string, TopSupplier>();
    for (const p of inRange) {
      const existing = supplierMap.get(p.supplierId);
      if (existing) {
        existing.totalPurchases += 1;
        existing.totalSpent = parseFloat((existing.totalSpent + p.total).toFixed(2));
      } else {
        supplierMap.set(p.supplierId, {
          supplierId: p.supplierId,
          supplierName: p.supplierName,
          totalPurchases: 1,
          totalSpent: parseFloat(p.total.toFixed(2)),
        });
      }
    }

    const topSuppliers = Array.from(supplierMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return { totalPurchases, totalCost, averagePurchaseCost, purchasesByStatus, topSuppliers };
  }
}
