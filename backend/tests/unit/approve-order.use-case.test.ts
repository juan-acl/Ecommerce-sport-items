jest.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

import { ApproveOrderUseCase } from '@modules/orders/application/use-cases/approve-order.use-case';
import { ORDER_STATUS, OrderStatus } from '@modules/orders/domain/value-objects/order-status.vo';

const mockOrderItem = { productId: 'prod-1', productName: 'Zapatos', quantity: 2, unitPrice: 300, imageUrl: '' };

function makeMockOrder(status: OrderStatus = ORDER_STATUS.PAID) {
  return {
    id: 'order-1',
    status,
    items: [mockOrderItem],
    toJSON: () => ({ id: 'order-1', status }),
  };
}

const mockOrderRepo = {
  findById: jest.fn(),
  updateStatus: jest.fn().mockResolvedValue(undefined),
};
const mockProductRepo = {
  findById: jest.fn().mockResolvedValue({ id: 'prod-1', stock: 5, toJSON: () => ({ id: 'prod-1', stock: 5 }) }),
  update: jest.fn().mockResolvedValue(undefined),
};
const mockMovementRepo = { save: jest.fn().mockResolvedValue(undefined) };

function buildUseCase() {
  return new ApproveOrderUseCase(
    mockOrderRepo as never,
    mockProductRepo as never,
    mockMovementRepo as never,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockOrderRepo.findById.mockResolvedValue(makeMockOrder());
});

describe('ApproveOrderUseCase (procesamiento de ordenes pagadas)', () => {
  // TC-19
  it('TC-19: procesar orden PAID la mueve a PROCESSING', async () => {
    mockOrderRepo.findById
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.PAID))
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.PROCESSING));

    const useCase = buildUseCase();
    const result = await useCase.execute({
      orderId: 'order-1', action: 'approve', adminId: 'admin-1', adminEmail: 'admin@test.com',
    });

    expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith('order-1', ORDER_STATUS.PROCESSING);
    expect(result.status).toBe(ORDER_STATUS.PROCESSING);
  });

  // TC-20
  it('TC-20: rechazar orden PAID la mueve a CANCELLED y restaura stock', async () => {
    mockOrderRepo.findById
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.PAID))
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.CANCELLED));

    const useCase = buildUseCase();
    await useCase.execute({
      orderId: 'order-1', action: 'reject', adminId: 'admin-1', adminEmail: 'admin@test.com',
    });

    expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith('order-1', ORDER_STATUS.CANCELLED);
    expect(mockProductRepo.update).toHaveBeenCalled();
    expect(mockMovementRepo.save).toHaveBeenCalled();
  });

  // TC-21
  it('TC-21: rechazar orden registra movimiento de tipo return', async () => {
    mockOrderRepo.findById
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.PAID))
      .mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.CANCELLED));

    const useCase = buildUseCase();
    await useCase.execute({
      orderId: 'order-1', action: 'reject', adminId: 'admin-1', adminEmail: 'admin@test.com',
    });

    const savedMovement = mockMovementRepo.save.mock.calls[0][0];
    expect(savedMovement.type).toBe('return');
    expect(savedMovement.quantity).toBe(2);
  });

  // TC-22
  it('TC-22: procesar orden en estado SHIPPED lanza ValidationException', async () => {
    mockOrderRepo.findById.mockResolvedValueOnce(makeMockOrder(ORDER_STATUS.SHIPPED));
    const useCase = buildUseCase();

    await expect(useCase.execute({
      orderId: 'order-1', action: 'approve', adminId: 'admin-1', adminEmail: 'admin@test.com',
    })).rejects.toThrow();
  });

  // TC-23
  it('TC-23: procesar orden inexistente lanza OrderNotFoundException', async () => {
    mockOrderRepo.findById.mockResolvedValueOnce(null);
    const useCase = buildUseCase();

    await expect(useCase.execute({
      orderId: 'non-existent', action: 'approve', adminId: 'admin-1', adminEmail: 'admin@test.com',
    })).rejects.toThrow();
  });
});
