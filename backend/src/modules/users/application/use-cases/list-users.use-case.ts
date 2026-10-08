import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';

export class ListUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(params: {
    limit?: number;
    cursor?: string;
    role?: string;
  }): Promise<{ users: ReturnType<User['toJSON']>[]; nextCursor?: string }> {
    const result = await this.userRepo.listAll(params);
    return { users: result.users.map((u) => u.toJSON()), nextCursor: result.nextCursor };
  }
}
