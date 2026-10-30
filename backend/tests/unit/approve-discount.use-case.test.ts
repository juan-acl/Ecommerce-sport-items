import { ApproveDiscountUseCase } from '@modules/discounts/application/use-cases/approve-discount.use-case';
import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';

function makeDiscount(overrides: Partial<DiscountProps> = {}): Discount {
  return new Discount({
    id: 'disc-1',
    code: 'BIG20',
    type: 'percentage',
    value: 20,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: false,
    needsApproval: true,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    ...overrides,
  });
}

const mockRepo = {
  findById: jest.fn(),
  approve: jest.fn().mockResolvedValue(undefined),
};

function buildUseCase() {
  return new ApproveDiscountUseCase(mockRepo as never);
}

beforeEach(() => jest.clearAllMocks());

describe('ApproveDiscountUseCase', () => {
  // TC-AD-01
  it('TC-AD-01: aprobar descuento pendiente llama al repo con los datos correctos', async () => {
    mockRepo.findById.mockResolvedValue(makeDiscount());
    const result = await buildUseCase().execute({
      id: 'disc-1',
      approvedBy: 'supervisor@test.com',
      approvalReason: 'Campaña de verano autorizada por gerencia',
    });
    expect(result.isActive).toBe(true);
    expect(result.approvedBy).toBe('supervisor@test.com');
    expect(result.approvalReason).toBe('Campaña de verano autorizada por gerencia');
    expect(mockRepo.approve).toHaveBeenCalledWith(
      'disc-1',
      'supervisor@test.com',
      'Campaña de verano autorizada por gerencia',
    );
  });

  // TC-AD-02
  it('TC-AD-02: aprobar descuento que no necesita aprobación lanza error', async () => {
    mockRepo.findById.mockResolvedValue(makeDiscount({ needsApproval: false, isActive: true }));
    await expect(
      buildUseCase().execute({ id: 'disc-1', approvedBy: 'sup@test.com', approvalReason: 'reason' }),
    ).rejects.toThrow();
  });

  // TC-AD-03
  it('TC-AD-03: descuento no encontrado lanza error', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(
      buildUseCase().execute({ id: 'missing', approvedBy: 'sup@test.com', approvalReason: 'reason' }),
    ).rejects.toThrow();
  });

  // TC-AD-04
  it('TC-AD-04: aprobar cupón limpia needsApproval', async () => {
    mockRepo.findById.mockResolvedValue(makeDiscount());
    const result = await buildUseCase().execute({
      id: 'disc-1',
      approvedBy: 'supervisor@test.com',
      approvalReason: 'Cupón VIP autorizado',
    });
    expect(result.isActive).toBe(true);
    expect(result.needsApproval).toBe(false);
  });
});
