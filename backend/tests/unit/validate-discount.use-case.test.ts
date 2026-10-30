import { ValidateDiscountUseCase } from '@modules/discounts/application/use-cases/validate-discount.use-case';
import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';
import type { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';
import { DiscountNotApplicableException, DiscountPendingApprovalException } from '@modules/discounts/domain/exceptions/discount.exceptions';

const activeDiscount = (overrides: Partial<DiscountProps> = {}): Discount =>
  new Discount({
    id: 'disc-1',
    code: 'RUNNING10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: true,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    ...overrides,
  });

const makeRepo = (
  discount: Discount | null,
  hasUsed = false,
): DiscountRepository => ({
  findByCode: jest.fn().mockResolvedValue(discount),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  hasUserUsedDiscount: jest.fn().mockResolvedValue(hasUsed),
  recordUserUsage: jest.fn().mockResolvedValue(undefined),
  incrementUsedCount: jest.fn().mockResolvedValue(undefined),
  listAll: jest.fn(),
  setActive: jest.fn(),
} as unknown as DiscountRepository);

describe('ValidateDiscountUseCase — cartCategories', () => {
  // TC-UC-01
  it('TC-UC-01: acepta descuento global sin cartCategories', async () => {
    const repo = makeRepo(activeDiscount());
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(useCase.execute({ code: 'RUNNING10', orderTotal: 100 })).resolves.toMatchObject({
      code: 'RUNNING10',
    });
  });

  // TC-UC-02
  it('TC-UC-02: acepta descuento cuando cartCategories coincide con applicableCategories', async () => {
    const repo = makeRepo(activeDiscount({ applicableCategories: ['running'] }));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, cartCategories: ['running', 'football'] }),
    ).resolves.toMatchObject({ code: 'RUNNING10' });
  });

  // TC-UC-03
  it('TC-UC-03: rechaza descuento cuando cartCategories no coincide con applicableCategories', async () => {
    const repo = makeRepo(activeDiscount({ applicableCategories: ['running'] }));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, cartCategories: ['swimming'] }),
    ).rejects.toThrow('Este descuento no aplica para los productos en tu carrito');
  });
});

describe('ValidateDiscountUseCase — category subtotal', () => {
  // TC-UC-07
  it('TC-UC-07: discountAmount se calcula sobre el subtotal de la categoría aplicable, no el total del carrito', async () => {
    const repo = makeRepo(activeDiscount({ applicableCategories: ['running'], value: 10, type: 'percentage' }));
    const useCase = new ValidateDiscountUseCase(repo);
    const result = await useCase.execute({
      code: 'RUNNING10',
      orderTotal: 400,
      cartCategories: ['running', 'basketball'],
      cartItems: [
        { category: 'running', unitPrice: 300, quantity: 1 },
        { category: 'basketball', unitPrice: 100, quantity: 1 },
      ],
    });
    // 10% of $300 (running only) = $30, not $40 (10% of $400)
    expect(result.discountAmount).toBe(30);
    expect(result.finalTotal).toBe(370);
  });

  // TC-UC-08
  it('TC-UC-08: descuento global sin applicableCategories aplica sobre el total completo', async () => {
    const repo = makeRepo(activeDiscount({ value: 10, type: 'percentage' }));
    const useCase = new ValidateDiscountUseCase(repo);
    const result = await useCase.execute({
      code: 'RUNNING10',
      orderTotal: 400,
      cartItems: [
        { category: 'running', unitPrice: 300, quantity: 1 },
        { category: 'basketball', unitPrice: 100, quantity: 1 },
      ],
    });
    expect(result.discountAmount).toBe(40);
    expect(result.finalTotal).toBe(360);
  });
});

describe('ValidateDiscountUseCase — client-specific coupon', () => {
  // TC-CC-01
  it('TC-CC-01: acepta cupón específico cuando targetClientId coincide con userId', async () => {
    const repo = makeRepo(activeDiscount({ targetClientId: 'client-123' } as Partial<DiscountProps>));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'client-123' }),
    ).resolves.toMatchObject({ code: 'RUNNING10' });
  });

  // TC-CC-02
  it('TC-CC-02: rechaza cupón específico cuando targetClientId no coincide con userId', async () => {
    const repo = makeRepo(activeDiscount({ targetClientId: 'client-123' } as Partial<DiscountProps>));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'client-456' }),
    ).rejects.toBeInstanceOf(DiscountNotApplicableException);
  });

  // TC-CC-03
  it('TC-CC-03: acepta cupón global (targetClientId=null) por cualquier userId', async () => {
    const repo = makeRepo(activeDiscount({ targetClientId: null } as Partial<DiscountProps>));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'client-999' }),
    ).resolves.toMatchObject({ code: 'RUNNING10' });
  });
});

describe('ValidateDiscountUseCase — per-user usage', () => {
  // TC-UC-04
  it('TC-UC-04: rechaza descuento cuando el usuario ya lo utilizó', async () => {
    const repo = makeRepo(activeDiscount(), true);
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'user-1' }),
    ).rejects.toThrow('Ya utilizaste este código de descuento');
  });

  // TC-UC-05
  it('TC-UC-05: acepta descuento cuando el usuario no lo ha utilizado', async () => {
    const repo = makeRepo(activeDiscount(), false);
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'user-1' }),
    ).resolves.toMatchObject({ code: 'RUNNING10' });
  });

  // TC-UC-06
  it('TC-UC-06: omite verificación de uso si no se proporciona userId', async () => {
    const repo = makeRepo(activeDiscount(), true);
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100 }),
    ).resolves.toMatchObject({ code: 'RUNNING10' });
    expect(repo.hasUserUsedDiscount).not.toHaveBeenCalled();
  });
});

describe('ValidateDiscountUseCase — pending approval', () => {
  // TC-PA-01
  it('TC-PA-01: cupón pendiente de aprobación lanza DiscountPendingApprovalException para cualquier cliente', async () => {
    const repo = makeRepo(activeDiscount({ isActive: false, needsApproval: true, targetClientId: 'client-123' } as Partial<DiscountProps>));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'client-999' }),
    ).rejects.toBeInstanceOf(DiscountPendingApprovalException);
  });

  // TC-PA-02
  it('TC-PA-02: cupón pendiente de aprobación lanza DiscountPendingApprovalException incluso para el cliente objetivo', async () => {
    const repo = makeRepo(activeDiscount({ isActive: false, needsApproval: true, targetClientId: 'client-123' } as Partial<DiscountProps>));
    const useCase = new ValidateDiscountUseCase(repo);
    await expect(
      useCase.execute({ code: 'RUNNING10', orderTotal: 100, userId: 'client-123' }),
    ).rejects.toBeInstanceOf(DiscountPendingApprovalException);
  });
});
