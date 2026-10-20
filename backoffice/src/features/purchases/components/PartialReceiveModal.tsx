import { useState } from 'react';
import { toast } from 'sonner';
import type { Purchase } from '@shared/types/common';
import { usePartialReceivePurchaseMutation } from '@features/purchases/api/purchasesApi';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

export function PartialReceiveModal({ isOpen, onClose, purchase }: Readonly<Props>) {
  const [partialReceive, { isLoading }] = usePartialReceivePurchaseMutation();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!purchase) return null;

  const getAlreadyReceived = (productId: string): number =>
    purchase.receivedItems?.find((r) => r.productId === productId)?.receivedQuantity ?? 0;

  const getRemaining = (productId: string, ordered: number): number =>
    ordered - getAlreadyReceived(productId);

  const handleQuantityChange = (productId: string, value: string) => {
    const num = parseInt(value, 10);
    setQuantities((prev) => ({ ...prev, [productId]: isNaN(num) ? 0 : num }));
  };

  const handleSubmit = async () => {
    const items = purchase.items
      .map((item) => ({
        productId: item.productId,
        receivedQuantity: quantities[item.productId] ?? 0,
      }))
      .filter((i) => i.receivedQuantity > 0);

    if (items.length === 0) {
      toast.error('Ingresa al menos una cantidad mayor a 0.');
      return;
    }

    for (const item of purchase.items) {
      const qty = quantities[item.productId] ?? 0;
      const remaining = getRemaining(item.productId, item.quantity);
      if (qty > remaining) {
        toast.error(`La cantidad para "${item.productName}" supera el pendiente (${remaining}).`);
        return;
      }
    }

    try {
      const result = await partialReceive({ id: purchase.id, items }).unwrap();
      const isComplete = result.status === 'received';
      toast.success(
        isComplete
          ? 'Recepción completada. Inventario actualizado.'
          : 'Recepción parcial registrada. Inventario actualizado.',
      );
      setQuantities({});
      onClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message;
      toast.error(msg ?? 'Error al registrar la recepción.');
    }
  };

  const handleClose = () => {
    setQuantities({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Recepción parcial"
      className="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Registrar recepción
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-body-sm text-on-surface-variant">
          Ingresa la cantidad recibida para cada producto. Deja en 0 los que aún no llegaron.
        </p>

        <div className="border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Producto</th>
                <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Pedido</th>
                <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Ya recibido</th>
                <th className="px-3 py-2 text-right font-semibold text-on-surface-variant">Pendiente</th>
                <th className="px-3 py-2 text-center font-semibold text-on-surface-variant w-28">Recibir ahora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {purchase.items.map((item) => {
                const alreadyReceived = getAlreadyReceived(item.productId);
                const remaining = getRemaining(item.productId, item.quantity);
                const isComplete = remaining === 0;

                return (
                  <tr key={item.productId} className={isComplete ? 'opacity-50' : ''}>
                    <td className="px-3 py-2 text-on-surface">{item.productName}</td>
                    <td className="px-3 py-2 text-right text-on-surface-variant">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-[#006b58] font-medium">{alreadyReceived}</td>
                    <td className="px-3 py-2 text-right font-semibold text-on-surface">{remaining}</td>
                    <td className="px-3 py-2 text-center">
                      {isComplete ? (
                        <span className="text-[#006b58] text-[11px] font-semibold">✓ Completo</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          max={remaining}
                          value={quantities[item.productId] ?? ''}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          placeholder="0"
                          className="w-20 text-center border border-outline-variant rounded-md px-2 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-lowest"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
