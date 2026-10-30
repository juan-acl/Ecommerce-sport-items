import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { SalesReportUseCase } from '../../../src/modules/reports/application/use-cases/sales-report.use-case';
import { PurchasesReportUseCase } from '../../../src/modules/reports/application/use-cases/purchases-report.use-case';
import { ClientAnalyticsReportUseCase } from '../../../src/modules/reports/application/use-cases/client-analytics-report.use-case';
import { Order } from '../../../src/modules/orders/domain/entities/order.entity';
import { OrderItem } from '../../../src/modules/orders/domain/entities/order-item.entity';
import { DEFAULT_SHIPPING_ADDRESS } from '../../../src/modules/orders/domain/value-objects/shipping-address.vo';
import { ORDER_STATUS } from '../../../src/modules/orders/domain/value-objects/order-status.vo';
import { Purchase } from '../../../src/modules/purchases/domain/entities/purchase.entity';
import { User } from '../../../src/modules/users/domain/entities/user.entity';

function makeOrder(id: string, createdAt: string): Order {
  return new Order({
    id,
    userId: 'u1',
    items: [new OrderItem({ productId: 'p1', productName: 'P', unitPrice: 100, quantity: 1, imageUrl: '' })],
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: DEFAULT_SHIPPING_ADDRESS,
    createdAt,
  });
}

function makePurchase(id: string, createdAt: string): Purchase {
  return new Purchase({
    id,
    supplierId: 's1',
    supplierName: 'Supplier',
    items: [],
    total: 100,
    status: 'received',
    createdAt,
  });
}

function makeUser(id: string, createdAt: string): User {
  return new User({ id, email: `${id}@x.com`, name: id, passwordHash: 'h', role: 'customer', createdAt });
}

function buildOrderRepo(orders: Order[]) {
  return {
    listAll: async () => ({ items: orders, nextCursor: undefined, count: orders.length }),
    listByUserId: async () => ({ items: [], count: 0 }),
    findById: async () => null,
    findByIdForUser: async () => null,
    executeCheckout: async () => undefined,
    updateStatus: async () => undefined,
  };
}

function buildPurchaseRepo(purchases: Purchase[]) {
  return {
    list: async () => ({ items: purchases, count: purchases.length }),
    listAll: async () => ({ items: purchases, nextCursor: undefined, count: purchases.length }),
    findById: async () => null,
    save: async () => undefined,
    update: async () => undefined,
    listActive: async () => [],
  };
}

function buildUserRepo(users: User[]) {
  return {
    listAll: async () => ({ users, nextCursor: undefined }),
    findByEmail: async () => null,
    findById: async () => null,
    save: async () => undefined,
    update: async () => undefined,
    delete: async () => undefined,
  };
}

export function registerReportsDateRangeApiSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    void ctx;
  });

  rt.step(/the client requests the sales report with from "([^"]+)" and to "([^"]+)"/, async (m, ctx) => {
    const from = m[1];
    const to = m[2];
    const inRange = makeOrder('in', `${from.substring(0, 7)}-15T12:00:00.000Z`);
    const outRange = makeOrder('out', '2025-01-01T00:00:00.000Z');
    const uc = new SalesReportUseCase(buildOrderRepo([inRange, outRange]) as never);
    ctx.response = await uc.execute({ period: 'month', from, to });
    ctx.from = from;
    ctx.to = to;
  });

  rt.step(/the client requests the sales report with period "([^"]+)" and from "([^"]+)" and to "([^"]+)"/, async (m, ctx) => {
    const period = m[1] as 'day' | 'week' | 'month';
    const from = m[2];
    const to = m[3];
    const inRange = makeOrder('in', `${from.substring(0, 7)}-15T12:00:00.000Z`);
    const uc = new SalesReportUseCase(buildOrderRepo([inRange]) as never);
    ctx.response = await uc.execute({ period, from, to });
    ctx.from = from;
    ctx.to = to;
  });

  rt.step(/the response "totalOrders" counts only orders created from "([^"]+)" to "([^"]+)"/, (_m, ctx) => {
    const response = ctx.response as { totalOrders: number };
    expect(response.totalOrders).toBe(1);
  });

  rt.step(/the client requests the purchases report with from "([^"]+)" and to "([^"]+)"/, async (m, ctx) => {
    const from = m[1];
    const to = m[2];
    const inRange = makePurchase('in', `${from.substring(0, 7)}-15T12:00:00.000Z`);
    const outRange = makePurchase('out', '2025-01-01T00:00:00.000Z');
    const uc = new PurchasesReportUseCase(buildPurchaseRepo([inRange, outRange]) as never);
    ctx.response = await uc.execute({ period: 'month', from, to });
    ctx.from = from;
    ctx.to = to;
  });

  rt.step(/the client requests the purchases report with period "([^"]+)" and from "([^"]+)" and to "([^"]+)"/, async (m, ctx) => {
    const period = m[1] as 'day' | 'week' | 'month';
    const from = m[2];
    const to = m[3];
    const inRange = makePurchase('in', `${from.substring(0, 7)}-15T12:00:00.000Z`);
    const uc = new PurchasesReportUseCase(buildPurchaseRepo([inRange]) as never);
    ctx.response = await uc.execute({ period, from, to });
    ctx.from = from;
    ctx.to = to;
  });

  rt.step(/the response "totalPurchases" counts only purchases created from "([^"]+)" to "([^"]+)"/, (_m, ctx) => {
    const response = ctx.response as { totalPurchases: number };
    expect(response.totalPurchases).toBe(1);
  });

  rt.step(/the client requests the client analytics report with from "([^"]+)" and to "([^"]+)"/, async (m, ctx) => {
    const from = m[1];
    const to = m[2];
    const inRange = makeUser('new', `${from.substring(0, 7)}-15T12:00:00.000Z`);
    const outRange = makeUser('old', '2025-01-01T00:00:00.000Z');
    const uc = new ClientAnalyticsReportUseCase(
      buildUserRepo([inRange, outRange]) as never,
      buildOrderRepo([]) as never,
    );
    ctx.response = await uc.execute({ period: 'month', from, to });
    ctx.from = from;
    ctx.to = to;
  });

  rt.step(/the response "newClients" counts only clients registered from "([^"]+)" to "([^"]+)"/, (_m, ctx) => {
    const response = ctx.response as { newClients: number };
    expect(response.newClients).toBe(1);
  });
}
