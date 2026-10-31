import { Discount, DiscountProps, computeEffectiveSubtotal } from '@modules/discounts/domain/entities/discount.entity';

const baseProps: DiscountProps = {
  id: 'disc-1',
  code: 'DEPORTE20',
  type: 'percentage',
  value: 20,
  minPurchase: 0,
  maxUses: 0,
  usedCount: 0,
  isActive: true,
  expiresAt: null,
  createdAt: new Date().toISOString(),
  createdBy: 'admin@test.com',
};

describe('Discount entity — isValid()', () => {
  // TC-01
  it('TC-01: descuento activo y sin restricciones es válido', () => {
    const discount = new Discount(baseProps);
    expect(discount.isValid(100)).toBe(true);
  });

  // TC-02
  it('TC-02: descuento inactivo no es válido', () => {
    const discount = new Discount({ ...baseProps, isActive: false });
    expect(discount.isValid(100)).toBe(false);
  });

  // TC-03
  it('TC-03: descuento expirado no es válido', () => {
    const discount = new Discount({
      ...baseProps,
      expiresAt: '2020-01-01T00:00:00.000Z',
    });
    expect(discount.isValid(100)).toBe(false);
  });

  // TC-04
  it('TC-04: descuento con fecha futura sí es válido', () => {
    const discount = new Discount({
      ...baseProps,
      expiresAt: '2099-01-01T00:00:00.000Z',
    });
    expect(discount.isValid(100)).toBe(true);
  });

  // TC-05
  it('TC-05: descuento que superó el límite de usos no es válido', () => {
    const discount = new Discount({ ...baseProps, maxUses: 5, usedCount: 5 });
    expect(discount.isValid(100)).toBe(false);
  });

  // TC-06
  it('TC-06: descuento con maxUses=0 (ilimitado) siempre válido en usos', () => {
    const discount = new Discount({ ...baseProps, maxUses: 0, usedCount: 9999 });
    expect(discount.isValid(100)).toBe(true);
  });

  // TC-07
  it('TC-07: descuento con compra mínima no cumplida no es válido', () => {
    const discount = new Discount({ ...baseProps, minPurchase: 200 });
    expect(discount.isValid(150)).toBe(false);
  });

  // TC-08
  it('TC-08: descuento con compra mínima exactamente cumplida es válido', () => {
    const discount = new Discount({ ...baseProps, minPurchase: 150 });
    expect(discount.isValid(150)).toBe(true);
  });
});

describe('Discount entity — calculateDiscount()', () => {
  // TC-09
  it('TC-09: descuento porcentual calcula correctamente', () => {
    const discount = new Discount({ ...baseProps, type: 'percentage', value: 20 });
    expect(discount.calculateDiscount(250)).toBe(50);
  });

  // TC-10
  it('TC-10: descuento fijo devuelve el valor exacto cuando subtotal es mayor', () => {
    const discount = new Discount({ ...baseProps, type: 'fixed', value: 50 });
    expect(discount.calculateDiscount(200)).toBe(50);
  });

  // TC-11
  it('TC-11: descuento fijo no excede el subtotal', () => {
    const discount = new Discount({ ...baseProps, type: 'fixed', value: 300 });
    expect(discount.calculateDiscount(100)).toBe(100);
  });

  // TC-12
  it('TC-12: descuento porcentual del 100% resulta en subtotal completo', () => {
    const discount = new Discount({ ...baseProps, type: 'percentage', value: 100 });
    expect(discount.calculateDiscount(500)).toBe(500);
  });
});

