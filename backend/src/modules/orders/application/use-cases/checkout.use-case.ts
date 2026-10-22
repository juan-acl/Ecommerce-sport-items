import { v4 as uuid } from 'uuid';
import { Order } from '@modules/orders/domain/entities/order.entity';
import { OrderItem } from '@modules/orders/domain/entities/order-item.entity';
import { OrderRepository } from '@modules/orders/domain/repositories/order.repository';
import { EmailSenderPort } from '@modules/orders/domain/ports/email-sender.port';
import { EmptyCartException } from '@modules/orders/domain/exceptions/empty-cart.exception';
import { CartRepository } from '@modules/carts/domain/repositories/cart.repository';
import { ProductRepository } from '@modules/products/domain/repositories/product.repository';
import { ProductNotFoundException } from '@modules/products/domain/exceptions/product-not-found.exception';
import { DEFAULT_SHIPPING_ADDRESS } from '@modules/orders/domain/value-objects/shipping-address.vo';
import { LoggerPort } from '@shared/application/ports/logger.port';
import { InventoryMovementRepository } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { InventoryMovement } from '@modules/inventory/domain/entities/inventory-movement.entity';
import { CheckoutDto } from '../dtos/checkout.dto';

interface MinimalDiscountRepo {
  findByCode(code: string): Promise<{
    id: string;
    code: string;
    isValid(total: number, categories?: string[]): boolean;
    calculateDiscount(total: number): number;
  } | null>;
  incrementUsedCount(id: string): Promise<void>;
  hasUserUsedDiscount(discountId: string, userId: string): Promise<boolean>;
  recordUserUsage(discountId: string, userId: string): Promise<void>;
}

export interface CheckoutInput {
  userId: string;
  userEmail: string;
  userName: string;
  dto: CheckoutDto;
}

export class CheckoutUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
    private readonly emailSender: EmailSenderPort,
    private readonly logger: LoggerPort,
    private readonly movementRepo: InventoryMovementRepository,
    private readonly discountRepo: MinimalDiscountRepo | null = null,
  ) {}

  async execute(input: CheckoutInput) {
    const { userId, userEmail, userName, dto } = input;
    this.logger.info('Iniciando proceso de checkout', { userId, userEmail });

    const cart = await this.cartRepo.getByUserId(userId);
    if (cart.isEmpty()) {
      throw new EmptyCartException();
    }

    const productIds = cart.getItems().map((i) => i.productId);
    const cartCategories: string[] = [];
    for (const id of productIds) {
      const product = await this.productRepo.findById(id);
      if (!product) throw new ProductNotFoundException(id);
      cartCategories.push(product.category);
    }

    const orderItems = cart.getItems().map(
      (cartItem) =>
        new OrderItem({
          productId: cartItem.productId,
          productName: cartItem.productName,
          unitPrice: cartItem.unitPrice,
          quantity: cartItem.quantity,
          imageUrl: cartItem.imageUrl,
        }),
    );

    const subtotal = orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    let discountCode: string | undefined;
    let discountAmount: number | undefined;
    let appliedDiscount: { id: string; code: string; isValid(total: number, categories?: string[]): boolean; calculateDiscount(total: number): number } | null = null;

    if (dto.discountCode && this.discountRepo) {
      try {
        const discount = await this.discountRepo.findByCode(dto.discountCode);
        if (discount && discount.isValid(subtotal, cartCategories)) {
          const alreadyUsed = await this.discountRepo.hasUserUsedDiscount(discount.id, userId);
          if (alreadyUsed) {
            this.logger.warn('Usuario ya utilizó este código de descuento', {
              code: dto.discountCode,
              userId,
            });
            throw Object.assign(new Error('Este código de descuento ya fue utilizado por tu cuenta'), {
              statusCode: 409,
              code: 'DISCOUNT_ALREADY_USED',
            });
          }
          discountAmount = discount.calculateDiscount(subtotal);
          discountCode = discount.code;
          appliedDiscount = discount;
          this.logger.info('Descuento aplicado', { code: discountCode, discountAmount });
        } else {
          this.logger.warn('Código de descuento inválido o inaplicable, continuando sin descuento', {
            code: dto.discountCode,
          });
        }
      } catch (err) {
        const e = err as { statusCode?: number; code?: string; message?: string };
        if (e.statusCode === 409 && e.code === 'DISCOUNT_ALREADY_USED') throw err;
        this.logger.warn('Error al validar código de descuento, continuando sin descuento', {
          code: dto.discountCode,
          error: (err as Error).message,
        });
      }
    }

    const total = Math.max(0, subtotal - (discountAmount ?? 0));

    this.logger.info('Creando orden a partir del carrito', {
      userId,
      itemCount: orderItems.length,
      subtotal,
      discountAmount,
      total,
      orderItems,
    });

    const orderBaseProps = {
      id: uuid(),
      userId,
      userEmail,
      items: orderItems,
      shippingAddress: dto.shippingAddress ?? DEFAULT_SHIPPING_ADDRESS,
      createdAt: new Date().toISOString(),
      discountCode,
      discountAmount,
      paymentMethod: dto.paymentMethod,
    };

    const order = Order.createPaid(orderBaseProps);

    await this.orderRepo.executeCheckout({
      order,
      cartItems: cart.getItems(),
    });

    this.logger.info('Orden creada exitosamente', {
      orderId: order.id,
      userId,
      total: order.total,
      itemCount: order.items.length,
    });

    try {
      for (const item of order.items) {
        const movement = new InventoryMovement({
          id: uuid(),
          productId: item.productId,
          productName: item.productName,
          type: 'sale',
          quantity: -item.quantity,
          referenceId: order.id,
          note: `Venta orden ${order.id}`,
          createdAt: new Date().toISOString(),
          createdBy: userId,
        });
        await this.movementRepo.save(movement);
      }
    } catch (err) {
      this.logger.error('Error registrando movimientos de venta', { orderId: order.id, error: (err as Error).message });
    }

    if (appliedDiscount && this.discountRepo) {
      try {
        await Promise.all([
          this.discountRepo.incrementUsedCount(appliedDiscount.id),
          this.discountRepo.recordUserUsage(appliedDiscount.id, userId),
        ]);
      } catch (err) {
        this.logger.error('Error registrando uso del descuento', {
          discountId: appliedDiscount.id,
          error: (err as Error).message,
        });
      }
    }

    this.logger.info('Enviando email de confirmación', {
      data: {
        orderId: order.id,
        userId,
        to: userEmail,
      },
    });

    // El envio del correo no es blockeante
    try {
      await this.emailSender.sendOrderConfirmation({
        to: userEmail,
        userName,
        order,
      });
    } catch (err) {
      this.logger.error('Error enviando email de confirmación', {
        orderId: order.id,
        error: (err as Error).message,
      });
    }

    return order.toJSON();
  }
}
