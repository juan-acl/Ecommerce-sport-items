import { Session } from '../../domain/entities/session.entity';

interface SessionItem {
  PK: string;
  SK: string;
  GSI2PK: string;
  GSI2SK: string;
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  ttl: number;
  ip?: string;
  userAgent?: string;
}

export class SessionMapper {
  static toItem(session: Session): SessionItem {
    return {
      PK: `SESSION#${session.sessionId}`,
      SK: 'METADATA',
      GSI2PK: `USER#${session.userId}`,
      GSI2SK: `SESSION#${session.createdAt}`,
      sessionId: session.sessionId,
      userId: session.userId,
      email: session.email,
      role: session.role,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      ttl: Math.floor(new Date(session.expiresAt).getTime() / 1000),
      ip: session.ip,
      userAgent: session.userAgent,
    };
  }

  static toDomain(item: Record<string, unknown>): Session {
    return new Session(
      item.sessionId as string,
      item.userId as string,
      item.email as string,
      item.role as string,
      item.createdAt as string,
      item.expiresAt as string,
      item.ip as string | undefined,
      item.userAgent as string | undefined,
    );
  }
}
