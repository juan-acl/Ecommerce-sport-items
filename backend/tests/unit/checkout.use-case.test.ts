jest.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

import { CheckoutUseCase, CheckoutInput } from '@modules/orders/application/use-cases/checkout.use-case';
import { ORDER_STATUS } from '@modules/orders/domain/value-objects/order-status.vo';

// Mocks
const defaultCartItems = [
  { productId: 'prod-1', productName: 'Zapatos Running', unitPrice: 300, quantity: 1, imageUrl: '' },
];

const mockCart = {
  isEmpty: jest.fn().mockReturnValue(false),
  getItems: jest.fn().mockReturnValue(defaultCartItems),
};

const mockProduct = { id: 'prod-1', name: 'Zapatos Running', stock: 10 };

const mockOrderRepo = {
  executeCheckout: jest.fn().mockResolvedValue(undefined),
  listByUserId: jest.fn(),
  findByIdForUser: jest.fn(),
  findById: jest.fn(),
  listAll: jest.fn(),
  updateStatus: jest.fn(),
};

const mockCartRepo = { getByUserId: jest.fn().mockResolvedValue(mockCart) };
const mockProductRepo = { findById: jest.fn().mockResolvedValue(mockProduct) };
const mockEmailSender = { sendOrderConfirmation: jest.fn().mockResolvedValue(undefined) };
const mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
const mockMovementRepo = { save: jest.fn().mockResolvedValue(undefined) };

const baseInput: CheckoutInput = {
  userId: 'user-1',
  userEmail: 'user@test.com',
  userName: 'Test User',
  dto: { shippingAddress: undefined },
};

function buildUseCase(discountRepo?: object) {
  return new CheckoutUseCase(
    mockOrderRepo as never,
    mockCartRepo as never,
    mockProductRepo as never,
    mockEmailSender as never,
    mockLogger as never,
    mockMovementRepo as never,
    discountRepo as never ?? null,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCart.isEmpty.mockReturnValue(false);
  mockCart.getItems.mockReturnValue(defaultCartItems);
  mockOrderRepo.executeCheckout.mockResolvedValue(undefined);
  mockCartRepo.getByUserId.mockResolvedValue(mockCart);
  mockProductRepo.findById.mockResolvedValue(mockProduct);
  mockEmailSender.sendOrderConfirmation.mockResolvedValue(undefined);
  mockMovementRepo.save.mockResolvedValue(undefined);
});

describe('CheckoutUseCase', () => {
  // TC-13
  it('TC-13: checkout sin descuento crea orden en estado PAID', async () => {
    const useCase = buildUseCase();
    const result = await useCase.execute(baseInput);
    expect(result.status).toBe(ORDER_STATUS.PAID);
    expect(result.total).toBe(300);
  });

  // TC-14
  it('TC-14: checkout con total alto también crea orden en estado PAID (sin aprobación manual)', async () => {
    mockCart.getItems.mockReturnValue([
      { productId: 'prod-1', productName: 'Zapatos', unitPrice: 600, quantity: 1, imageUrl: '' },
    ]);
    const useCase = buildUseCase();
    const result = await useCase.execute(baseInput);
    expect(result.status).toBe(ORDER_STATUS.PAID);
    expect(result.total).toBe(600);
  });

  // TC-15
  it('TC-15: carrito vacío lanza EmptyCartException', async () => {
    mockCart.isEmpty.mockReturnValueOnce(true);
    const useCase = buildUseCase();
    await expect(useCase.execute(baseInput)).rejects.toThrow();
  });

  // TC-16
  it('TC-16: descuento válido se aplica y reduce el total', async () => {
    const mockDiscountRepo = {
      findByCode: jest.fn().mockResolvedValue({
        id: 'disc-1',
        code: 'SAVE50',
        isValid: () => true,
        calculateDiscount: () => 50,
      }),
      incrementUsedCount: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = buildUseCase(mockDiscountRepo);
    const result = await useCase.execute({
      ...baseInput,
      dto: { discountCode: 'SAVE50', shippingAddress: undefined },
    });

    expect(result.discountCode).toBe('SAVE50');
    expect(result.discountAmount).toBe(50);
    expect(result.total).toBe(250);
  });

  // TC-17
  it('TC-17: descuento inválido es ignorado y checkout continúa normalmente', async () => {
    const mockDiscountRepo = {
      findByCode: jest.fn().mockResolvedValue({
        id: 'disc-1',
        code: 'INVALID',
        isValid: () => false,
        calculateDiscount: () => 0,
      }),
      incrementUsedCount: jest.fn(),
    };

    const useCase = buildUseCase(mockDiscountRepo);
    const result = await useCase.execute({
      ...baseInput,
      dto: { discountCode: 'INVALID', shippingAddress: undefined },
    });

    expect(result.discountCode).toBeUndefined();
    expect(result.total).toBe(300);
    expect(result.status).toBe(ORDER_STATUS.PAID);
  });

  // TC-18
  it('TC-18: descuento con monto fijo se aplica correctamente y el estado sigue siendo PAID', async () => {
    mockCart.getItems.mockReturnValue([
      { productId: 'prod-1', productName: 'Zapatos', unitPrice: 600, quantity: 1, imageUrl: '' },
    ]);
    const mockDiscountRepo = {
      findByCode: jest.fn().mockResolvedValue({
        id: 'disc-1',
        code: 'BIG150',
        isValid: () => true,
        calculateDiscount: () => 150,
      }),
      incrementUsedCount: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = buildUseCase(mockDiscountRepo);
    const result = await useCase.execute({
      ...baseInput,
      dto: { discountCode: 'BIG150', shippingAddress: undefined },
    });

    expect(result.total).toBe(450);
    expect(result.status).toBe(ORDER_STATUS.PAID);
  });
});
