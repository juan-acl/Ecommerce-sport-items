import { Router } from 'express';
import { CartsController } from './carts.controller';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { authMiddleware } from '@shared/infrastructure/http/middlewares/auth.middleware';
import { addToCartSchema } from '../application/dtos/add-to-cart.dto';
import { removeFromCartSchema } from '../application/dtos/remove-from-cart.dto';
import {
  updateCartItemBodySchema,
  updateCartItemParamsSchema,
} from '../application/dtos/update-cart-item.dto';

export function buildCartsRouter(controller: CartsController): Router {
  const router = Router();
  const v1 = Router();

  v1.use('/cart', authMiddleware);

  v1.get('/cart', controller.getCart);
  v1.post('/cart/items', validate(addToCartSchema), controller.addItem);
  v1.put(
    '/cart/items/:productId',
    validate(updateCartItemParamsSchema, 'params'),
    validate(updateCartItemBodySchema),
    controller.updateItem,
  );
  v1.delete(
    '/cart/items/:productId',
    validate(removeFromCartSchema, 'params'),
    controller.removeItem,
  );

  router.use('/v1', v1);
  return router;
}
