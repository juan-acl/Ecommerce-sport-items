import { v4 as uuid } from 'uuid';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { TokenServicePort } from '@modules/auth/domain/ports/token-service.port';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { Session } from '@modules/auth/domain/entities/session.entity';
import type { RegisterDto } from '../dtos/register.dto';

export interface RegisterMeta {
  ip?: string;
  userAgent?: string;
}

export interface RegisterResult {
  user: ReturnType<User['toJSON']>;
  token: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
    private readonly sessionRepo: SessionRepository,
    private readonly sessionDurationMs: number,
  ) {}

  async execute(dto: RegisterDto, meta?: RegisterMeta): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await this.hasher.hash(dto.password);

    const user = new User({
      id: uuid(),
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash,
      role: 'client',
      createdAt: new Date().toISOString(),
    });

    await this.userRepo.save(user);

    const sessionId = uuid();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionDurationMs).toISOString();

    const session = new Session(
      sessionId,
      user.id,
      user.email,
      user.role,
      now.toISOString(),
      expiresAt,
      meta?.ip,
      meta?.userAgent,
    );

    await this.sessionRepo.save(session);

    const token = this.tokenService.sign({ sub: sessionId });

    return { user: user.toJSON(), token };
  }
}
