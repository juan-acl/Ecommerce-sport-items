import { useState, useRef } from 'react';
import { Tag, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { useValidateDiscountMutation } from '@features/discounts/api/discountsApi';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { CartItem } from '@features/cart/types';

export interface AppliedDiscount {
  discountId: string;
  code: string;
  discountAmount: number;
  finalTotal: number;
}

interface DiscountCodeInputProps {
  orderTotal: number;
  onDiscountApplied: (discount: AppliedDiscount | null) => void;
  appliedDiscount: AppliedDiscount | null;
  cartItems?: CartItem[];
}

export function DiscountCodeInput({
  orderTotal,
  onDiscountApplied,
  appliedDiscount,
  cartItems,
}: DiscountCodeInputProps) {
  const [code, setCode] = useState(appliedDiscount?.code ?? '');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isDirtyAfterApply, setIsDirtyAfterApply] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [validateDiscount, { isLoading }] = useValidateDiscountMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercased = e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
    setCode(uppercased);
    setInputError(null);
    if (appliedDiscount) {
      setIsDirtyAfterApply(true);
      onDiscountApplied(null);
    }
  };

  const handleApply = async () => {
    const trimmed = code.trim();

    if (!trimmed) {
      setInputError('Ingresa un código de descuento');
      inputRef.current?.focus();
      return;
    }

    if (!/^[A-Z0-9\-]{1,50}$/.test(trimmed)) {
      setInputError('El código solo puede contener letras, números y guiones');
      return;
    }

    setInputError(null);
    setIsDirtyAfterApply(false);

    const cartCategories = cartItems
      ? [...new Set(cartItems.map((i) => i.category).filter((c): c is string => !!c))]
      : undefined;

    try {
      const result = await validateDiscount({
        code: trimmed,
        orderTotal,
        ...(cartCategories && cartCategories.length > 0 ? { cartCategories } : {}),
      }).unwrap();
      onDiscountApplied({
        discountId: result.discountId,
        code: result.code,
        discountAmount: result.discountAmount,
        finalTotal: result.finalTotal,
      });
    } catch (err) {
      const error = err as { data?: { error?: { message?: string } } };
      setInputError(error.data?.error?.message ?? 'Código de descuento inválido o expirado');
      onDiscountApplied(null);
    }
  };

  const handleRemove = () => {
    setCode('');
    setInputError(null);
    setIsDirtyAfterApply(false);
    onDiscountApplied(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <header className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary" />
        <h2 className="text-headline-sm text-on-surface">Código de descuento</h2>
      </header>

      {appliedDiscount && !isDirtyAfterApply ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary-container rounded-xl">
            <CheckCircle className="w-5 h-5 text-on-secondary-container flex-shrink-0" />
            <p className="text-body-md text-on-secondary-container font-medium flex-1">
              <span className="font-mono font-bold">{appliedDiscount.code}</span>
              {' aplicado — '}
              <span className="font-bold">{formatCurrency(appliedDiscount.discountAmount)}</span>
              {' de descuento'}
            </p>
            <button
              type="button"
              onClick={handleRemove}
              className="text-on-secondary-container hover:text-on-surface transition-colors ml-2 flex-shrink-0"
              aria-label="Quitar código de descuento"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                id="discountCode"
                type="text"
                placeholder="DEPORTE20"
                value={code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={50}
                autoComplete="off"
                aria-label="Código de descuento"
                error={inputError ?? undefined}
                className="uppercase tracking-wider font-mono"
              />
            </div>
            <div className="flex-shrink-0 pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleApply}
                isLoading={isLoading}
                disabled={!code.trim() || isLoading}
                className="h-[52px]"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
