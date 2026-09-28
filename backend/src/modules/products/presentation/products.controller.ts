import { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '@modules/products/application/use-cases/list-products.use-case';
import { GetProductUseCase } from '@modules/products/application/use-cases/get-product.use-case';
import { ListProductsQuery } from '@modules/products/application/dtos/list-products.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';
import { logger } from '@/shared/infrastructure/logging/winston.logger';

export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listProductsUseCase.execute(
        req.query as unknown as ListProductsQuery,
      );
      ApiResponder.paginated(req, res, result.products, result.pagination);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      logger.info(`Fetching product with ID: ${id}`);
      const product = await this.getProductUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, product);
    } catch (err) {
      logger.error(`Error fetching product: ${err instanceof Error ? err.message : String(err)}`);
      next(err);
    }
  };
}
