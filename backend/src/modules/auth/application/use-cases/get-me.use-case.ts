import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { RoleRepository } from '@modules/roles/domain/repositories/role.repository';
import { ModulePermission } from '@modules/roles/domain/entities/role.entity';
import { User } from '@modules/users/domain/entities/user.entity';
import { NotFoundException } from '@shared/domain/exceptions/domain.exception';
import { isFullAccess } from '@shared/domain/constants/system-modules';

export interface GetMeResult {
  user: ReturnType<User['toJSON']>;
  permissions: ModulePermission[];
}

export class GetMeUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) {}

  async execute(userId: string): Promise<GetMeResult> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const role = await this.roleRepo.findByName(user.role);
    const raw: ModulePermission[] = role?.permissions ?? [];
    return { user: user.toJSON(), permissions: isFullAccess(raw) ? [] : raw };
  }
}
