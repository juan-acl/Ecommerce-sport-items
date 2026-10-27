import { ListAuditLogsUseCase } from '@modules/audit/application/use-cases/list-audit-logs.use-case';
import { AuditLogEntity } from '@modules/audit/domain/entities/audit-log.entity';

function makeLog(overrides: Partial<{
  id: string; userId: string; userEmail: string; action: string;
  entityType: string; entityId: string; createdAt: string;
}> = {}): AuditLogEntity {
  return new AuditLogEntity({
    id: overrides.id ?? 'log-1',
    userId: overrides.userId ?? 'user-1',
    userEmail: overrides.userEmail ?? 'admin@example.com',
    action: overrides.action ?? 'ORDER_APPROVED',
    entityType: overrides.entityType ?? 'order',
    entityId: overrides.entityId ?? 'ord-1',
    details: {},
    createdAt: overrides.createdAt ?? '2026-10-01T10:00:00Z',
  });
}

const mockRepo = {
  save: jest.fn(),
  listAll: jest.fn(),
  listByEntity: jest.fn(),
  listFiltered: jest.fn(),
};

function buildUseCase() {
  return new ListAuditLogsUseCase(mockRepo as never);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ListAuditLogsUseCase.executeFiltered', () => {
  // TC-AAS-1
  it('TC-AAS-1: filters by action and returns only matching logs', async () => {
    const log = makeLog({ action: 'ORDER_APPROVED' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ action: 'ORDER_APPROVED' }, { limit: 20 });

    expect(mockRepo.listFiltered).toHaveBeenCalledWith({ action: 'ORDER_APPROVED' }, { limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].action).toBe('ORDER_APPROVED');
  });

  // TC-AAS-2
  it('TC-AAS-2: filters by userId and returns only matching logs', async () => {
    const log = makeLog({ userId: 'user-2' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ userId: 'user-2' }, { limit: 20 });

    expect(mockRepo.listFiltered).toHaveBeenCalledWith({ userId: 'user-2' }, { limit: 20 });
    expect(result.items[0].userId).toBe('user-2');
  });

  // TC-AAS-3
  it('TC-AAS-3: filters by date range', async () => {
    const log = makeLog({ createdAt: '2026-10-01T10:00:00Z' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered(
      { fromDate: '2026-10-01T00:00:00Z', toDate: '2026-10-01T23:59:59Z' },
      { limit: 20 },
    );

    expect(mockRepo.listFiltered).toHaveBeenCalledWith(
      { fromDate: '2026-10-01T00:00:00Z', toDate: '2026-10-01T23:59:59Z' },
      { limit: 20 },
    );
    expect(result.items).toHaveLength(1);
  });

  // TC-AAS-4
  it('TC-AAS-4: filters by action and date range combined', async () => {
    const log = makeLog({ action: 'ORDER_STATUS_CHANGED', createdAt: '2026-10-02T09:00:00Z' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    await uc.executeFiltered(
      { action: 'ORDER_STATUS_CHANGED', fromDate: '2026-10-02T00:00:00Z', toDate: '2026-10-03T23:59:59Z' },
      { limit: 20 },
    );

    expect(mockRepo.listFiltered).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'ORDER_STATUS_CHANGED' }),
      { limit: 20 },
    );
  });

  // TC-AAS-5
  it('TC-AAS-5: no matching logs returns empty items', async () => {
    mockRepo.listFiltered.mockResolvedValue({ items: [], count: 0, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ action: 'NONEXISTENT_ACTION' }, { limit: 20 });

    expect(result.items).toHaveLength(0);
    expect(result.count).toBe(0);
  });

  // TC-AAS-6
  it('TC-AAS-6: filters by entityType', async () => {
    const log = makeLog({ entityType: 'product' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ entityType: 'product' }, { limit: 20 });

    expect(result.items[0].entityType).toBe('product');
  });

  // TC-AAS-7
  it('TC-AAS-7: filters by userEmail', async () => {
    const log = makeLog({ userEmail: 'operator@example.com' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ userEmail: 'operator@example.com' }, { limit: 20 });

    expect(mockRepo.listFiltered).toHaveBeenCalledWith({ userEmail: 'operator@example.com' }, { limit: 20 });
    expect(result.items[0].userEmail).toBe('operator@example.com');
  });

  // TC-AAS-8
  it('TC-AAS-8: pagination returns nextCursor when more results exist', async () => {
    const logs = Array.from({ length: 2 }, (_, i) =>
      makeLog({ id: `log-${i}`, action: 'ORDER_STATUS_CHANGED' }),
    );
    mockRepo.listFiltered.mockResolvedValue({ items: logs, count: 2, nextCursor: 'cursor-abc' });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ action: 'ORDER_STATUS_CHANGED' }, { limit: 2 });

    expect(result.items).toHaveLength(2);
    expect(result.nextCursor).toBe('cursor-abc');
  });

  // TC-AAS-9
  it('TC-AAS-9: pagination returns no cursor when results fit in limit', async () => {
    const log = makeLog({ action: 'ORDER_STATUS_CHANGED' });
    mockRepo.listFiltered.mockResolvedValue({ items: [log], count: 1, nextCursor: undefined });

    const uc = buildUseCase();
    const result = await uc.executeFiltered({ action: 'ORDER_STATUS_CHANGED' }, { limit: 5 });

    expect(result.nextCursor).toBeUndefined();
  });
});
