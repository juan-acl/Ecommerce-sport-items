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

  it('rejects negative value', () => {
    expect(discountSchema.safeParse({ ...base, value: -5 }).success).toBe(false);
  });

  it('rejects negative minPurchase', () => {
    expect(discountSchema.safeParse({ ...base, minPurchase: -1 }).success).toBe(false);
  });

  it('rejects negative maxUses', () => {
    expect(discountSchema.safeParse({ ...base, maxUses: -1 }).success).toBe(false);
  });

  it('rejects percentage value above 100', () => {
    expect(discountSchema.safeParse({ ...base, type: 'percentage', value: 101 }).success).toBe(false);
  });

  it('rejects percentage value of 0', () => {
    expect(discountSchema.safeParse({ ...base, type: 'percentage', value: 0 }).success).toBe(false);
  });

  it('rejects fixed value above 9999.99', () => {
    expect(discountSchema.safeParse({ ...base, type: 'fixed', value: 10000 }).success).toBe(false);
  });

  it('rejects minPurchase above 999999.99', () => {
    expect(discountSchema.safeParse({ ...base, minPurchase: 1000000 }).success).toBe(false);
  });

  it('accepts valid percentage discount', () => {
    expect(discountSchema.safeParse({ ...base, type: 'percentage', value: 50 }).success).toBe(true);
  });

  it('accepts valid fixed discount', () => {
    expect(discountSchema.safeParse({ ...base, type: 'fixed', value: 25.5 }).success).toBe(true);
  });

  it('rejects fixed value below minimum (0.001)', () => {
    expect(discountSchema.safeParse({ ...base, type: 'fixed', value: 0.001 }).success).toBe(false);
  });

  it('accepts fixed value at minimum boundary (0.01)', () => {
    expect(discountSchema.safeParse({ ...base, type: 'fixed', value: 0.01 }).success).toBe(true);
  });
});

describe('discountSchema – expiresAt field', () => {
  const base = {
    code: 'TEST10',
    type: 'percentage' as const,
    value: 10,
    minPurchase: 0,
    maxUses: 0,
  };

  it('accepts empty string (no expiry)', () => {
    expect(discountSchema.safeParse({ ...base, expiresAt: '' }).success).toBe(true);
  });

  it('accepts undefined (no expiry)', () => {
    expect(discountSchema.safeParse({ ...base }).success).toBe(true);
  });

  it('rejects a past date', () => {
    const result = discountSchema.safeParse({ ...base, expiresAt: '2020-01-01' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('expiresAt'));
      expect(issue?.message).toBe('La fecha de expiración debe ser en el futuro');
    }
  });

  it('rejects an invalid date string', () => {
    const result = discountSchema.safeParse({ ...base, expiresAt: 'not-a-date' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('expiresAt'));
      expect(issue?.message).toBeDefined();
    }
  });

  it('accepts a future date', () => {
    expect(discountSchema.safeParse({ ...base, expiresAt: '2099-12-31' }).success).toBe(true);
  });
});
