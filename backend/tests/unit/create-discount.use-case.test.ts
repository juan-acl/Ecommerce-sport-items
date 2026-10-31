jest.mock('uuid', () => ({ v4: () => 'disc-test-uuid' }));

import { CreateDiscountUseCase } from '@modules/discounts/application/use-cases/create-discount.use-case';

const mockRepo = {
  findByCode: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue(undefined),
};

function buildUseCase() {
  return new CreateDiscountUseCase(mockRepo as never);
}

beforeEach(() => jest.clearAllMocks());

describe('CreateDiscountUseCase — approval requirement', () => {
  // TC-CD-01
  it('TC-CD-01: descuento porcentual >10% se crea activo sin needsApproval', async () => {
    const result = await buildUseCase().execute(
      { code: 'BIG20', type: 'percentage', value: 20, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
  });

  // TC-CD-02
  it('TC-CD-02: descuento porcentual exactamente 10% se crea activo sin needsApproval', async () => {
    const result = await buildUseCase().execute(
      { code: 'SAVE10', type: 'percentage', value: 10, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
  });

  // TC-CD-03
  it('TC-CD-03: descuento fijo se crea activo sin importar el valor', async () => {
    const result = await buildUseCase().execute(
      { code: 'FIXED500', type: 'fixed', value: 500, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
  });

  // TC-CD-04
  it('TC-CD-04: descuento porcentual <10% se crea activo sin needsApproval', async () => {
    const result = await buildUseCase().execute(
      { code: 'SMALL5', type: 'percentage', value: 5, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
  });
});

describe('CreateDiscountUseCase — client-specific coupon approval', () => {
  // TC-CD-05
  it('TC-CD-05: cupón con targetClientId se crea inactivo y requiere aprobación', async () => {
    const result = await buildUseCase().execute(
      { code: 'VIP10', type: 'percentage', value: 10, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.isActive).toBe(false);
    expect(result.needsApproval).toBe(true);
    expect(result.targetClientId).toBe('client-123');
  });

  // TC-CD-07
  it('TC-CD-07: cupón con targetClientId y porcentaje >10% se crea activo sin needsApproval', async () => {
    const result = await buildUseCase().execute(
      { code: 'VIP11', type: 'percentage', value: 11, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
    expect(result.targetClientId).toBe('client-123');
  });

  // TC-CD-06
  it('TC-CD-06: cupón global (sin targetClientId) se crea activo sin needsApproval', async () => {
    const result = await buildUseCase().execute(
      { code: 'GLOBAL10', type: 'percentage', value: 10, minPurchase: 0, maxUses: 0 },
      'admin@test.com',
    );
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
    expect(result.targetClientId).toBeNull();
  });
});

describe('CreateDiscountUseCase — conflict guard', () => {
  // TC-CD-14
  it('TC-CD-14: lanza ConflictException si el código generado ya existe y está activo', async () => {
    const { Discount } = await import('@modules/discounts/domain/entities/discount.entity');
    const active = new Discount({
      id: 'existing-1',
      code: 'SPEC-DISC-TES',
      type: 'percentage',
      value: 15,
      minPurchase: 0,
      maxUses: 1,
      usedCount: 0,
      isActive: true,
      needsApproval: false,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@test.com',
      isSpecial: true,
    });
    mockRepo.findByCode.mockResolvedValueOnce(active);
    await expect(
      buildUseCase().execute(
        { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
        'admin@test.com',
      ),
    ).rejects.toMatchObject({ message: expect.stringContaining('SPEC-DISC-TES') });
  });
});

describe('CreateDiscountUseCase — special coupons', () => {
  // TC-CD-08
  it('TC-CD-08: cupón especial sin targetClientId lanza SPECIAL_COUPON_REQUIRES_CLIENT', async () => {
    await expect(
      buildUseCase().execute(
        { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0 },
        'admin@test.com',
      ),
    ).rejects.toMatchObject({ code: 'SPECIAL_COUPON_REQUIRES_CLIENT' });
  });

  // TC-CD-09
  it('TC-CD-09: cupón especial con targetClientId genera código con prefijo SPEC-', async () => {
    const result = await buildUseCase().execute(
      { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.code).toMatch(/^SPEC-/);
  });

  // TC-CD-10
  it('TC-CD-10: cupón especial fuerza maxUses=1', async () => {
    const result = await buildUseCase().execute(
      { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.maxUses).toBe(1);
  });

  // TC-CD-11
  it('TC-CD-11: cupón especial ≤10% requiere aprobación', async () => {
    const result = await buildUseCase().execute(
      { isSpecial: true, type: 'percentage', value: 10, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.needsApproval).toBe(true);
    expect(result.isActive).toBe(false);
  });

  // TC-CD-12
  it('TC-CD-12: cupón especial >10% se activa inmediatamente', async () => {
    const result = await buildUseCase().execute(
      { isSpecial: true, type: 'percentage', value: 11, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.needsApproval).toBe(false);
    expect(result.isActive).toBe(true);
  });

  // TC-CD-13
  it('TC-CD-13: cupón especial tiene isSpecial=true en el resultado', async () => {
    const result = await buildUseCase().execute(
      { isSpecial: true, type: 'percentage', value: 15, minPurchase: 0, maxUses: 0, targetClientId: 'client-123' },
      'admin@test.com',
    );
    expect(result.isSpecial).toBe(true);
  });
});
