import { Router } from 'express';
import { ProductsController } from './products.controller';
import { validate } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { listProductsQuerySchema } from '../application/dtos/list-products.dto';
import { productIdParamsSchema } from '../application/dtos/product-id.dto';

export function buildProductsRouter(controller: ProductsController): Router {
  const router = Router();
  const v1 = Router();

  v1.get('/products', validate(listProductsQuerySchema, 'query'), controller.list);
  v1.get('/products/:id', validate(productIdParamsSchema, 'params'), controller.getById);

  router.use('/v1', v1);
  return router;
}
