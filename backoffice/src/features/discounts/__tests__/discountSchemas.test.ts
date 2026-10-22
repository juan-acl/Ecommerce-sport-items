import { describe, it, expect } from 'vitest';
import { discountCodeSchema, discountSchema } from '../schemas';

describe('discountCodeSchema', () => {
  it('transforms lowercase input to uppercase', () => {
    const result = discountCodeSchema.safeParse('deporte20');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('DEPORTE20');
    }
  });

  it('accepts already-uppercase code', () => {
    const result = discountCodeSchema.safeParse('SUMMER10');
    expect(result.success).toBe(true);
  });

  it('rejects code shorter than 3 characters', () => {
    const result = discountCodeSchema.safeParse('AB');
    expect(result.success).toBe(false);
  });

  it('rejects code with special characters', () => {
    const result = discountCodeSchema.safeParse('CODIGO@20');
    expect(result.success).toBe(false);
  });

  it('rejects empty string', () => {
    const result = discountCodeSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

describe('discountSchema – numeric fields', () => {
  const base = {
    code: 'TEST10',
    type: 'percentage' as const,
    value: 10,
    minPurchase: 0,
    maxUses: 0,
  };

  it('rejects non-numeric value with custom message', () => {
    const result = discountSchema.safeParse({ ...base, value: 'abc' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('value'));
      expect(issue?.message).toBe('Ingresa un valor válido');
    }
  });

  it('rejects non-numeric minPurchase with custom message', () => {
    const result = discountSchema.safeParse({ ...base, minPurchase: 'gratis' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('minPurchase'));
      expect(issue?.message).toBe('Ingresa un valor válido');
    }
  });

  it('rejects non-numeric maxUses with custom message', () => {
    const result = discountSchema.safeParse({ ...base, maxUses: 'ilimitado' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('maxUses'));
      expect(issue?.message).toBe('Ingresa un número válido');
    }
  });
});
