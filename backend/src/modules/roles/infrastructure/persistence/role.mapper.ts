import { Role, RoleProps, ModulePermission } from '@modules/roles/domain/entities/role.entity';
import { KEY_PREFIXES, SK_VALUES } from '@shared/infrastructure/dynamodb/single-table.constants';

export interface RoleItem {
  PK: string;
  SK: string;
  GSI2PK: string;
  GSI2SK: string;
  id: string;
  name: string;
  description: string;
  permissions: ModulePermission[];
  isSystem: boolean;
  createdAt: string;
}

export class RoleMapper {
  static toItem(role: Role): RoleItem {
    return {
      PK: `${KEY_PREFIXES.ROLE}${role.id}`,
      SK: SK_VALUES.METADATA,
      GSI2PK: 'ENTITY#ROLE',
      GSI2SK: `${role.createdAt}#${role.id}`,
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isSystem: role.isSystem,
      createdAt: role.createdAt,
    };
  }

  static toDomain(item: Record<string, unknown>): Role {
    const props: RoleProps = {
      id: item.id as string,
      name: item.name as string,
      description: (item.description as string) ?? '',
      permissions: (item.permissions as ModulePermission[]) ?? [],
      isSystem: (item.isSystem as boolean) ?? false,
      createdAt: item.createdAt as string,
    };
    return new Role(props);
  }
}
