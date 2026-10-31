import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import { ValidateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/validate-discount.use-case';
import { ListDiscountsUseCase } from '../../../src/modules/discounts/application/use-cases/list-discounts.use-case';
import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';
import { buildDiscountRepo } from '../helpers/discount-repo-builders';

function makeSpecialDiscount(props: Partial<DiscountProps> & { code: string; targetClientId: string }): Discount {
  return new Discount({
    id: 'sp-disc-1',
    code: props.code,
    type: 'percentage',
    value: props.value ?? 15,
    minPurchase: 0,
    maxUses: 1,
    usedCount: props.usedCount ?? 0,
    isActive: props.isActive ?? true,
    needsApproval: props.needsApproval ?? false,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    targetClientId: props.targetClientId,
    isSpecial: true,
  });
}

export function registerDiscountsSpecialCouponApiSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    ctx.createRepo = buildDiscountRepo();
    ctx.createUseCase = new CreateDiscountUseCase(ctx.createRepo as never);
  });

  rt.step(/the admin creates a special coupon for client "([^"]+)" with value (\d+)/, async (m, ctx) => {
    const targetClientId = m[1];
    const value = parseInt(m[2], 10);
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    try {
      ctx.createdDiscount = await uc.execute(
        { isSpecial: true, type: 'percentage', value, minPurchase: 0, maxUses: 0, targetClientId },
        'admin@test.com',
      );
      ctx.createError = null;
    } catch (err) {
      ctx.createdDiscount = null;
      ctx.createError = err;
    }
  });

  rt.step(/the created discount has a non-empty code/, (_m, ctx) => {
    const discount = ctx.createdDiscount as DiscountProps;
    expect(typeof discount.code).toBe('string');
    expect(discount.code.length).toBeGreaterThan(0);
  });

  rt.step(/the created discount has maxUses equal to (\d+)/, (m, ctx) => {
    const expected = parseInt(m[1], 10);
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.maxUses).toBe(expected);
  });

  rt.step(/the created discount has isSpecial equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.isSpecial).toBe(expected);
  });

  rt.step(/the created discount has targetClientId equal to "([^"]+)"/, (m, ctx) => {
    const expected = m[1];
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.targetClientId).toBe(expected);
  });

  rt.step(/the created discount has needsApproval equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.needsApproval).toBe(expected);
  });

  rt.step(/the created discount has isActive equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect(discount.isActive).toBe(expected);
  });

  rt.step(/the admin attempts to create a special coupon without a targetClientId/, async (_m, ctx) => {
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    try {
      ctx.createdDiscount = await uc.execute(
        { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0 },
        'admin@test.com',
      );
      ctx.createError = null;
    } catch (err) {
      ctx.createdDiscount = null;
      ctx.createError = err;
    }
  });

  rt.step(/the request fails with error "([^"]+)"/, (m, ctx) => {
    const expectedCode = m[1];
    expect(ctx.createdDiscount).toBeNull();
    expect(ctx.createError).not.toBeNull();
    expect((ctx.createError as { code: string }).code).toBe(expectedCode);
  });

  rt.step(/an approved special coupon for client "([^"]+)" with code "([^"]+)" exists/, (m, ctx) => {
    const targetClientId = m[1];
    const code = m[2];
    const discount = makeSpecialDiscount({ targetClientId, code, isActive: true, needsApproval: false });
    const repo = buildDiscountRepo(discount);
    ctx.validateUseCase = new ValidateDiscountUseCase(repo as never);
  });

  rt.step(/an approved special coupon for client "([^"]+)" with code "([^"]+)" has been used once/, (m, ctx) => {
    const targetClientId = m[1];
    const code = m[2];
    const discount = makeSpecialDiscount({ targetClientId, code, isActive: true, needsApproval: false, usedCount: 1 });
    const repo = buildDiscountRepo(discount);
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
    const discount = makeSpecialDiscount({ targetClientId: 'client-abc', code: 'SPEC-LIST1', isActive: true });
    const repo = buildDiscountRepo(discount);
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
