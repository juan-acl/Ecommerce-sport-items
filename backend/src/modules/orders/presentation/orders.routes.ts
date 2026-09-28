import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { checkoutSchema } from '../application/dtos/checkout.dto';
import { listOrdersQuerySchema } from '../application/dtos/list-orders.dto';
import { orderIdParamsSchema } from '../application/dtos/order-id.dto';

export function buildOrdersRouter(controller: OrdersController): Router {
  const router = Router();
  const v1 = Router();

  v1.use('/orders', authMiddleware);

  v1.post('/orders/checkout', validate(checkoutSchema), controller.checkout);
  v1.get('/orders', validate(listOrdersQuerySchema, 'query'), controller.list);
  v1.get('/orders/:orderId', validate(orderIdParamsSchema, 'params'), controller.getById);

  router.use('/v1', v1);
  return router;
}
