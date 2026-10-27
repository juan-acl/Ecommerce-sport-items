import { AuditLogEntity } from '../../../src/modules/audit/domain/entities/audit-log.entity';
import { AuditLogRepository, AuditFilterParams } from '../../../src/modules/audit/domain/repositories/audit-log.repository';
import { PaginatedResult, PaginationParams } from '../../../src/shared/domain/value-objects/pagination.vo';

const byDateDesc = (a: AuditLogEntity, b: AuditLogEntity) => b.createdAt.localeCompare(a.createdAt);

export class InMemoryAuditLogRepository implements AuditLogRepository {
  private logs: AuditLogEntity[] = [];

  seed(logs: AuditLogEntity[]): void {
    this.logs = [...logs];
  }

  async save(log: AuditLogEntity): Promise<void> {
    this.logs.push(log);
  }

  async listAll(params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>> {
    const page = [...this.logs].sort(byDateDesc).slice(0, params.limit);
    return { items: page, count: page.length, nextCursor: undefined };
  }

  async listByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]> {
    return this.logs.filter((l) => l.entityType === entityType && l.entityId === entityId);
  }

  async listFiltered(filters: AuditFilterParams, params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>> {
    let items = [...this.logs].sort(byDateDesc);

    if (filters.action) items = items.filter((l) => l.action === filters.action);
    if (filters.userId) items = items.filter((l) => l.userId === filters.userId);
    if (filters.userEmail) items = items.filter((l) => l.userEmail === filters.userEmail);
    if (filters.entityType) items = items.filter((l) => l.entityType === filters.entityType);
    if (filters.fromDate) items = items.filter((l) => l.createdAt >= filters.fromDate!);
    if (filters.toDate) items = items.filter((l) => l.createdAt <= filters.toDate!);

    const cursor = params.cursor ? parseInt(params.cursor, 10) : 0;
    const page = items.slice(cursor, cursor + params.limit);
    const nextCursor = cursor + params.limit < items.length ? String(cursor + params.limit) : undefined;

    return { items: page, count: page.length, nextCursor };
  }
}
