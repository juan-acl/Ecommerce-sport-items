import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import { ValidateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/validate-discount.use-case';
import { ListDiscountsUseCase } from '../../../src/modules/discounts/application/use-cases/list-discounts.use-case';
import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';

function buildCreateRepo(existingDiscount?: Discount) {
  return {
    findByCode: async (code: string) => (existingDiscount?.code === code ? existingDiscount : null),
    save: async () => undefined,
    findById: async () => null,
    listAll: async () => ({ items: existingDiscount ? [existingDiscount] : [], nextCursor: undefined, count: existingDiscount ? 1 : 0 }),
    setActive: async () => undefined,
    approve: async () => undefined,
    incrementUsedCount: async () => undefined,
    hasUserUsedDiscount: async () => false,
    recordUserUsage: async () => undefined,
  };
}

function makeDiscount(props: Partial<DiscountProps>): Discount {
  return new Discount({
    id: 'disc-1',
    code: props.code ?? 'VIP10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: true,
    needsApproval: false,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    targetClientId: props.targetClientId ?? null,
  });
}

export function registerDiscountsClientCouponApiSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    ctx.createRepo = buildCreateRepo();
    ctx.createUseCase = new CreateDiscountUseCase(ctx.createRepo as never);
  });

  rt.step(/the admin creates a discount with targetClientId "([^"]+)"/, async (m, ctx) => {
    const targetClientId = m[1];
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.createdDiscount = await uc.execute(
      { code: 'VIPCODE', type: 'percentage', value: 10, minPurchase: 0, maxUses: 0, targetClientId },
      'admin@test.com',
    );
  });

  rt.step(/the admin creates a discount without targetClientId/, async (_m, ctx) => {
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.createdDiscount = await uc.execute(
      { code: 'GLOBALCODE', type: 'percentage', value: 10, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
  });

  rt.step(/the created discount has targetClientId equal to "([^"]+)"/, (m, ctx) => {
    const expected = m[1];
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.targetClientId).toBe(expected);
  });

  rt.step(/the created discount has targetClientId equal to null/, (_m, ctx) => {
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.targetClientId).toBeNull();
  });

  rt.step(/a discount with targetClientId "([^"]+)" exists with code "([^"]+)"/, (m, ctx) => {
    const targetClientId = m[1];
    const code = m[2];
    ctx.existingDiscount = makeDiscount({ targetClientId, code });
    const repo = buildCreateRepo(ctx.existingDiscount as Discount);
    ctx.validateUseCase = new ValidateDiscountUseCase(repo as never);
  });

  rt.step(/a global discount exists with code "([^"]+)"/, (m, ctx) => {
    const code = m[1];
    ctx.existingDiscount = makeDiscount({ targetClientId: null, code });
    const repo = buildCreateRepo(ctx.existingDiscount as Discount);
    ctx.validateUseCase = new ValidateDiscountUseCase(repo as never);
  });

  rt.step(/client "([^"]+)" validates the coupon code "([^"]+)"/, async (m, ctx) => {
    const userId = m[1];
    const code = m[2];
    const uc = ctx.validateUseCase as ValidateDiscountUseCase;
    try {
      ctx.validateResult = await uc.execute({ code, orderTotal: 100, userId });
      ctx.validateError = null;
    } catch (err) {
      ctx.validateResult = null;
      ctx.validateError = err;
    }
  });

  rt.step(/the validation succeeds/, (_m, ctx) => {
    expect(ctx.validateResult).not.toBeNull();
    expect(ctx.validateError).toBeNull();
  });

  rt.step(/the validation fails with error "([^"]+)"/, (m, ctx) => {
    const expectedCode = m[1];
    expect(ctx.validateResult).toBeNull();
    expect(ctx.validateError).not.toBeNull();
    expect((ctx.validateError as { code: string }).code).toBe(expectedCode);
  });

  rt.step(/the client requests the discounts list/, async (_m, ctx) => {
    const discount = makeDiscount({ targetClientId: 'client-abc' });
    const repo = buildCreateRepo(discount);
    const uc = new ListDiscountsUseCase(repo as never);
    ctx.listResult = await uc.execute({ limit: 20 });
  });

  rt.step(/each discount entry contains field "([^"]+)"/, (m, ctx) => {
    const field = m[1];
    const result = ctx.listResult as { items: DiscountProps[] };
    expect(result.items.length).toBeGreaterThan(0);
    for (const entry of result.items) {
      expect(entry).toHaveProperty(field);
    }
  });
}
