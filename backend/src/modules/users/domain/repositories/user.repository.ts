import { User } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  listAll(params: {
    limit?: number;
    cursor?: string;
  }): Promise<{ users: User[]; nextCursor?: string }>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
