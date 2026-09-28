import bcrypt from 'bcryptjs';
import { PasswordHasherPort } from '../domain/ports/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasherPort {
  private readonly rounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
