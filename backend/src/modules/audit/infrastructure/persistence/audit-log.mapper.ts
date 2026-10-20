import { AuditLogEntity, AuditLogProps } from '@modules/audit/domain/entities/audit-log.entity';

export class AuditLogMapper {
  static toDomain(item: Record<string, unknown>): AuditLogEntity {
    const props: AuditLogProps = {
      id: item.id as string,
      userId: item.userId as string,
      userEmail: item.userEmail as string,
      action: item.action as string,
      entityType: item.entityType as string,
      entityId: item.entityId as string,
      details: (item.details as Record<string, unknown>) ?? {},
      createdAt: item.createdAt as string,
    };
    return new AuditLogEntity(props);
  }

  static toItem(log: AuditLogEntity): Record<string, unknown> {
    const json = log.toJSON();
    return {
      PK: `AUDIT#${log.id}`,
      SK: 'METADATA',
      GSI1PK: 'AUDIT',
      GSI1SK: `${log.createdAt}#${log.id}`,
      GSI2PK: `AUDIT_ENTITY#${log.entityType}#${log.entityId}`,
      GSI2SK: log.createdAt,
      ...json,
    };
  }
}
