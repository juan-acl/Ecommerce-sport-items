import type { Discount } from '@shared/types/common';

export function isPendingApproval(discount: Discount): boolean {
  return !!discount.needsApproval && !discount.isActive && !discount.approvedBy;
}
