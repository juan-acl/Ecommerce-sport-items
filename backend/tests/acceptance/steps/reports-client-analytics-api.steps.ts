import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { ClientAnalyticsReportUseCase } from '../../../src/modules/reports/application/use-cases/client-analytics-report.use-case';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { Order } from '../../../src/modules/orders/domain/entities/order.entity';
import { OrderItem } from '../../../src/modules/orders/domain/entities/order-item.entity';
import { DEFAULT_SHIPPING_ADDRESS } from '../../../src/modules/orders/domain/value-objects/shipping-address.vo';
import { ORDER_STATUS } from '../../../src/modules/orders/domain/value-objects/order-status.vo';

function makeUser(id: string, createdAt: string): User {
  return new User({
    id,
    email: `${id}@example.com`,
    name: `Client ${id}`,
    passwordHash: 'hash',
    role: 'customer',
    createdAt,
  });
}

function makeOrder(id: string, userId: string, total: number): Order {
  return new Order({
    id,
    userId,
    items: [new OrderItem({ productId: 'p1', productName: 'P', unitPrice: total, quantity: 1, imageUrl: '' })],
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: DEFAULT_SHIPPING_ADDRESS,
    createdAt: new Date().toISOString(),
  });
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

export function registerReportsClientAnalyticsApiSteps(rt: AcceptanceRuntime): void {
  const now = new Date().toISOString();

  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    ctx.users = [makeUser('u1', now), makeUser('u2', now), makeUser('u3', now)];
    ctx.orders = [
      makeOrder('o1', 'u1', 500),
      makeOrder('o2', 'u2', 300),
      makeOrder('o3', 'u1', 200),
      makeOrder('o4', 'u3', 100),
    ];
  });

  rt.step(/the client requests the client analytics report with period "([^"]+)"/, async (m, ctx) => {
    const period = m[1] as 'day' | 'week' | 'month';
    const users = (ctx.users ?? [makeUser('u1', now), makeUser('u2', now)]) as User[];
    const orders = (ctx.orders ?? [makeOrder('o1', 'u1', 500), makeOrder('o2', 'u2', 300)]) as Order[];
    const uc = new ClientAnalyticsReportUseCase(
      buildUserRepo(users) as never,
      buildOrderRepo(orders) as never,
    );
    ctx.response = await uc.execute({ period });
  });

  rt.step(/the response includes field "([^"]+)"/, (m, ctx) => {
    expect(ctx.response).toHaveProperty(m[1]);
  });

  rt.step(/each entry in "([^"]+)" contains field "([^"]+)"/, (m, ctx) => {
    const response = ctx.response as Record<string, unknown>;
    const arr = response[m[1]] as Record<string, unknown>[];
    expect(arr.length).toBeGreaterThan(0);
    for (const entry of arr) {
      expect(entry).toHaveProperty(m[2]);
    }
  });

  rt.step(/the "([^"]+)" list is ordered by "([^"]+)" descending/, (m, ctx) => {
    const response = ctx.response as Record<string, unknown>;
    const arr = response[m[1]] as Record<string, number>[];
    expect(arr.length).toBeGreaterThan(1);
    for (let i = 1; i < arr.length; i++) {
      expect(arr[i - 1][m[2]]).toBeGreaterThanOrEqual(arr[i][m[2]]);
    }
  });

  rt.step(/the response "([^"]+)" counts only clients registered within "([^"]+)"/, async (m, ctx) => {
    const field = m[1];
    const period = m[2] as 'day' | 'week' | 'month';
    const inPeriod = makeUser('u_new', new Date().toISOString());
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 1);
    const outPeriod = makeUser('u_old', oldDate.toISOString());
    const uc = new ClientAnalyticsReportUseCase(
      buildUserRepo([inPeriod, outPeriod]) as never,
      buildOrderRepo([]) as never,
    );
    const result = await uc.execute({ period });
    const value = (result as unknown as Record<string, unknown>)[field] as number;
    expect(value).toBe(1);
    void ctx;
  });
}
