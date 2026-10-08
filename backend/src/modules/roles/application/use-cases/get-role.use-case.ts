import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { RoleProps } from '@modules/roles/domain/entities/role.entity';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';

export class GetRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(id: string): Promise<RoleProps> {
    const role = await this.roleRepo.findById(id);
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role.toJSON();
  }
}
