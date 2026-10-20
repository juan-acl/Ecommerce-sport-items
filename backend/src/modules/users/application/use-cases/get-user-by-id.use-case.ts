import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class GetUserByIdUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user.toJSON();
  }
}
