import { AuditLogEntity } from '../entities/audit-log.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export interface AuditLogRepository {
  save(log: AuditLogEntity): Promise<void>;
  listAll(params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>>;
  listByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]>;
}
