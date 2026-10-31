import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';

export function buildDiscountRepo(existingDiscount?: Discount) {
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

export function buildApproveRepo(existingDiscount: Discount) {
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
