import { v4 as uuid } from 'uuid';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { TokenServicePort } from '@modules/auth/domain/ports/token-service.port';
import { RegisterDto } from '../dtos/register.dto';

export interface RegisterResult {
  user: ReturnType<User['toJSON']>;
  token: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
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
      createdAt: new Date().toISOString(),
    });

    await this.userRepo.save(user);

    const token = this.tokenService.sign({ sub: user.id, email: user.email });

    return { user: user.toJSON(), token };
  }
}
