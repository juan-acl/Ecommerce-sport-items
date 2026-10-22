import { describe, it, expect } from 'vitest';
import { discountCodeSchema } from '../schemas';

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
