import { User, UserProps, UserRole } from '@modules/users/domain/entities/user.entity';
import { KEY_PREFIXES, SK_VALUES } from '@shared/infrastructure/dynamodb/single-table.constants';

export interface UserItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  deletedAt?: string;
}

export class UserMapper {
  static toItem(user: User): UserItem {
    return {
      PK: `${KEY_PREFIXES.USER}${user.id}`,
      SK: SK_VALUES.PROFILE,
      GSI1PK: `${KEY_PREFIXES.EMAIL}${user.email.toLowerCase()}`,
      GSI1SK: SK_VALUES.USER,
      GSI2PK: 'ENTITY#USER',
      GSI2SK: `${user.createdAt}#${user.id}`,
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
      ...(user.deletedAt && { deletedAt: user.deletedAt }),
    };
  }

  static toDomain(item: Record<string, unknown>): User {
    const props: UserProps = {
      id: item.id as string,
      email: item.email as string,
      name: item.name as string,
      passwordHash: item.passwordHash as string,
      role: (item.role as UserRole) ?? 'client',
      createdAt: item.createdAt as string,
      isActive: item.isActive !== undefined ? (item.isActive as boolean) : true,
      deletedAt: item.deletedAt as string | undefined,
    };
    return new User(props);
  }
}
