import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

type Source = 'body' | 'query' | 'params';

export function validate(schema: z.ZodSchema, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(result.error);
      return;
    }

    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    next();
  };
}
