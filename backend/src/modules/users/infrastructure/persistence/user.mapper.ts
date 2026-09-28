import { User, UserProps } from '@modules/users/domain/entities/user.entity';
import { KEY_PREFIXES, SK_VALUES } from '@shared/infrastructure/dynamodb/single-table.constants';

export interface UserItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export class UserMapper {
  static toItem(user: User): UserItem {
    return {
      PK: `${KEY_PREFIXES.USER}${user.id}`,
      SK: SK_VALUES.PROFILE,
      GSI1PK: `${KEY_PREFIXES.EMAIL}${user.email.toLowerCase()}`,
      GSI1SK: SK_VALUES.USER,
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  }

  static toDomain(item: Record<string, unknown>): User {
    const props: UserProps = {
      id: item.id as string,
      email: item.email as string,
      name: item.name as string,
      passwordHash: item.passwordHash as string,
      createdAt: item.createdAt as string,
    };
    return new User(props);
  }
}
