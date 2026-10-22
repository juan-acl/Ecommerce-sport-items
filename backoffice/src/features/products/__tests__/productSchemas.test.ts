import { describe, it, expect } from 'vitest';
import { createProductSchema, editProductSchema } from '../schemas';

describe('createProductSchema – price', () => {
  const base = {
    name: 'Zapatillas Running',
    category: 'running' as const,
    description: 'Descripción del producto de prueba con texto suficiente',
    imageUrl: '',
  };

  it('rejects non-numeric price with custom message', () => {
    const result = createProductSchema.safeParse({ ...base, price: 'caro' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('price'));
      expect(issue?.message).toBe('El precio debe ser un número');
    }
  });

  it('rejects price of zero', () => {
    const result = createProductSchema.safeParse({ ...base, price: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = createProductSchema.safeParse({ ...base, price: -1 });
    expect(result.success).toBe(false);
  });

  it('accepts valid price', () => {
    const result = createProductSchema.safeParse({ ...base, price: 99.99 });
    expect(result.success).toBe(true);
  });
});

describe('editProductSchema – minStock', () => {
  const base = {
    name: 'Zapatillas Running',
    category: 'running' as const,
    price: 99.99,
    description: 'Descripción del producto de prueba con texto suficiente',
    imageUrl: '',
  };

  it('rejects non-numeric minStock with custom message', () => {
    const result = editProductSchema.safeParse({ ...base, minStock: 'varios' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('minStock'));
      expect(issue?.message).toBe('El stock mínimo debe ser un número');
    }
  });

  it('rejects negative minStock', () => {
    const result = editProductSchema.safeParse({ ...base, minStock: -1 });
    expect(result.success).toBe(false);
  });

  it('accepts zero minStock', () => {
    const result = editProductSchema.safeParse({ ...base, minStock: 0 });
    expect(result.success).toBe(true);
  });
});

describe('createProductSchema – name', () => {
  const base = {
    category: 'running' as const,
    price: 99.99,
    description: 'Descripción del producto de prueba con texto suficiente',
    imageUrl: '',
  };

  it('rejects name with forbidden characters', () => {
    const result = createProductSchema.safeParse({ ...base, name: 'Zapato <script>' });
    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = createProductSchema.safeParse({ ...base, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('accepts alphanumeric name with basic signs', () => {
    const result = createProductSchema.safeParse({ ...base, name: 'Zapatos Running Pro 2024' });
    expect(result.success).toBe(true);
  });
});
