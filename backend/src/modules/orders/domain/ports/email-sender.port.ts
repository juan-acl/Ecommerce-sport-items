import { Order } from '../entities/order.entity';

export interface OrderEmailContext {
  to: string;
  userName: string;
  order: Order;
}

export interface EmailSenderPort {
  sendOrderConfirmation(context: OrderEmailContext): Promise<void>;
}
