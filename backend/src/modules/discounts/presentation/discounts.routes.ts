import { Router } from 'express';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { DiscountsController } from './discounts.controller';

export function buildDiscountsRouter(controller: DiscountsController): Router {
  const router = Router();
  const v1 = Router();
  v1.use(authMiddleware);
  v1.post('/discounts/validate', controller.validate);

  router.use('/v1', v1);
  return router;
}
