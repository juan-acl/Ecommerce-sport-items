import { describe, it, expect } from 'vitest';
import { computeOrderSummary } from '../utils/orderDetailHelpers';

describe('computeOrderSummary', () => {
  it('returns subtotal and total from the order', () => {
    const result = computeOrderSummary({ subtotal: 500, total: 500, discountCode: undefined, discountAmount: undefined });
    expect(result.subtotal).toBe(500);
    expect(result.total).toBe(500);
  });

  it('hasDiscount is false when no discount code is present', () => {
    const result = computeOrderSummary({ subtotal: 300, total: 300, discountCode: undefined, discountAmount: undefined });
    expect(result.hasDiscount).toBe(false);
    expect(result.discountCode).toBeNull();
    expect(result.discountAmount).toBe(0);
  });

  it('hasDiscount is true when discount code and positive amount are present', () => {
    const result = computeOrderSummary({ subtotal: 400, total: 360, discountCode: 'SAVE40', discountAmount: 40 });
    expect(result.hasDiscount).toBe(true);
    expect(result.discountCode).toBe('SAVE40');
    expect(result.discountAmount).toBe(40);
    expect(result.total).toBe(360);
  });

  it('hasDiscount is false when discountAmount is 0 even if code is present', () => {
    const result = computeOrderSummary({ subtotal: 200, total: 200, discountCode: 'ZERO', discountAmount: 0 });
    expect(result.hasDiscount).toBe(false);
  });

  it('discountAmount defaults to 0 when undefined', () => {
    const result = computeOrderSummary({ subtotal: 100, total: 100, discountCode: undefined, discountAmount: undefined });
    expect(result.discountAmount).toBe(0);
  });
});
