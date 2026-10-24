import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { useApproveDiscountMutation } from '@features/discounts/api/discountsApi';
import { toast } from 'sonner';
import type { Discount } from '@shared/types/common';

interface ApproveDiscountModalProps {
  discount: Discount | null;
  onClose: () => void;
}

export function ApproveDiscountModal({ discount, onClose }: Readonly<ApproveDiscountModalProps>) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [approveDiscount, { isLoading }] = useApproveDiscountMutation();

  if (!discount) return null;

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const handleApprove = async () => {
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError('La razón debe tener al menos 5 caracteres');
      return;
    }
    setError(null);
    try {
      await approveDiscount({ id: discount.id, approvalReason: trimmed }).unwrap();
      toast.success(`Descuento ${discount.code} aprobado correctamente.`);
      handleClose();
    } catch {
      toast.error('Error al aprobar el descuento.');
    }
  };

  return (
    <Modal
      isOpen={!!discount}
      onClose={handleClose}
      title="Aprobar descuento"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleApprove} isLoading={isLoading} disabled={!reason.trim()}>
            <ShieldCheck size={14} />
            Aprobar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-surface-container-low rounded-lg px-4 py-3 text-body-md">
          <p className="text-on-surface-variant text-label-sm mb-1">Código</p>
          <p className="font-mono font-semibold text-on-surface">{discount.code}</p>
          <p className="text-on-surface-variant text-label-sm mt-2 mb-1">Descuento</p>
          <p className="font-semibold text-on-surface">
            {discount.type === 'percentage' ? `${discount.value}%` : `Q${discount.value}`}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="approvalReason" className="block text-[12px] font-medium text-on-surface">
            Razón de aprobación <span className="text-error">*</span>
          </label>
          <textarea
            id="approvalReason"
            rows={4}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(null); }}
            placeholder="Describe el motivo por el cual se aprueba este descuento mayor al 10%..."
            className="w-full px-3 py-2 border border-outline-variant rounded-md text-body-md text-on-surface bg-white resize-none focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary"
          />
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}
