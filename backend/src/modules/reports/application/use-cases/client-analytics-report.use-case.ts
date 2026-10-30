import type { UserRepository } from '@modules/users/domain/repositories/user.repository';
import type { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { type ReportPeriod, getDateRange } from '../utils/report-date-range';

export interface TopClient {
  clientId: string;
  clientName: string;
  orderCount: number;
  totalSpent: number;
}

export interface ClientAnalyticsResult {
  totalClients: number;
  newClients: number;
  topClients: TopClient[];
}

export class ClientAnalyticsReportUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  async execute(input: {
    period: ReportPeriod;
    from?: string;
    to?: string;
  }): Promise<ClientAnalyticsResult> {
    const { start, end } = getDateRange(input);

    const allUsers: { id: string; name: string; role: string; createdAt: string }[] = [];
    let userCursor: string | undefined;
    do {
      const page = await this.userRepo.listAll({ limit: 100, cursor: userCursor });
      for (const user of page.users) {
        allUsers.push({ id: user.id, name: user.name, role: user.role, createdAt: user.createdAt });
      }
      userCursor = page.nextCursor;
    } while (userCursor);

    const clients = allUsers.filter((u) => u.role !== 'admin');
    const totalClients = clients.length;
    const newClients = clients.filter((u) => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= start && createdAt <= end;
    }).length;

    const clientNameMap = new Map(clients.map((c) => [c.id, c.name]));

    const clientMap = new Map<string, TopClient>();
    let orderCursor: string | undefined;
    do {
      const page = await this.orderRepo.listAll({ limit: 100, cursor: orderCursor });
      for (const order of page.items) {
        const existing = clientMap.get(order.userId);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent = parseFloat((existing.totalSpent + order.total).toFixed(2));
        } else {
          clientMap.set(order.userId, {
            clientId: order.userId,
            clientName: clientNameMap.get(order.userId) ?? 'Unknown',
            orderCount: 1,
            totalSpent: parseFloat(order.total.toFixed(2)),
          });
        }
      }
      orderCursor = page.nextCursor;
    } while (orderCursor);

    const topClients = Array.from(clientMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return { totalClients, newClients, topClients };
  }
}
