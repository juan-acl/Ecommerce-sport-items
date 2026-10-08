import { SessionRepository } from '../../domain/repositories/session.repository';

export class LogoutUseCase {
  constructor(private readonly sessionRepo: SessionRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionRepo.delete(sessionId);
  }
}
