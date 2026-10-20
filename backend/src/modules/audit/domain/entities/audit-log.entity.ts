export interface AuditLogProps {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export class AuditLogEntity {
  constructor(private readonly props: AuditLogProps) {}

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get userEmail(): string { return this.props.userEmail; }
  get action(): string { return this.props.action; }
  get entityType(): string { return this.props.entityType; }
  get entityId(): string { return this.props.entityId; }
  get details(): Record<string, unknown> { return { ...this.props.details }; }
  get createdAt(): string { return this.props.createdAt; }

  toJSON(): AuditLogProps {
    return { ...this.props, details: { ...this.props.details } };
  }
}
