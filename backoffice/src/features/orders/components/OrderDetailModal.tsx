import { MapPin, CreditCard, Package } from 'lucide-react';
import { Modal } from '@shared/components/ui/Modal';
import { Badge } from '@shared/components/ui/Badge';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { computeOrderSummary, ORDER_STATUS_VARIANTS, ORDER_STATUS_LABELS } from '../utils/orderDetailHelpers';
import type { Order } from '@shared/types/common';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: Readonly<OrderDetailModalProps>) {
  if (!order) return null;

  const summary = computeOrderSummary(order);

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={`Orden #${order.id.slice(-8).toUpperCase()}`}
      className="max-w-2xl"
    >
      {/* Header info */}
      <div className="flex items-center gap-3 pb-4 border-b border-outline-variant mb-4">
        <Badge variant={ORDER_STATUS_VARIANTS[order.status] ?? 'default'}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </Badge>
        <span className="text-label-sm text-on-surface-variant">
          {new Date(order.createdAt).toLocaleString('es-GT')}
        </span>
        {order.userEmail && (
          <span className="text-label-sm text-on-surface-variant ml-auto">{order.userEmail}</span>
        )}
      </div>

      {/* Items */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-label-md font-semibold text-on-surface mb-2">
          <Package size={14} />
          Productos
        </div>
        <div className="rounded-lg border border-outline-variant overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-3 py-2 text-label-sm font-medium text-on-surface-variant">Producto</th>
                <th className="text-center px-3 py-2 text-label-sm font-medium text-on-surface-variant">Cant.</th>
                <th className="text-right px-3 py-2 text-label-sm font-medium text-on-surface-variant">Precio unit.</th>
                <th className="text-right px-3 py-2 text-label-sm font-medium text-on-surface-variant">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <tr key={item.productId} className="bg-white hover:bg-surface-container-lowest transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-8 h-8 rounded object-cover flex-shrink-0 bg-surface-container"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <span className="text-on-surface font-medium">{item.productName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center text-on-surface-variant">{item.quantity}</td>
                  <td className="px-3 py-2.5 text-right text-on-surface-variant">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-on-surface">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial summary */}
      <div className="mb-5 bg-surface-container-low rounded-lg px-4 py-3 space-y-1.5">
        <div className="flex justify-between text-label-md text-on-surface-variant">
          <span>Subtotal</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        {summary.hasDiscount && (
          <div className="flex justify-between text-label-md text-[#005142]">
            <span>Descuento <span className="font-mono text-xs">({summary.discountCode})</span></span>
            <span>-{formatCurrency(summary.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-label-md font-semibold text-on-surface pt-1 border-t border-outline-variant">
          <span>Total</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-label-md font-semibold text-on-surface mb-2">
          <MapPin size={14} />
          Dirección de envío
        </div>
        <div className="bg-surface-container-low rounded-lg px-4 py-3 text-body-md text-on-surface-variant space-y-0.5">
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
          <p className="text-label-sm">CP: {order.shippingAddress.postalCode}</p>
        </div>
      </div>

      {/* Payment method (if available) */}
      {order.paymentMethod && (
        <div>
          <div className="flex items-center gap-1.5 text-label-md font-semibold text-on-surface mb-2">
            <CreditCard size={14} />
            Método de pago
          </div>
          <div className="bg-surface-container-low rounded-lg px-4 py-3 text-body-md text-on-surface-variant">
            <span className="capitalize">{order.paymentMethod.cardType}</span>
            {' '}terminada en <span className="font-mono font-medium">{order.paymentMethod.last4}</span>
            {order.paymentMethod.cardholderName && (
              <span className="ml-2 text-label-sm">— {order.paymentMethod.cardholderName}</span>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
