import nodemailer, { Transporter } from 'nodemailer';
import { EmailSenderPort, OrderEmailContext, OrderStatusUpdateEmailContext } from '@modules/orders/domain/ports/email-sender.port';
import { OrderStatus } from '@modules/orders/domain/value-objects/order-status.vo';

const BASE_STYLE = `
  body { margin:0; padding:0; background:#f4f4f4; }
  * { box-sizing:border-box; }
`;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>${BASE_STYLE}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a73e8;padding:24px 32px;">
            <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:1px;">
              ⚽ Sports Cart
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;font-family:Arial,sans-serif;color:#333333;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;padding:16px 32px;border-top:1px solid #eeeeee;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#999999;text-align:center;">
              Este es un mensaje automático de Sports Cart. Por favor no respondas este correo.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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
    const shortId = order.id.substring(0, 8).toUpperCase();

    const itemsHtml = order.items.map((item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:14px;">${item.productName}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;text-align:center;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;text-align:right;font-size:14px;">Q${item.unitPrice.toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;text-align:right;font-size:14px;">Q${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    const discountRow = (order.discountAmount && order.discountAmount > 0)
      ? `<tr>
           <td colspan="3" style="padding:8px;text-align:right;font-size:14px;color:#059669;">Descuento (${order.discountCode ?? ''}):</td>
           <td style="padding:8px;text-align:right;font-size:14px;color:#059669;">-Q${order.discountAmount.toFixed(2)}</td>
         </tr>`
      : '';

    const content = `
      <h2 style="margin:0 0 4px;font-size:22px;color:#1a73e8;">¡Gracias por tu compra, ${userName}!</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#666666;">Hemos recibido tu orden <strong>#${shortId}</strong> y está siendo procesada.</p>

      <h3 style="margin:0 0 12px;font-size:15px;color:#333333;border-bottom:2px solid #1a73e8;padding-bottom:6px;">Resumen del pedido</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#f0f4ff;">
            <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555555;font-weight:600;">Producto</th>
            <th style="padding:10px 8px;text-align:center;font-size:13px;color:#555555;font-weight:600;">Cant.</th>
            <th style="padding:10px 8px;text-align:right;font-size:13px;color:#555555;font-weight:600;">Precio</th>
            <th style="padding:10px 8px;text-align:right;font-size:13px;color:#555555;font-weight:600;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          ${discountRow}
          <tr style="background:#f0f4ff;">
            <td colspan="3" style="padding:10px 8px;text-align:right;font-weight:bold;font-size:15px;">Total:</td>
            <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:15px;color:#1a73e8;">Q${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="margin:0 0 12px;font-size:15px;color:#333333;border-bottom:2px solid #1a73e8;padding-bottom:6px;">Dirección de envío</h3>
      <table cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:6px;padding:12px 16px;margin-bottom:8px;">
        <tr><td style="font-size:14px;padding:3px 0;color:#444444;">
          📍 ${order.shippingAddress.street}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;${order.shippingAddress.city}, ${order.shippingAddress.country} ${order.shippingAddress.postalCode}
        </td></tr>
      </table>
    `;

    const html = emailWrapper(content);

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: `✅ Confirmación de orden #${shortId} — Sports Cart`,
      html,
    });
  }

  async sendOrderStatusUpdate(context: OrderStatusUpdateEmailContext): Promise<void> {
    const { to, userName, orderId, newStatus } = context;

    const STATUS_INFO: Record<OrderStatus, { label: string; color: string; bg: string; icon: string; message: string }> = {
      processing: {
        label: 'En proceso',
        color: '#b45309',
        bg: '#fffbeb',
        icon: '📦',
        message: 'Estamos preparando y empacando tu pedido en nuestro almacén.',
      },
      shipped: {
        label: 'En tránsito',
        color: '#1d4ed8',
        bg: '#eff6ff',
        icon: '🚚',
        message: 'Tu pedido ha sido despachado y está en camino hacia tu dirección.',
      },
      delivered: {
        label: 'Entregado',
        color: '#065f46',
        bg: '#ecfdf5',
        icon: '🏠',
        message: '¡Tu pedido ha sido entregado! Esperamos que disfrutes tus productos.',
      },
      cancelled: {
        label: 'Cancelado',
        color: '#991b1b',
        bg: '#fff1f2',
        icon: '❌',
        message: 'Tu pedido ha sido cancelado. Si tienes alguna duda, contáctanos.',
      },
      paid: {
        label: 'Confirmado',
        color: '#065f46',
        bg: '#ecfdf5',
        icon: '✅',
        message: 'Tu pago fue procesado exitosamente.',
      },
    };

    const info = STATUS_INFO[newStatus] ?? { label: newStatus, color: '#374151', bg: '#f9fafb', icon: '🔔', message: '' };
    const shortId = orderId.substring(0, 8).toUpperCase();

    const content = `
      <h2 style="margin:0 0 4px;font-size:22px;color:#1a73e8;">Actualización de tu orden</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#666666;">Hola <strong>${userName}</strong>, el estado de tu orden ha cambiado.</p>

      <h3 style="margin:0 0 12px;font-size:15px;color:#333333;border-bottom:2px solid #1a73e8;padding-bottom:6px;">Detalle de la orden</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <tr style="background:#f0f4ff;">
          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555555;font-weight:600;">Orden</th>
          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555555;font-weight:600;">Nuevo estado</th>
        </tr>
        <tr>
          <td style="padding:14px 8px;border-bottom:1px solid #eeeeee;font-size:15px;font-weight:bold;color:#333333;">
            #${shortId}
          </td>
          <td style="padding:14px 8px;border-bottom:1px solid #eeeeee;">
            <span style="display:inline-block;background:${info.bg};color:${info.color};border:1px solid ${info.color};padding:4px 14px;border-radius:999px;font-size:13px;font-weight:bold;">
              ${info.icon} ${info.label}
            </span>
          </td>
        </tr>
      </table>

      <h3 style="margin:0 0 12px;font-size:15px;color:#333333;border-bottom:2px solid #1a73e8;padding-bottom:6px;">¿Qué significa esto?</h3>
      <table cellpadding="0" cellspacing="0" style="background:${info.bg};border-radius:6px;padding:12px 16px;margin-bottom:8px;width:100%;">
        <tr><td style="font-size:14px;padding:3px 0;color:#444444;">
          ${info.message}
        </td></tr>
      </table>
    `;

    const html = emailWrapper(content);

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: `${info.icon} Tu orden #${shortId} — ${info.label} | Sports Cart`,
      html,
    });
  }
}
