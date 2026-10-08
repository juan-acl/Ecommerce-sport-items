import { Role } from '../entities/role.entity';

export interface RoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  listAll(): Promise<Role[]>;
  save(role: Role): Promise<void>;
  update(role: Role): Promise<void>;
  delete(id: string): Promise<void>;
}
