import { describe, it, expect } from 'vitest';
import { itemSchema } from '../schemas';

describe('purchase itemSchema – quantity', () => {
  it('rejects non-numeric quantity with custom message', () => {
    const result = itemSchema.safeParse({
      productId: 'p1',
      productName: 'Zapatos',
      quantity: 'abc',
      unitCost: 10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('quantity'));
      expect(issue?.message).toBe('Ingresa una cantidad válida');
    }
  });

  it('rejects non-numeric unitCost with custom message', () => {
    const result = itemSchema.safeParse({
      productId: 'p1',
      productName: 'Zapatos',
      quantity: 1,
      unitCost: 'caro',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('unitCost'));
      expect(issue?.message).toBe('Ingresa un costo válido');
    }
  });

  it('accepts valid item', () => {
    const result = itemSchema.safeParse({
      productId: 'p1',
      productName: 'Zapatos',
      quantity: 3,
      unitCost: 150.5,
    });
    expect(result.success).toBe(true);
  });
});
