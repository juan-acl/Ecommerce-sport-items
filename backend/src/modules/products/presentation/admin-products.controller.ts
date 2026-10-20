import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from '@modules/products/application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '@modules/products/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@modules/products/application/use-cases/delete-product.use-case';
import { ListProductsUseCase } from '@modules/products/application/use-cases/list-products.use-case';
import { GetProductUseCase } from '@modules/products/application/use-cases/get-product.use-case';
import { GenerateProductUploadUrlUseCase } from '@modules/products/application/use-cases/generate-upload-url.use-case';
import { CreateAuditLogUseCase } from '@modules/audit/application/use-cases/create-audit-log.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

type AdminReq = Request & { user?: { id: string; email: string } };

function buildDiff(
  before: Record<string, unknown>,
  updates: Record<string, unknown>,
): Record<string, { from: unknown; to: unknown }> {
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [key, newVal] of Object.entries(updates)) {
    if (key === 'id' || key === 'createdAt') continue;
    const oldVal = before[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = { from: oldVal ?? null, to: newVal };
    }
  }
  return changes;
}

export class AdminProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly generateUploadUrlUseCase: GenerateProductUploadUrlUseCase,
    private readonly auditUseCase?: CreateAuditLogUseCase,
  ) {}

  private audit(req: AdminReq, action: string, entityId: string, details: Record<string, unknown>) {
    if (!this.auditUseCase) return;
    this.auditUseCase.execute({
      userId: req.user?.id ?? 'unknown',
      userEmail: req.user?.email ?? 'unknown',
      action,
      entityType: 'product',
      entityId,
      details,
    }).catch(() => undefined);
  }

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

  create = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      this.audit(req, 'PRODUCT_CREATED', product.id, {
        created: { name: product.name, category: product.category, price: product.price, stock: product.stock },
      });
      ApiResponder.created(req, res, product);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      let beforeData: Record<string, unknown> = {};
      try {
        const before = await this.getProductUseCase.execute(id ?? '');
        beforeData = before as unknown as Record<string, unknown>;
      } catch { /* producto no encontrado — el updateProductUseCase fallará igual */ }

      const product = await this.updateProductUseCase.execute(id ?? '', req.body);
      const changes = buildDiff(beforeData, req.body as Record<string, unknown>);
      this.audit(req, 'PRODUCT_UPDATED', id ?? '', { changes });
      ApiResponder.ok(req, res, product);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: AdminReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      let deletedData: Record<string, unknown> = {};
      try {
        const before = await this.getProductUseCase.execute(id ?? '');
        const { id: _id, createdAt: _c, ...rest } = before as unknown as Record<string, unknown>;
        deletedData = rest;
      } catch { /* continúa */ }

      await this.deleteProductUseCase.execute(id ?? '');
      this.audit(req, 'PRODUCT_DELETED', id ?? '', { deleted: deletedData });
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
