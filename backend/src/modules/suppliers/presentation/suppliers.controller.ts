import { Request, Response, NextFunction } from 'express';
import { ListSuppliersUseCase } from '@modules/suppliers/application/use-cases/list-suppliers.use-case';
import { GetSupplierUseCase } from '@modules/suppliers/application/use-cases/get-supplier.use-case';
import { CreateSupplierUseCase } from '@modules/suppliers/application/use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from '@modules/suppliers/application/use-cases/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@modules/suppliers/application/use-cases/delete-supplier.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class SuppliersController {
  constructor(
    private readonly listSuppliersUseCase: ListSuppliersUseCase,
    private readonly getSupplierUseCase: GetSupplierUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = parseInt((req.query.limit as string) ?? '20', 10);
      const limit = isNaN(raw) || raw < 1 ? 20 : Math.min(raw, 100);
      const cursor = req.query.cursor as string | undefined;
      const result = await this.listSuppliersUseCase.execute({ limit, cursor });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const supplier = await this.getSupplierUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, supplier);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const supplier = await this.createSupplierUseCase.execute(req.body);
      ApiResponder.created(req, res, supplier);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const supplier = await this.updateSupplierUseCase.execute(id ?? '', req.body);
      ApiResponder.ok(req, res, supplier);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.deleteSupplierUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, { message: 'Proveedor eliminado' });
    } catch (err) {
      next(err);
    }
  };
}
