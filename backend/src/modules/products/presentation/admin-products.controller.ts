import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from '@modules/products/application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '@modules/products/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@modules/products/application/use-cases/delete-product.use-case';
import { ListProductsUseCase } from '@modules/products/application/use-cases/list-products.use-case';
import { GetProductUseCase } from '@modules/products/application/use-cases/get-product.use-case';
import { GenerateProductUploadUrlUseCase } from '@modules/products/application/use-cases/generate-upload-url.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class AdminProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly generateUploadUrlUseCase: GenerateProductUploadUrlUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listProductsUseCase.execute(req.query as never);
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await this.getProductUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, product);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      ApiResponder.created(req, res, product);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const product = await this.updateProductUseCase.execute(id ?? '', req.body);
      ApiResponder.ok(req, res, product);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.deleteProductUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, { message: 'Producto eliminado' });
    } catch (err) {
      next(err);
    }
  };

  getUploadUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filename = 'image.jpg', contentType = 'image/jpeg' } = req.body as {
        filename?: string;
        contentType?: string;
      };
      const result = await this.generateUploadUrlUseCase.execute(filename, contentType);
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
