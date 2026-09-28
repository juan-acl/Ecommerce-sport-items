import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@shared/infrastructure/config/env';
import { UnauthorizedException } from '@shared/domain/exceptions/domain.exception';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = header.substring(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string };

    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      next(err);
      return;
    }
    next(new UnauthorizedException('Token inválido o expirado'));
  }
}
