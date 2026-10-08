import { v4 as uuid } from 'uuid';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UnauthorizedException } from '@shared/domain/exceptions/domain.exception';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { TokenServicePort } from '@modules/auth/domain/ports/token-service.port';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { ModulePermission } from '@modules/roles/domain/entities/role.entity';
import { LoginDto } from '../dtos/login.dto';

export interface LoginMeta {
  ip?: string;
  userAgent?: string;
}

export interface LoginResult {
  user: ReturnType<User['toJSON']>;
  token: string;
  permissions: ModulePermission[];
}

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
    private readonly sessionRepo: SessionRepository,
    private readonly roleRepo: RoleRepository,
    private readonly sessionDurationMs: number,
  ) {}

  async execute(dto: LoginDto, meta?: LoginMeta): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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

    const role = await this.roleRepo.findByName(user.role);
    const permissions: ModulePermission[] = role?.permissions ?? [];

    return { user: user.toJSON(), token, permissions };
  }
}