describe('Discount entity — applicableCategories', () => {
  const scopedProps: DiscountProps = {
    ...baseProps,
    applicableCategories: ['running', 'football'],
  };

  // TC-13
  it('TC-13: descuento con categoria aplicable válida para items del carrito', () => {
    const discount = new Discount(scopedProps);
    expect(discount.isValid(100, ['running'])).toBe(true);
  });

  // TC-14
  it('TC-14: descuento sin categoría coincidente en el carrito no es válido', () => {
    const discount = new Discount(scopedProps);
    expect(discount.isValid(100, ['swimming', 'cycling'])).toBe(false);
  });

  // TC-15
  it('TC-15: descuento con applicableCategories omite validación si cartCategories no se pasa', () => {
    const discount = new Discount(scopedProps);
    expect(discount.isValid(100)).toBe(true);
  });

  // TC-16
  it('TC-16: descuento sin applicableCategories acepta cualquier carrito', () => {
    const discount = new Discount(baseProps);
    expect(discount.isValid(100, ['swimming', 'cycling'])).toBe(true);
  });
});

describe('Discount entity — isSpecial', () => {
  // TC-SP-01
  it('TC-SP-01: isSpecial=true forces maxUses to 1', () => {
    const discount = Discount.create({
      id: 'sp-1',
      code: 'SPEC-ABC',
      type: 'percentage',
      value: 15,
      minPurchase: 0,
      maxUses: 0,
      expiresAt: null,
      applicableCategories: [],
      targetClientId: 'client-123',
      isSpecial: true,
      createdBy: 'admin@test.com',
      createdAt: new Date().toISOString(),
    });
    expect(discount.maxUses).toBe(1);
  });

  // TC-SP-02
  it('TC-SP-02: isSpecial=true sets isSpecial getter to true', () => {
    const discount = Discount.create({
      id: 'sp-2',
      code: 'SPEC-DEF',
      type: 'percentage',
      value: 15,
      minPurchase: 0,
      maxUses: 0,
      expiresAt: null,
      applicableCategories: [],
      targetClientId: 'client-123',
      isSpecial: true,
      createdBy: 'admin@test.com',
      createdAt: new Date().toISOString(),
    });
    expect(discount.isSpecial).toBe(true);
  });

  // TC-SP-03
  it('TC-SP-03: isSpecial not set defaults to false on getter', () => {
    const discount = Discount.create({
      id: 'sp-3',
      code: 'REGULAR',
      type: 'percentage',
      value: 15,
      minPurchase: 0,
      maxUses: 5,
      expiresAt: null,
      applicableCategories: [],
      targetClientId: null,
      createdBy: 'admin@test.com',
      createdAt: new Date().toISOString(),
    });
    expect(discount.isSpecial).toBe(false);
    expect(discount.maxUses).toBe(5);
  });

  // TC-SP-04
  it('TC-SP-04: special coupon used once is no longer valid', () => {
    const discount = new Discount({
      ...baseProps,
      maxUses: 1,
      usedCount: 1,
      isActive: true,
      isSpecial: true,
      targetClientId: 'client-123',
    });
    expect(discount.isValid(100)).toBe(false);
  });
});

describe('computeEffectiveSubtotal()', () => {
  const items = [
    { category: 'running', unitPrice: 300, quantity: 1 },
    { category: 'basketball', unitPrice: 100, quantity: 2 },
  ];

  // TC-20
  it('TC-20: categorías vacías devuelven el fallback', () => {
    expect(computeEffectiveSubtotal([], items, 500)).toBe(500);
  });

  // TC-21
  it('TC-21: items vacíos devuelven el fallback', () => {
    expect(computeEffectiveSubtotal(['running'], [], 500)).toBe(500);
  });

  // TC-22
  it('TC-22: suma solo los items de las categorías aplicables', () => {
    expect(computeEffectiveSubtotal(['running'], items, 500)).toBe(300);
  });

  // TC-23
  it('TC-23: ningún item coincide con la categoría — devuelve 0', () => {
    expect(computeEffectiveSubtotal(['cycling'], items, 500)).toBe(0);
  });

  // TC-24
  it('TC-24: múltiples categorías suman los items de todas ellas', () => {
    expect(computeEffectiveSubtotal(['running', 'basketball'], items, 500)).toBe(500);
  });
});
