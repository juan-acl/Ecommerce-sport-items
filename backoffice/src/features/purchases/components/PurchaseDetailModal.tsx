import { useState } from 'react';
import { toast } from 'sonner';
import type { Purchase } from '@shared/types/common';
import {
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
} from '@features/purchases/api/purchasesApi';
import { PartialReceiveModal } from './PartialReceiveModal';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { cn } from '@shared/utils/cn';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  partial: 'Parcialmente recibida',
  received: 'Recibida',
  cancelled: 'Cancelada',
};

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  partial: 'bg-blue-50 text-blue-700 border border-blue-200',
  received: 'bg-[#ddfbf2] text-[#006b58] border border-[#006b58]/20',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const STATUS_DOTS: Record<string, string> = {
  pending: 'bg-amber-400',
  partial: 'bg-blue-500',
  received: 'bg-[#006b58]',
  cancelled: 'bg-red-500',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

export function PurchaseDetailModal({ isOpen, onClose, purchase }: Readonly<Props>) {
  const [receivePurchase, { isLoading: isReceiving }] = useReceivePurchaseMutation();
  const [cancelPurchase, { isLoading: isCancelling }] = useCancelPurchaseMutation();
  const [showPartialModal, setShowPartialModal] = useState(false);

  if (!purchase) return null;

  const handleReceive = async () => {
    try {
      await receivePurchase(purchase.id).unwrap();
      toast.success('Compra recibida. Inventario actualizado.');
      onClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg ?? 'Error al recibir la compra.');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPurchase(purchase.id).unwrap();
      toast.success('Compra cancelada.');
      onClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg ?? 'Error al cancelar la compra.');
    }
  };

  const isLoading = isReceiving || isCancelling;
  const isPending = purchase.status === 'pending';
  const isPartial = purchase.status === 'partial';
  const canAct = isPending || isPartial;
  const canCancel = isPending;

  const getAlreadyReceived = (productId: string): number =>
    purchase.receivedItems?.find((r) => r.productId === productId)?.receivedQuantity ?? 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalle de compra"
        footer={
          <>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cerrar
            </Button>
            {canAct && (
              <>
                {canCancel && (
                  <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} disabled={isReceiving}>
                    Cancelar compra
                  </Button>
                )}
                {(isPending || isPartial) && (
                  <Button variant="outline" onClick={() => setShowPartialModal(true)} disabled={isLoading}>
                    Recepción parcial
                  </Button>
                )}
                {isPending && (
                  <Button onClick={handleReceive} isLoading={isReceiving} disabled={isCancelling}>
                    Recibir todo
                  </Button>
                )}
              </>
            )}
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-on-surface-variant">Proveedor</p>
              <p className="font-semibold text-on-surface">{purchase.supplierName}</p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
                STATUS_CLASSES[purchase.status] ?? STATUS_CLASSES.pending,
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOTS[purchase.status] ?? STATUS_DOTS.pending)} />
              {STATUS_LABELS[purchase.status] ?? purchase.status}
            </span>
          </div>

          {/* Datos de facturación */}
          <div className="rounded-lg border border-outline-variant overflow-hidden">
            <div className="px-3 py-2 bg-surface-container-low border-b border-outline-variant">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                Datos de facturación
              </p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-outline-variant">
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">
                  Emisor
                </p>
                <p className="text-[13px] font-medium text-on-surface">{purchase.supplierName}</p>
                <p className="text-[12px] font-mono text-on-surface-variant mt-0.5">
                  NIT: <span className="text-on-surface">{purchase.supplierNit || 'CF'}</span>
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">
                  Receptor
                </p>
                <p className="text-[13px] font-medium text-on-surface">SportsCart</p>
                <p className="text-[12px] font-mono text-on-surface-variant mt-0.5">
                  NIT: <span className="text-on-surface">{purchase.buyerNit || 'CF'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <p className="text-on-surface-variant">Fecha de creación</p>
              <p className="text-on-surface">{new Date(purchase.createdAt).toLocaleDateString('es-GT')}</p>
            </div>
            {purchase.receivedAt && (
              <div>
                <p className="text-on-surface-variant">Fecha de recepción</p>
                <p className="text-on-surface">{new Date(purchase.receivedAt).toLocaleDateString('es-GT')}</p>
              </div>
            )}
          </div>

          {purchase.notes && (
            <div>
              <p className="text-[11px] text-on-surface-variant mb-1">Notas</p>
              <p className="text-[13px] text-on-surface bg-surface-container-low rounded-md px-3 py-2">
                {purchase.notes}
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
              Productos
            </p>
            <div className="border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Producto</th>
                    <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Pedido</th>
                    {purchase.status !== 'pending' && (
                      <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Recibido</th>
                    )}
                    <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Costo U.</th>
                    <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {purchase.items.map((item, i) => {
                    const received = getAlreadyReceived(item.productId);
                    const isComplete = received >= item.quantity;
                    return (
                      <tr key={`${item.productId}-${i}`}>
                        <td className="px-3 py-2 text-on-surface">{item.productName}</td>
                        <td className="px-3 py-2 text-right text-on-surface">{item.quantity}</td>
                        {purchase.status !== 'pending' && (
                          <td className="px-3 py-2 text-right">
                            <span className={cn(
                              'font-medium',
                              isComplete ? 'text-[#006b58]' : 'text-amber-600',
                            )}>
                              {received}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-2 text-right text-on-surface">Q{item.unitCost.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-on-surface">Q{item.subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-surface-container-low">
                  <tr>
                    <td colSpan={purchase.status !== 'pending' ? 4 : 3} className="px-3 py-2 text-right font-semibold text-on-surface">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-[#006b58]">
                      Q{purchase.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <PartialReceiveModal
        isOpen={showPartialModal}
        onClose={() => setShowPartialModal(false)}
        purchase={purchase}
      />
    </>
  );
}
