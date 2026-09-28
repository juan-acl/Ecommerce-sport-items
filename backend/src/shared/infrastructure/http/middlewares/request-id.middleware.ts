import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id'] as string | undefined;
  const id = incoming || `req_${uuid().substring(0, 12)}`;

  (req as Request & { requestId: string }).requestId = id;
  res.setHeader('X-Request-Id', id);

  next();
}
