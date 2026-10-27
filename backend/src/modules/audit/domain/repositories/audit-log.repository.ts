import { AuditLogEntity } from '../entities/audit-log.entity';
import { PaginatedResult, PaginationParams } from '@shared/domain/value-objects/pagination.vo';

export interface AuditFilterParams {
  action?: string;
  userId?: string;
  userEmail?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AuditLogRepository {
  save(log: AuditLogEntity): Promise<void>;
  listAll(params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>>;
  listByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]>;
  listFiltered(filters: AuditFilterParams, params: PaginationParams): Promise<PaginatedResult<AuditLogEntity>>;
}
