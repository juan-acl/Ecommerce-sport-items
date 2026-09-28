import nodemailer, { Transporter } from 'nodemailer';
import { EmailSenderPort, OrderEmailContext } from '@modules/orders/domain/ports/email-sender.port';

export class NodemailerEmailService implements EmailSenderPort {
  private readonly transporter: Transporter;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly fromAddress: string,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      ignoreTLS: true,
    });
  }

  async sendOrderConfirmation(context: OrderEmailContext): Promise<void> {
    const { to, userName, order } = context;

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Q${item.unitPrice.toFixed(2)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Q${item.subtotal.toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1a73e8;">¡Gracias por tu compra, ${userName}!</h2>
        <p>Hemos recibido tu orden <strong>#${order.id.substring(0, 8)}</strong>.</p>
        <h3>Resumen del pedido</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px;text-align:left;">Producto</th>
              <th style="padding:8px;">Cantidad</th>
              <th style="padding:8px;text-align:right;">Precio</th>
              <th style="padding:8px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:8px;text-align:right;font-weight:bold;">Total:</td>
              <td style="padding:8px;text-align:right;font-weight:bold;">Q${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <h3>Dirección de envío</h3>
        <p>
          ${order.shippingAddress.street}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.country}<br/>
          ${order.shippingAddress.postalCode}
        </p>
        <p style="color:#666;font-size:12px;margin-top:32px;">
          Este es un mensaje automático del sistema Sports Cart.
        </p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: `Confirmación de orden #${order.id.substring(0, 8)}`,
      html,
    });
  }
}
