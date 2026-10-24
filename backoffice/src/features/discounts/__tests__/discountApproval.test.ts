import { describe, it, expect } from 'vitest';
import { isPendingApproval } from '../utils/discountApprovalHelpers';
import type { Discount } from '@shared/types/common';

function makeDiscount(overrides: Partial<Discount> = {}): Discount {
  return {
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
    needsApproval: true,
    ...overrides,
  };
}

describe('isPendingApproval', () => {
  it('returns true when needsApproval=true and isActive=false', () => {
    expect(isPendingApproval(makeDiscount({ needsApproval: true, isActive: false }))).toBe(true);
  });

  it('returns false when discount is already active', () => {
    expect(isPendingApproval(makeDiscount({ needsApproval: true, isActive: true }))).toBe(false);
  });

  it('returns false when needsApproval is false', () => {
    expect(isPendingApproval(makeDiscount({ needsApproval: false, isActive: false }))).toBe(false);
  });

  it('returns false when needsApproval is undefined', () => {
    expect(isPendingApproval(makeDiscount({ needsApproval: undefined, isActive: false }))).toBe(false);
  });
});
