import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { Order } from '@modules/orders/domain/entities/order.entity';

export type ReportPeriod = 'day' | 'week' | 'month';

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface SalesReportResult {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  topProducts: TopProduct[];
}

function getDateRange(input: {
  period: ReportPeriod;
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
  if (input.period === 'day') {
    start.setHours(0, 0, 0, 0);
  } else if (input.period === 'week') {
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}

export class SalesReportUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(input: {
    period: ReportPeriod;
    from?: string;
    to?: string;
  }): Promise<SalesReportResult> {
    const { start, end } = getDateRange(input);

    const inRange: Order[] = [];
    let cursor: string | undefined;
    do {
      const page = await this.orderRepo.listAll({ limit: 100, cursor });
      for (const order of page.items) {
        const createdAt = new Date(order.createdAt);
        if (createdAt >= start && createdAt <= end) {
          inRange.push(order);
        }
      }
      cursor = page.nextCursor;
      if (page.items.length > 0) {
        const oldest = page.items[page.items.length - 1];
        if (new Date(oldest.createdAt) < start) break;
      }
    } while (cursor);

    const totalOrders = inRange.length;
    const totalRevenue = parseFloat(inRange.reduce((sum, o) => sum + o.total, 0).toFixed(2));
    const averageOrderValue =
      totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0;

    const ordersByStatus = {
      paid: inRange.filter((o) => o.status === 'paid').length,
      processing: inRange.filter((o) => o.status === 'processing').length,
      shipped: inRange.filter((o) => o.status === 'shipped').length,
      delivered: inRange.filter((o) => o.status === 'delivered').length,
      cancelled: inRange.filter((o) => o.status === 'cancelled').length,
    };

    const productMap = new Map<string, TopProduct>();
    for (const order of inRange) {
      for (const item of order.items) {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalRevenue = parseFloat((existing.totalRevenue + item.subtotal).toFixed(2));
        } else {
          productMap.set(item.productId, {
            productId: item.productId,
            productName: item.productName,
            totalQuantity: item.quantity,
            totalRevenue: parseFloat(item.subtotal.toFixed(2)),
          });
        }
      }
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return { totalOrders, totalRevenue, averageOrderValue, ordersByStatus, topProducts };
  }
}
