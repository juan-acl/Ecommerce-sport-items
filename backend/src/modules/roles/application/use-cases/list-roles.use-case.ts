import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { Role, RoleProps } from '@modules/roles/domain/entities/role.entity';

export class ListRolesUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(): Promise<RoleProps[]> {
    const roles = await this.roleRepo.listAll();
    return roles.map((r: Role) => r.toJSON());
  }
}
