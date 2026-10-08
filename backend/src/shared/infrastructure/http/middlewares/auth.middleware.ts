import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@shared/infrastructure/config/env';
import { UnauthorizedException } from '@shared/domain/exceptions/domain.exception';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';
import { DynamoSessionRepository } from '@modules/auth/infrastructure/persistence/dynamo-session.repository';

const sessionRepository = new DynamoSessionRepository(dynamoClient, TABLE_NAME);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  sessionId?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = header.substring(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

    const session = await sessionRepository.findById(payload.sub);

    if (!session) {
      throw new UnauthorizedException('Sesión no encontrada o expirada');
    }

    if (session.isExpired()) {
      await sessionRepository.delete(payload.sub);
      throw new UnauthorizedException('Sesión expirada');
    }

    req.user = { id: session.userId, email: session.email, role: session.role };
    req.sessionId = session.sessionId;

    next();
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      next(err);
      return;
    }
    next(new UnauthorizedException('Token inválido o expirado'));
  }
}
