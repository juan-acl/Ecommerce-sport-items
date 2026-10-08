import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { NotFoundException, ConflictException } from '@shared/domain/exceptions/domain.exception';

export class DeactivateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.isActive) throw new ConflictException('El usuario ya está desactivado');
    await this.userRepo.delete(id);
  }
}
