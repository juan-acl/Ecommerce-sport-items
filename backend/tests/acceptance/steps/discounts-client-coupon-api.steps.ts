import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import { ValidateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/validate-discount.use-case';
import { ApproveDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/approve-discount.use-case';
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

function buildApproveRepo(existingDiscount: Discount) {
  let current = existingDiscount;
  return {
    findByCode: async () => null,
    save: async () => undefined,
    findById: async () => current,
    listAll: async () => ({ items: [], nextCursor: undefined, count: 0 }),
    setActive: async () => undefined,
    approve: async (_id: string, approvedBy: string, approvalReason: string) => {
      current = current.withApproved(approvedBy, approvalReason);
    },
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
    isActive: props.isActive ?? true,
    needsApproval: props.needsApproval ?? false,
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

  rt.step(/the admin creates a percentage discount with targetClientId "([^"]+)" and value (\d+)/, async (m, ctx) => {
    const targetClientId = m[1];
    const value = parseInt(m[2], 10);
    const uc = ctx.createUseCase as CreateDiscountUseCase;
    ctx.createdDiscount = await uc.execute(
      { code: `VIP${value}`, type: 'percentage', value, minPurchase: 0, maxUses: 0, targetClientId },
      'admin@test.com',
    );
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

  rt.step(/the created discount has needsApproval equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect([5, 10, 11, 50, 100]).toContain(discount.value);
    expect(discount.needsApproval).toBe(expected);
  });

  rt.step(/the created discount has isActive equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.createdDiscount as DiscountProps;
    expect([5, 10, 11, 50, 100]).toContain(discount.value);
    expect(discount.isActive).toBe(expected);
  });

  rt.step(/an approved discount with targetClientId "([^"]+)" exists with code "([^"]+)"/, (m, ctx) => {
    const targetClientId = m[1];
    const code = m[2];
    ctx.existingDiscount = makeDiscount({ targetClientId, code, isActive: true, needsApproval: false });
    const repo = buildCreateRepo(ctx.existingDiscount as Discount);
    ctx.validateUseCase = new ValidateDiscountUseCase(repo as never);
  });

  rt.step(/a pending discount with targetClientId "([^"]+)" exists with code "([^"]+)"/, (m, ctx) => {
    const targetClientId = m[1];
    const code = m[2];
    ctx.existingDiscount = makeDiscount({ targetClientId, code, isActive: false, needsApproval: true });
    const repo = buildCreateRepo(ctx.existingDiscount as Discount);
    ctx.validateUseCase = new ValidateDiscountUseCase(repo as never);
  });

  rt.step(/a global discount exists with code "([^"]+)"/, (m, ctx) => {
    const code = m[1];
    ctx.existingDiscount = makeDiscount({ targetClientId: null, code, isActive: true, needsApproval: false });
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
    const discount = makeDiscount({ targetClientId: 'client-abc', isActive: true });
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

  rt.step(/a client-specific discount with code "([^"]+)" is pending approval/, (m, ctx) => {
    const code = m[1];
    ctx.pendingDiscount = makeDiscount({ code, targetClientId: 'client-123', isActive: false, needsApproval: true });
    ctx.approveRepo = buildApproveRepo(ctx.pendingDiscount as Discount);
    ctx.approveUseCase = new ApproveDiscountUseCase(ctx.approveRepo as never);
  });

  rt.step(/the admin approves the discount/, async (_m, ctx) => {
    const uc = ctx.approveUseCase as ApproveDiscountUseCase;
    ctx.approvedDiscount = await uc.execute({
      id: 'disc-1',
      approvedBy: 'admin@test.com',
      approvalReason: 'Cupón VIP aprobado',
    });
  });

  rt.step(/the discount has isActive equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.approvedDiscount as DiscountProps;
    expect(discount.isActive).toBe(expected);
  });

  rt.step(/the discount has needsApproval equal to (true|false)/, (m, ctx) => {
    const expected = m[1] === 'true';
    const discount = ctx.approvedDiscount as DiscountProps;
    expect(discount.needsApproval).toBe(expected);
  });
}
