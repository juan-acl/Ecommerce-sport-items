import { Role, RoleProps } from '@modules/roles/domain/entities/role.entity';
import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';
import { UpdateRoleDto } from '../dtos/update-role.dto';

export class UpdateRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(id: string, dto: UpdateRoleDto): Promise<RoleProps> {
    const existing = await this.roleRepo.findById(id);
    if (!existing) throw new NotFoundException('Rol no encontrado');

    const updated = new Role({
      id: existing.id,
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,
      permissions: dto.permissions ?? existing.permissions,
      isSystem: existing.isSystem,
      createdAt: existing.createdAt,
    });

    await this.roleRepo.update(updated);
    return updated.toJSON();
  }
}
