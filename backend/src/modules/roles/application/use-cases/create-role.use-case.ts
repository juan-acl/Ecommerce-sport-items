import { v4 as uuid } from 'uuid';
import { Role, RoleProps } from '@modules/roles/domain/entities/role.entity';
import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { ConflictException } from '@shared/domain/exceptions/domain.exception';
import { CreateRoleDto } from '../dtos/create-role.dto';

export class CreateRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(dto: CreateRoleDto): Promise<RoleProps> {
    const existing = await this.roleRepo.findByName(dto.name);
    if (existing) throw new ConflictException('Ya existe un rol con ese nombre');

    const role = new Role({
      id: uuid(),
      name: dto.name,
      description: dto.description ?? '',
      permissions: dto.permissions,
      isSystem: dto.isSystem ?? false,
      createdAt: new Date().toISOString(),
    });

    await this.roleRepo.save(role);
    return role.toJSON();
  }
}
