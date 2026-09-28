import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UnauthorizedException } from '@shared/domain/exceptions/domain.exception';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { TokenServicePort } from '@modules/auth/domain/ports/token-service.port';
import { LoginDto } from '../dtos/login.dto';

export interface LoginResult {
  user: ReturnType<User['toJSON']>;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.tokenService.sign({ sub: user.id, email: user.email });

    return { user: user.toJSON(), token };
  }
}
