import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { PasswordHasherPort } from '@modules/auth/domain/ports/password-hasher.port';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';
import { User } from '@modules/users/domain/entities/user.entity';
import { UpdateUserAdminDto } from '../dtos/update-user-admin.dto';

export class UpdateUserAdminUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(id: string, dto: UpdateUserAdminDto): Promise<ReturnType<User['toJSON']>> {
    const existing = await this.userRepo.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    const passwordHash = dto.password
      ? await this.hasher.hash(dto.password)
      : existing.passwordHash;

    const updated = new User({
      id: existing.id,
      email: existing.email,
      name: dto.name ?? existing.name,
      passwordHash,
      role: dto.role ?? existing.role,
      createdAt: existing.createdAt,
      isActive: existing.isActive,
      deletedAt: existing.deletedAt,
    });
    await this.userRepo.update(updated);
    return updated.toJSON();
  }
}
