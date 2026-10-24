import { ToggleDiscountUseCase } from '@modules/discounts/application/use-cases/toggle-discount.use-case';
import { Discount } from '@modules/discounts/domain/entities/discount.entity';
import { DiscountInvalidException } from '@modules/discounts/domain/exceptions/discount.exceptions';

function makeDiscount(overrides: Partial<ConstructorParameters<typeof Discount>[0]> = {}) {
  return new Discount({
    id: 'disc-1',
    code: 'BIG20',
    type: 'percentage',
    value: 20,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 0,
    isActive: false,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@test.com',
    needsApproval: false,
    ...overrides,
  });
}

const mockRepo = {
  findById: jest.fn(),
  setActive: jest.fn().mockResolvedValue(undefined),
};

function buildUseCase() {
  return new ToggleDiscountUseCase(mockRepo as never);
}

beforeEach(() => jest.clearAllMocks());

describe('ToggleDiscountUseCase', () => {
  it('TC-TG-01: toggles an active discount to inactive', async () => {
    mockRepo.findById.mockResolvedValue(makeDiscount({ isActive: true }));
    const result = await buildUseCase().execute('disc-1');
    expect(result.isActive).toBe(false);
    expect(mockRepo.setActive).toHaveBeenCalledWith('disc-1', false);
  });

  it('TC-TG-02: toggles an inactive approved discount to active', async () => {
    mockRepo.findById.mockResolvedValue(
      makeDiscount({ isActive: false, needsApproval: true, approvedBy: 'admin@test.com', approvalReason: 'ok' }),
    );
    const result = await buildUseCase().execute('disc-1');
    expect(result.isActive).toBe(true);
  });

  it('TC-TG-03: rejects toggle-activate on unapproved needsApproval discount', async () => {
    mockRepo.findById.mockResolvedValue(
      makeDiscount({ isActive: false, needsApproval: true, approvedBy: undefined }),
    );
    await expect(buildUseCase().execute('disc-1')).rejects.toBeInstanceOf(DiscountInvalidException);
    expect(mockRepo.setActive).not.toHaveBeenCalled();
  });
});
