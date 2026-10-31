import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import { ToggleDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/toggle-discount.use-case';
import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';
import { buildDiscountRepo } from '../helpers/discount-repo-builders';

function buildToggleMockRepo(discount: Discount) {
  return {
    findById: async () => discount,
    setActive: async () => undefined,
    findByCode: async () => null,
    save: async () => undefined,
    listAll: async () => ({ items: [], nextCursor: undefined, count: 0 }),
    approve: async () => undefined,
    incrementUsedCount: async () => undefined,
    hasUserUsedDiscount: async () => false,
    recordUserUsage: async () => undefined,
  };
}

function makeDiscount(props: Partial<DiscountProps>): Discount {
  return new Discount({
    id: 'disc-1',
    code: 'TEST20',
    type: 'percentage',
    value: 25,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: true,
    needsApproval: false,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    ...props,
  });
}

export function registerDiscountsNoApprovalSteps(rt: AcceptanceRuntime): void {
  rt.step(/the admin API client is initialized/, (_m, ctx) => {
    ctx.createRepo = buildDiscountRepo();
    ctx.createUseCase = new CreateDiscountUseCase(ctx.createRepo as never);
  });

  rt.step(/the admin creates a global percentage discount with value (\d+)/, async (m, ctx) => {
    const value = parseInt(m[1], 10);
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.createdDiscount = await uc.execute(
      { code: `DISC${value}`, type: 'percentage', value, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
  });

  rt.step(/the created discount has isActive equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect([11, 50, 100]).toContain(discount.value);
    expect(discount.isActive).toBe(expected);
  });

  rt.step(/the created discount has needsApproval equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect([11, 50, 100]).toContain(discount.value);
    expect(discount.needsApproval).toBe(expected);
  });

  rt.step(/a global percentage discount with value (\d+) exists and is (active|inactive)/, (m, ctx) => {
    const value = parseInt(m[1], 10);
    const isActive = m[2] === 'active';
    ctx.existingDiscount = makeDiscount({ value, isActive, needsApproval: false });
    ctx.toggleRepo = buildToggleMockRepo(ctx.existingDiscount as Discount);
    ctx.toggleUseCase = new ToggleDiscountUseCase(ctx.toggleRepo as never);
  });

  rt.step(/the admin toggles the discount (active|inactive)/, async (_m, ctx) => {
    const uc = ctx.toggleUseCase as ToggleDiscountUseCase;
    ctx.toggledDiscount = await uc.execute('disc-1');
  });

  rt.step(/the discount has isActive equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.toggledDiscount as DiscountProps;
    expect(discount.isActive).toBe(expected);
  });
}
