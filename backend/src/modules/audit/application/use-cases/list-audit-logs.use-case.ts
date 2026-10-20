import { AuditLogRepository } from '@modules/audit/domain/repositories/audit-log.repository';
import { AuditLogProps } from '@modules/audit/domain/entities/audit-log.entity';
import { PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}

  async execute(
    params: PaginationParams,
  ): Promise<{ items: AuditLogProps[]; nextCursor?: string; count: number }> {
    const result = await this.auditLogRepo.listAll(params);
    return {
      items: result.items.map((l) => l.toJSON()),
      nextCursor: result.nextCursor,
      count: result.count,
    };
  }

  async executeByEntity(
    entityType: string,
    entityId: string,
  ): Promise<{ logs: AuditLogProps[] }> {
    const items = await this.auditLogRepo.listByEntity(entityType, entityId);
    return { logs: items.map((l) => l.toJSON()) };
  }
}
