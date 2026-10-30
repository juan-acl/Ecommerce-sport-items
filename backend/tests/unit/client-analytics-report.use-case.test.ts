import { ClientAnalyticsReportUseCase } from '@modules/reports/application/use-cases/client-analytics-report.use-case';
import { User } from '@modules/users/domain/entities/user.entity';
import { Order } from '@modules/orders/domain/entities/order.entity';
import { OrderItem } from '@modules/orders/domain/entities/order-item.entity';
import { DEFAULT_SHIPPING_ADDRESS } from '@modules/orders/domain/value-objects/shipping-address.vo';
import { ORDER_STATUS } from '@modules/orders/domain/value-objects/order-status.vo';

function makeUser(id: string, createdAt: string, role = 'customer'): User {
  return new User({
    id,
    email: `${id}@example.com`,
    name: `User ${id}`,
    passwordHash: 'hash',
    role,
    createdAt,
  });
}

function makeOrder(id: string, userId: string, total: number, createdAt: string): Order {
  return new Order({
    id,
    userId,
    items: [
      new OrderItem({
        productId: 'p1',
        productName: 'Producto',
        unitPrice: total,
        quantity: 1,
        imageUrl: '',
      }),
    ],
    status: ORDER_STATUS.DELIVERED,
    shippingAddress: DEFAULT_SHIPPING_ADDRESS,
    createdAt,
  });
}

describe('ClientAnalyticsReportUseCase', () => {
  const mockUserRepo = {
    listAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockOrderRepo = {
    listAll: jest.fn(),
    listByUserId: jest.fn(),
    findById: jest.fn(),
    findByIdForUser: jest.fn(),
    executeCheckout: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo.listAll.mockResolvedValue({ users: [], nextCursor: undefined });
    mockOrderRepo.listAll.mockResolvedValue({ items: [], nextCursor: undefined, count: 0 });
  });

  it('result includes required top-level fields', async () => {
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result).toHaveProperty('totalClients');
    expect(result).toHaveProperty('newClients');
    expect(result).toHaveProperty('topClients');
  });

  it('topClients entries contain required fields', async () => {
    const now = new Date().toISOString();
    mockUserRepo.listAll.mockResolvedValueOnce({
      users: [makeUser('u1', now)],
      nextCursor: undefined,
    });
    mockOrderRepo.listAll.mockResolvedValueOnce({
      items: [makeOrder('o1', 'u1', 500, now)],
      nextCursor: undefined,
      count: 1,
    });
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'month' });
    const entry = result.topClients[0];
    expect(entry).toHaveProperty('clientId');
    expect(entry).toHaveProperty('clientName');
    expect(entry).toHaveProperty('orderCount');
    expect(entry).toHaveProperty('totalSpent');
  });

  it('topClients is ordered by totalSpent descending', async () => {
    const now = new Date().toISOString();
    mockUserRepo.listAll.mockResolvedValueOnce({
      users: [makeUser('u1', now), makeUser('u2', now)],
      nextCursor: undefined,
    });
    mockOrderRepo.listAll.mockResolvedValueOnce({
      items: [
        makeOrder('o1', 'u1', 100, now),
        makeOrder('o2', 'u2', 400, now),
        makeOrder('o3', 'u1', 50, now),
      ],
      nextCursor: undefined,
      count: 3,
    });
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.topClients[0].clientId).toBe('u2');
    expect(result.topClients[0].totalSpent).toBe(400);
    expect(result.topClients[1].clientId).toBe('u1');
    expect(result.topClients[1].orderCount).toBe(2);
  });

  it('totalClients counts all non-admin users', async () => {
    const now = new Date().toISOString();
    mockUserRepo.listAll.mockResolvedValueOnce({
      users: [makeUser('u1', now), makeUser('u2', now), makeUser('adm', now, 'admin')],
      nextCursor: undefined,
    });
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.totalClients).toBe(2);
  });

  it('newClients counts clients registered within the period', async () => {
    const now = new Date();
    const oldDate = new Date(now);
    oldDate.setMonth(oldDate.getMonth() - 2);
    mockUserRepo.listAll.mockResolvedValueOnce({
      users: [makeUser('u1', now.toISOString()), makeUser('u2', oldDate.toISOString())],
      nextCursor: undefined,
    });
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'month' });
    expect(result.newClients).toBe(1);
  });

  it('explicit from/to range scopes newClients to that window', async () => {
    mockUserRepo.listAll.mockResolvedValueOnce({
      users: [
        makeUser('u1', '2026-02-01T00:00:00.000Z'),
        makeUser('u2', '2026-05-01T00:00:00.000Z'),
      ],
      nextCursor: undefined,
    });
    const uc = new ClientAnalyticsReportUseCase(mockUserRepo as never, mockOrderRepo as never);
    const result = await uc.execute({ period: 'day', from: '2026-01-01', to: '2026-03-31' });
    expect(result.newClients).toBe(1);
  });
});
