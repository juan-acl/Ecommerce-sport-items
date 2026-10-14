import express, { Application, Router, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { ApiResponder } from './response.builder';
import { logger } from '../logging/winston.logger';

export interface ExpressAppOptions {
  router: Router;
  serviceName: string;
}

export function createExpressApp({ router, serviceName }: ExpressAppOptions): Application {
  const app = express();

  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5174';
  app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(requestIdMiddleware);
  // Rate limiting: en Lambda stateless no hay memoria compartida entre invocaciones.
  // Configurar throttling en API Gateway (Usage Plans) para protección real.

  app.use((req, _res, next) => {
    logger.info(`[${serviceName}] ${req.method} ${req.path}`, {
      requestId: (req as Request & { requestId?: string }).requestId,
    });
    next();
  });

  app.get(`/v1/${serviceName}/health`, (req: Request, res: Response) => {
    ApiResponder.ok(req, res, {
      service: serviceName,
      status: 'ok',
    });
  });

  app.use(router);

  app.use((req: Request, res: Response) => {
    ApiResponder.error(req, res, 404, 'NOT_FOUND', `Ruta no encontrada: ${req.method} ${req.path}`);
  });

  app.use(errorHandler);

  return app;
}
