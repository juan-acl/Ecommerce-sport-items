import { v4 as uuid } from 'uuid';
import { AuditLogEntity, AuditLogProps } from '@modules/audit/domain/entities/audit-log.entity';
import { AuditLogRepository } from '@modules/audit/domain/repositories/audit-log.repository';

export interface CreateAuditLogInput {
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
}

export class CreateAuditLogUseCase {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}

  async execute(input: CreateAuditLogInput): Promise<AuditLogProps> {
    const log = new AuditLogEntity({
      id: uuid(),
      userId: input.userId,
      userEmail: input.userEmail,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: input.details,
      createdAt: new Date().toISOString(),
    });

    await this.auditLogRepo.save(log);
    return log.toJSON();
  }
}
