import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';

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

function getPeriodStart(period: ReportPeriod): Date {
  const now = new Date();
  if (period === 'day') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (period === 'week') {
    const day = now.getDay();
    now.setDate(now.getDate() - day);
    now.setHours(0, 0, 0, 0);
    return now;
  }
  // month
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
}

export class SalesReportUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(input: { period: ReportPeriod }): Promise<SalesReportResult> {
    const periodStart = getPeriodStart(input.period);
    const allOrders: ReturnType<(typeof this.orderRepo)['listAll']> extends Promise<infer R>
      ? R
      : never = { items: [], count: 0 };

    // Fetch all orders in pages
    let cursor: string | undefined;
    const orders: ReturnType<(typeof allOrders)['items'][number]['toJSON']>[] = [];

    do {
      const page = await this.orderRepo.listAll({ limit: 100, cursor });
      for (const order of page.items) {
        if (new Date(order.createdAt) >= periodStart) {
          orders.push(order.toJSON());
        }
      }
      cursor = page.nextCursor;
      // Stop if oldest item in page is before period start
      if (page.items.length > 0) {
        const oldest = page.items[page.items.length - 1];
        if (new Date(oldest.createdAt) < periodStart) {
          break;
        }
      }
    } while (cursor);

    const totalOrders = orders.length;
    const totalRevenue = parseFloat(
      orders.reduce((sum, o) => sum + o.total, 0).toFixed(2),
    );
    const averageOrderValue =
      totalOrders > 0
        ? parseFloat((totalRevenue / totalOrders).toFixed(2))
        : 0;

    const ordersByStatus = {
      paid: orders.filter((o) => o.status === 'paid').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };

    const productMap = new Map<string, TopProduct>();
    for (const order of orders) {
      for (const item of order.items) {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalRevenue = parseFloat(
            (existing.totalRevenue + item.subtotal).toFixed(2),
          );
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
