import { Discount, DiscountProps } from '@modules/discounts/domain/entities/discount.entity';

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
