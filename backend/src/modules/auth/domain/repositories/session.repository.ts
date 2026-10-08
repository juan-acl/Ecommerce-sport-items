import { Session } from '../entities/session.entity';

export interface SessionRepository {
  save(session: Session): Promise<void>;
  findById(sessionId: string): Promise<Session | null>;
  delete(sessionId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
