import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { ApproveOrderUseCase } from '../../../src/modules/orders/application/use-cases/approve-order.use-case';
import { UpdateOrderStatusUseCase } from '../../../src/modules/orders/application/use-cases/update-order-status.use-case';
import { CheckoutUseCase } from '../../../src/modules/orders/application/use-cases/checkout.use-case';
import { Order } from '../../../src/modules/orders/domain/entities/order.entity';
import { OrderItem } from '../../../src/modules/orders/domain/entities/order-item.entity';
import { ORDER_STATUS, OrderStatus } from '../../../src/modules/orders/domain/value-objects/order-status.vo';
import { DEFAULT_SHIPPING_ADDRESS } from '../../../src/modules/orders/domain/value-objects/shipping-address.vo';

const CUSTOMER_EMAIL = 'cliente@example.com';
const CUSTOMER_NAME = 'Juan Perez';
const CUSTOMER_ID = 'customer-1';
const ORDER_ID = 'order-acc-1';

function makeOrder(status: OrderStatus): Order {
  return new Order({
    id: ORDER_ID,
    userId: CUSTOMER_ID,
    userEmail: CUSTOMER_EMAIL,
    status,
    items: [new OrderItem({ productId: 'p1', productName: 'Producto', unitPrice: 100, quantity: 1, imageUrl: '' })],
    shippingAddress: DEFAULT_SHIPPING_ADDRESS,
    createdAt: new Date().toISOString(),
  });
}

