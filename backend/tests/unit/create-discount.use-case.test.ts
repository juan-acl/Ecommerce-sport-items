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
