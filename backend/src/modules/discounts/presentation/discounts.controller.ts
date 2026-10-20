import { Request, Response, NextFunction } from 'express';
import { CreateDiscountUseCase } from '@modules/discounts/application/use-cases/create-discount.use-case';
import { ListDiscountsUseCase } from '@modules/discounts/application/use-cases/list-discounts.use-case';
import { ValidateDiscountUseCase } from '@modules/discounts/application/use-cases/validate-discount.use-case';
import { ToggleDiscountUseCase } from '@modules/discounts/application/use-cases/toggle-discount.use-case';
import { CreateDiscountSchema, ValidateDiscountSchema } from '@modules/discounts/application/dtos/discount.dto';
import { CreateAuditLogUseCase } from '@modules/audit/application/use-cases/create-audit-log.use-case';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';
import { AuthenticatedRequest } from '@shared/infrastructure/http/middlewares/auth.middleware';

export class DiscountsController {
  constructor(
    private readonly createDiscountUseCase: CreateDiscountUseCase,
    private readonly listDiscountsUseCase: ListDiscountsUseCase,
    private readonly validateDiscountUseCase: ValidateDiscountUseCase,
    private readonly toggleDiscountUseCase: ToggleDiscountUseCase,
    private readonly auditUseCase?: CreateAuditLogUseCase,
  ) {}

  private audit(req: AuthenticatedRequest, action: string, entityId: string, details: Record<string, unknown>) {
    if (!this.auditUseCase) return;
    this.auditUseCase.execute({
      userId: req.user?.id ?? 'unknown',
      userEmail: req.user?.email ?? 'unknown',
      action,
      entityType: 'discount',
      entityId,
      details,
    }).catch(() => undefined);
  }

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateDiscountSchema.parse(req.body);
      const createdBy = req.user?.email ?? 'unknown';
      const discount = await this.createDiscountUseCase.execute(dto, createdBy);
      this.audit(req, 'DISCOUNT_CREATED', discount.id, {
        created: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          minPurchase: discount.minPurchase,
          maxUses: discount.maxUses,
          expiresAt: discount.expiresAt ?? null,
          applicableCategories: discount.applicableCategories ?? [],
        },
      });
      ApiResponder.created(req, res, discount);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = Math.min(parseInt((req.query.limit as string) ?? '20', 10) || 20, 100);
      const cursor = req.query.cursor as string | undefined;
      const result = await this.listDiscountsUseCase.execute({ limit, cursor });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ValidateDiscountSchema.parse(req.body);
      const result = await this.validateDiscountUseCase.execute(dto);
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  toggle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.toggleDiscountUseCase.execute(id ?? '');
      this.audit(req, 'DISCOUNT_TOGGLED', id ?? '', {
        changes: { isActive: { from: !result.isActive, to: result.isActive } },
        code: result.code,
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };
}
