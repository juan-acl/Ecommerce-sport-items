import { Request, Response, NextFunction } from 'express';
import { ListPurchasesUseCase } from '@modules/purchases/application/use-cases/list-purchases.use-case';
import { GetPurchaseUseCase } from '@modules/purchases/application/use-cases/get-purchase.use-case';
import { CreatePurchaseUseCase } from '@modules/purchases/application/use-cases/create-purchase.use-case';
import { ReceivePurchaseUseCase } from '@modules/purchases/application/use-cases/receive-purchase.use-case';
import { CancelPurchaseUseCase } from '@modules/purchases/application/use-cases/cancel-purchase.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';

export class PurchasesController {
  constructor(
    private readonly listPurchasesUseCase: ListPurchasesUseCase,
    private readonly getPurchaseUseCase: GetPurchaseUseCase,
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly receivePurchaseUseCase: ReceivePurchaseUseCase,
    private readonly cancelPurchaseUseCase: CancelPurchaseUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = parseInt((req.query.limit as string) ?? '20', 10);
      const limit = isNaN(raw) || raw < 1 ? 20 : Math.min(raw, 100);
      const cursor = req.query.cursor as string | undefined;
      const supplierId = req.query.supplierId as string | undefined;
      const result = await this.listPurchasesUseCase.execute({ limit, cursor, supplierId });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const purchase = await this.getPurchaseUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, purchase);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const purchase = await this.createPurchaseUseCase.execute(req.body);
      ApiResponder.created(req, res, purchase);
    } catch (err) {
      next(err);
    }
  };

  receive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const purchase = await this.receivePurchaseUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, purchase);
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const purchase = await this.cancelPurchaseUseCase.execute(id ?? '');
      ApiResponder.ok(req, res, purchase);
    } catch (err) {
      next(err);
    }
  };
}
