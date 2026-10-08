import { NextFunction, Response } from 'express';
import { ForbiddenException } from '@shared/domain/exceptions/domain.exception';
import { AuthenticatedRequest } from './auth.middleware';

export function adminMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user || req.user.role === 'client') {
    return next(new ForbiddenException('No tienes permisos para acceder a esta sección'));
  }
  next();
}
