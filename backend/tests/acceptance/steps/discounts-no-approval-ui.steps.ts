import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';

function isPendingApproval(discount: DiscountProps): boolean {
  return !!discount.needsApproval && !discount.isActive && !discount.approvedBy;
}

function buildCreateMockRepo() {
  return {
    findByCode: async () => null,
    save: async () => undefined,
    findById: async () => null,
    listAll: async () => ({ items: [], nextCursor: undefined, count: 0 }),
    setActive: async () => undefined,
    approve: async () => undefined,
    incrementUsedCount: async () => undefined,
    hasUserUsedDiscount: async () => false,
    recordUserUsage: async () => undefined,
  };
}

export function registerDiscountsNoApprovalUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Descuentos page/, (_m, ctx) => {
    ctx.createRepo = buildCreateMockRepo();
    ctx.createUseCase = new CreateDiscountUseCase(ctx.createRepo as never);
  });

  rt.step(/a percentage discount with value (\d+) exists in the list/, async (m, ctx) => {
    const value = parseInt(m[1], 10);
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.discount = await uc.execute(
      { code: `DISC${value}`, type: 'percentage', value, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
  });

  rt.step(/the discount list does not show an "Aprobar" action for that discount/, (_m, ctx) => {
    const discount = ctx.discount as DiscountProps;
    expect(isPendingApproval(discount)).toBe(false);
  });

  rt.step(/the discount list does not show status "Pendiente aprobación" for that discount/, (_m, ctx) => {
    const discount = ctx.discount as DiscountProps;
    expect(isPendingApproval(discount)).toBe(false);
  });

  rt.step(/the admin creates a percentage discount with value (\d+)/, async (m, ctx) => {
    const value = parseInt(m[1], 10);
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.discount = await uc.execute(
      { code: `NEW${value}`, type: 'percentage', value, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
  });

  rt.step(/the discount list shows status "Activo" for that discount/, (_m, ctx) => {
    const discount = ctx.discount as DiscountProps;
    expect(discount.isActive).toBe(true);
    expect(isPendingApproval(discount)).toBe(false);
  });
}
