import jwt from 'jsonwebtoken';
import { TokenPayload, TokenServicePort } from '../domain/ports/token-service.port';

export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
