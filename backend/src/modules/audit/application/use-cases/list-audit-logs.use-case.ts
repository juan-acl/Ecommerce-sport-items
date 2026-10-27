import { AuditLogRepository, AuditFilterParams } from '@modules/audit/domain/repositories/audit-log.repository';
import { AuditLogEntity, AuditLogProps } from '@modules/audit/domain/entities/audit-log.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';

type AuditPage = { items: AuditLogProps[]; nextCursor?: string; count: number };

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}

  async executeByEntity(
    entityType: string,
    entityId: string,
  ): Promise<{ logs: AuditLogProps[] }> {
    const items = await this.auditLogRepo.listByEntity(entityType, entityId);
    return { logs: items.map((l) => l.toJSON()) };
  }

  async executeFiltered(filters: AuditFilterParams, params: PaginationParams): Promise<AuditPage> {
    const hasFilters = Object.values(filters).some((v) => v !== undefined);
    const result = hasFilters
      ? await this.auditLogRepo.listFiltered(filters, params)
      : await this.auditLogRepo.listAll(params);
    return this.toPage(result);
  }

  private toPage(result: PaginatedResult<AuditLogEntity>): AuditPage {
    return {
      items: result.items.map((l) => l.toJSON()),
      nextCursor: result.nextCursor,
      count: result.count,
    };
  }
}
