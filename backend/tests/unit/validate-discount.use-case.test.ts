import { ValidateDiscountUseCase } from '@modules/discounts/application/use-cases/validate-discount.use-case';
import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';
import type { DiscountRepository } from '@modules/discounts/domain/repositories/discount.repository';

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
