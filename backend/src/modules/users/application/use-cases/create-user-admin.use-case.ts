import { v4 as uuid } from 'uuid';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { CreateUserAdminDto } from '../dtos/create-user-admin.dto';

export class CreateUserAdminUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(dto: CreateUserAdminDto): Promise<ReturnType<User['toJSON']>> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Ya existe un usuario con ese email');

    const passwordHash = await this.hasher.hash(dto.password);
    const user = new User({
      id: uuid(),
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash,
      role: dto.role,
      createdAt: new Date().toISOString(),
    });
    await this.userRepo.save(user);
    return user.toJSON();
  }
}
