import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { logger } from '@shared/infrastructure/logging/winston.logger';
import { ApiResponder } from '../response.builder';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors;
    const details: Record<string, string[] | string> = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (Array.isArray(value) && value.length > 0) {
        details[key] = value;
      }
    }
    ApiResponder.error(req, res, 400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', details);
    return;
  }

  if (err instanceof DomainException) {
    ApiResponder.error(req, res, err.statusCode, err.code, err.message);
    return;
  }

  logger.error('Error no manejado', {
    message: err.message,
    stack: err.stack,
    requestId: (req as Request & { requestId?: string }).requestId,
  });

  ApiResponder.error(req, res, 500, 'INTERNAL_SERVER_ERROR', 'Error interno del servidor');
}