export function registerOrderEmailSteps(rt: AcceptanceRuntime): void {
  rt.step(/a customer with email "([^"]+)" and name "([^"]+)" exists/, (_m, ctx) => {
    ctx.customerEmail = CUSTOMER_EMAIL;
    ctx.customerName = CUSTOMER_NAME;
  });

  rt.step(/an email service is configured/, (_m, ctx) => {
    ctx.emailCalls = [] as { to: string; newStatus?: string; type: string }[];
    ctx.emailFailing = false;
    ctx.emailSender = {
      sendOrderConfirmation: jest.fn(async (c: { to: string }) => {
        (ctx.emailCalls as { to: string; type: string }[]).push({ to: c.to, type: 'confirmation' });
      }),
      sendOrderStatusUpdate: jest.fn(async (c: { to: string; newStatus: string }) => {
        (ctx.emailCalls as { to: string; newStatus: string; type: string }[]).push({ to: c.to, newStatus: c.newStatus, type: 'status' });
      }),
    };
  });

  rt.step(/the email service is unavailable/, (_m, ctx) => {
    ctx.emailFailing = true;
    ctx.emailSender = {
      sendOrderConfirmation: jest.fn(async () => { throw new Error('SMTP unavailable'); }),
      sendOrderStatusUpdate: jest.fn(async () => { throw new Error('SMTP unavailable'); }),
    };
  });

  rt.step(/the customer has items in their cart/, (_m, ctx) => {
    const cartItem = { productId: 'p1', productName: 'Producto', unitPrice: 100, quantity: 1, imageUrl: '' };
    ctx.mockCart = {
      isEmpty: jest.fn().mockReturnValue(false),
      getItems: jest.fn().mockReturnValue([cartItem]),
    };
    ctx.mockCartRepo = { getByUserId: jest.fn().mockResolvedValue(ctx.mockCart) };
    ctx.mockProductRepo = { findById: jest.fn().mockResolvedValue({ id: 'p1', name: 'Producto', stock: 10, category: 'sport' }) };
    ctx.mockMovementRepo = { save: jest.fn().mockResolvedValue(undefined) };
    ctx.mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    ctx.savedOrder = null;
    ctx.mockOrderRepo = {
      executeCheckout: jest.fn(async ({ order }: { order: Order }) => { ctx.savedOrder = order; }),
      findById: jest.fn(),
      updateStatus: jest.fn().mockResolvedValue(undefined),
      listByUserId: jest.fn(),
      findByIdForUser: jest.fn(),
      listAll: jest.fn(),
    };
  });

  rt.step(/an order with status "([^"]+)" belongs to the customer/, (m, ctx) => {
    ctx.currentStatus = m[1] as OrderStatus;
    ctx.order = makeOrder(m[1] as OrderStatus);
    ctx.mockProductRepo = ctx.mockProductRepo ?? { findById: jest.fn().mockResolvedValue({ id: 'p1', stock: 10, toJSON: () => ({ id: 'p1', stock: 10 }) }), update: jest.fn().mockResolvedValue(undefined) };
    ctx.mockMovementRepo = ctx.mockMovementRepo ?? { save: jest.fn().mockResolvedValue(undefined) };
    ctx.mockOrderRepo = {
      findById: jest.fn()
        .mockResolvedValueOnce(ctx.order)
        .mockResolvedValueOnce(makeOrder(ORDER_STATUS.PROCESSING)),
      updateStatus: jest.fn().mockResolvedValue(undefined),
      executeCheckout: jest.fn(),
      listByUserId: jest.fn(),
      findByIdForUser: jest.fn(),
      listAll: jest.fn(),
    };
    ctx.mockUserRepo = {
      findById: jest.fn().mockResolvedValue({ id: CUSTOMER_ID, email: CUSTOMER_EMAIL, name: CUSTOMER_NAME }),
    };
  });

  rt.step(/the customer completes checkout/, async (_m, ctx) => {
    const useCase = new CheckoutUseCase(
      ctx.mockOrderRepo as never,
      ctx.mockCartRepo as never,
      ctx.mockProductRepo as never,
      ctx.emailSender as never,
      ctx.mockLogger as never,
      ctx.mockMovementRepo as never,
      null,
    );
    try {
      ctx.checkoutResult = await useCase.execute({
        userId: CUSTOMER_ID,
        userEmail: CUSTOMER_EMAIL,
        userName: CUSTOMER_NAME,
        dto: { shippingAddress: undefined },
      });
      ctx.checkoutError = null;
    } catch (err) {
      ctx.checkoutError = err;
    }
  });

  rt.step(/an admin "approves" the order/, async (_m, ctx) => {
    const useCase = new ApproveOrderUseCase(
      ctx.mockOrderRepo as never,
      ctx.mockProductRepo as never,
      ctx.mockMovementRepo as never,
      ctx.emailSender as never,
      ctx.mockUserRepo as never,
    );
    await useCase.execute({ orderId: ORDER_ID, action: 'approve', adminId: 'admin-1', adminEmail: 'admin@test.com' });
    await new Promise(process.nextTick);
  });

  rt.step(/an admin "rejects" the order/, async (_m, ctx) => {
    (ctx.mockOrderRepo as { findById: jest.Mock }).findById
      .mockResolvedValueOnce(ctx.order)
      .mockResolvedValueOnce(makeOrder(ORDER_STATUS.CANCELLED));
    const useCase = new ApproveOrderUseCase(
      ctx.mockOrderRepo as never,
      ctx.mockProductRepo as never,
      ctx.mockMovementRepo as never,
      ctx.emailSender as never,
      ctx.mockUserRepo as never,
    );
    await useCase.execute({ orderId: ORDER_ID, action: 'reject', adminId: 'admin-1', adminEmail: 'admin@test.com' });
    await new Promise(process.nextTick);
  });

  rt.step(/an admin updates the order status to "([^"]+)"/, async (m, ctx) => {
    const newStatus = m[1] as OrderStatus;
    const updatedOrder = makeOrder(newStatus);
    (ctx.mockOrderRepo as { findById: jest.Mock }).findById.mockReset();
    (ctx.mockOrderRepo as { findById: jest.Mock }).findById
      .mockResolvedValueOnce(ctx.order ?? makeOrder(ctx.currentStatus as OrderStatus ?? ORDER_STATUS.PAID))
      .mockResolvedValueOnce(updatedOrder);
    const useCase = new UpdateOrderStatusUseCase(
      ctx.mockOrderRepo as never,
      ctx.mockProductRepo as never,
      ctx.mockMovementRepo as never,
      ctx.emailSender as never,
      ctx.mockUserRepo as never,
    );
    await useCase.execute(ORDER_ID, newStatus);
    await new Promise(process.nextTick);
    ctx.updatedStatus = newStatus;
  });

  rt.step(/an order confirmation email is sent to "([^"]+)"/, (_m, ctx) => {
    const emailSender = ctx.emailSender as { sendOrderConfirmation: jest.Mock };
    expect(emailSender.sendOrderConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ to: CUSTOMER_EMAIL }),
    );
  });

  rt.step(/the order status is "([^"]+)"/, (m, ctx) => {
    const status = m[1];
    if (ctx.savedOrder) {
      expect((ctx.savedOrder as Order).status).toBe(status);
    } else if (ctx.checkoutResult) {
      expect((ctx.checkoutResult as { status: string }).status).toBe(status);
    }
  });

  rt.step(/an order status update email is sent to "([^"]+)" with new status "([^"]+)"/, (m, ctx) => {
    const emailSender = ctx.emailSender as { sendOrderStatusUpdate: jest.Mock };
    expect(emailSender.sendOrderStatusUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ to: m[1], newStatus: m[2] }),
    );
  });

  rt.step(/the order status is updated to "([^"]+)"/, (m, ctx) => {
    const orderRepo = ctx.mockOrderRepo as { updateStatus: jest.Mock };
    expect(orderRepo.updateStatus).toHaveBeenCalledWith(ORDER_ID, m[1]);
  });

  rt.step(/no error is returned to the admin/, (_m, ctx) => {
    expect(ctx.updateError).toBeUndefined();
  });

  rt.step(/the order is created with status "([^"]+)"/, (m, ctx) => {
    expect(ctx.checkoutError).toBeNull();
    if (ctx.savedOrder) {
      expect((ctx.savedOrder as Order).status).toBe(m[1]);
    }
  });

  rt.step(/no error is returned to the customer/, (_m, ctx) => {
    expect(ctx.checkoutError).toBeNull();
  });
}
