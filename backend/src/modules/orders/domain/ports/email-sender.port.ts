import { Order } from '../entities/order.entity';
import { OrderStatus } from '../value-objects/order-status.vo';

export interface OrderEmailContext {
  to: string;
  userName: string;
  order: Order;
}

export interface OrderStatusUpdateEmailContext {
  to: string;
  userName: string;
  orderId: string;
  newStatus: OrderStatus;
}

export interface EmailSenderPort {
  sendOrderConfirmation(context: OrderEmailContext): Promise<void>;
  sendOrderStatusUpdate(context: OrderStatusUpdateEmailContext): Promise<void>;
}
