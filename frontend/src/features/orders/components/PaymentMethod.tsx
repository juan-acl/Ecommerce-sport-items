import { useState, useCallback } from 'react';
import { Button } from '@shared/components/ui/Button';
import type { PaymentMethodInfo } from '../types';

export type { PaymentMethodInfo };

interface PaymentMethodProps {
  onContinue: (data: PaymentMethodInfo) => void;
  onBack: () => void;
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'other';

interface FormState {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
}

const CARD_THEMES: Record<CardType, { gradient: string; label: string; textColor: string }> = {
  visa: {
    gradient: 'linear-gradient(135deg, #1a1f71 0%, #0057b8 80%, #0073e6 100%)',
    label: 'VISA',
    textColor: 'text-white',
  },
  mastercard: {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #c0392b 100%)',
    label: 'Mastercard',
    textColor: 'text-white',
  },
  amex: {
    gradient: 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 60%, #1b7a4e 100%)',
    label: 'AMEX',
    textColor: 'text-white',
  },
  other: {
    gradient: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    label: '',
    textColor: 'text-white',
  },
};

function detectCardType(raw: string): CardType {
  const n = raw.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'other';
}

function luhnCheck(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function formatNumber(raw: string, type: CardType): string {
  const digits = raw.replace(/\D/g, '');
  if (type === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean).join(' ');
  }
  return digits.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function maskPreview(raw: string, type: CardType): string {
  const digits = raw.replace(/\D/g, '');
  if (type === 'amex') {
    const p1 = digits.slice(0, 4).padEnd(4, '•');
    const p2 = digits.slice(4, 10).padEnd(6, '•');
    const p3 = digits.slice(10, 15).padEnd(5, '•');
    return `${p1} ${p2} ${p3}`;
  }
  const groups = Array.from({ length: 4 }, (_, i) =>
    digits.slice(i * 4, i * 4 + 4).padEnd(4, '•')
  );
  return groups.join(' ');
}

function CardVisual({
  form,
  cardType,
  isFlipped,
}: {
  form: FormState;
  cardType: CardType;
  isFlipped: boolean;
}) {
  const theme = CARD_THEMES[cardType];
  const displayNumber = maskPreview(form.number, cardType);
  const displayName = form.name.trim() || 'NOMBRE APELLIDO';
  const displayExpiry = form.expiry || 'MM/AA';

  return (
    <div style={{ perspective: '1000px' }} className="w-full max-w-[360px] h-[210px] mx-auto">
      <div
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Frente */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            background: theme.gradient,
            position: 'absolute',
            inset: 0,
          }}
          className="rounded-2xl p-6 shadow-2xl flex flex-col justify-between select-none"
        >
          {/* Chip + Logo */}
          <div className="flex items-start justify-between">
            <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
            <span className={`font-bold text-xl tracking-wider ${theme.textColor} opacity-90`}>
              {theme.label}
            </span>
          </div>

          {/* Número */}
          <div className="font-mono text-white text-lg tracking-[0.2em] drop-shadow">
            {displayNumber}
          </div>

          {/* Nombre y Vencimiento */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Titular</p>
              <p className="text-white text-sm font-semibold tracking-wider uppercase truncate max-w-[180px]">
                {displayName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Vence</p>
              <p className="text-white text-sm font-semibold tracking-wider">{displayExpiry}</p>
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: theme.gradient,
            position: 'absolute',
            inset: 0,
          }}
          className="rounded-2xl shadow-2xl flex flex-col justify-center select-none overflow-hidden"
        >
          <div className="w-full h-10 bg-black/60 mt-6 mb-6" />
          <div className="px-6 flex items-center justify-end gap-3">
            <div className="flex-1 h-8 bg-white/20 rounded" />
            <div className="flex flex-col items-center">
              <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">CVV</p>
              <div className="bg-white text-gray-800 font-mono font-bold rounded px-3 py-1 text-sm min-w-[48px] text-center tracking-widest">
                {form.cvv ? '•'.repeat(form.cvv.length) : '•••'}
              </div>
            </div>
          </div>
          <div className="px-6 mt-4 text-center">
            <span className={`font-bold text-sm tracking-wider ${theme.textColor} opacity-60`}>
              {theme.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentMethod({ onContinue, onBack }: PaymentMethodProps) {
  const [form, setForm] = useState<FormState>({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [cvvFocused, setCvvFocused] = useState(false);

  const cardType = detectCardType(form.number);
  const maxLength = cardType === 'amex' ? 17 : 19; // con espacios

  const set = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleNumberChange = (raw: string) => {
    const hasLetters = /[a-zA-Z]/.test(raw);
    const type = detectCardType(raw);
    setForm((prev) => ({ ...prev, number: formatNumber(raw, type) }));
    setErrors((prev) => ({
      ...prev,
      number: hasLetters ? 'El número de tarjeta solo acepta dígitos' : undefined,
    }));
  };

  const handleExpiryChange = (raw: string) => {
    const hasLetters = /[a-zA-Z]/.test(raw);
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setForm((prev) => ({ ...prev, expiry: formatted }));
    setErrors((prev) => ({
      ...prev,
      expiry: hasLetters ? 'La fecha solo acepta números en formato MM/AA' : undefined,
    }));
  };

  const handleCvvChange = (raw: string) => {
    const hasLetters = /[a-zA-Z]/.test(raw);
    const max = cardType === 'amex' ? 4 : 3;
    setForm((prev) => ({ ...prev, cvv: raw.replace(/\D/g, '').slice(0, max) }));
    setErrors((prev) => ({
      ...prev,
      cvv: hasLetters ? 'El CVV solo acepta dígitos' : undefined,
    }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const digits = form.number.replace(/\D/g, '');
    const expectedLen = cardType === 'amex' ? 15 : 16;

    if (digits.length !== expectedLen || !luhnCheck(digits)) {
      errs.number = 'Número de tarjeta inválido';
    }
    if (form.name.trim().length < 3 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(form.name.trim())) {
      errs.name = 'Solo se permiten letras y espacios';
    }
    const [mm, yy] = form.expiry.split('/');
    const month = parseInt(mm ?? '', 10);
    const year = parseInt(`20${yy}`, 10);
    const now = new Date();
    if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errs.expiry = 'Fecha de vencimiento inválida';
    }
    const cvvLen = cardType === 'amex' ? 4 : 3;
    if (form.cvv.length !== cvvLen) {
      errs.cvv = `El CVV debe tener ${cvvLen} dígitos`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const digits = form.number.replace(/\D/g, '');
    const [mm, yy] = form.expiry.split('/');
    onContinue({
      cardType,
      last4: digits.slice(-4),
      cardholderName: form.name.trim(),
      expiryMonth: mm,
      expiryYear: yy,
    });
  };

  const fieldBase =
    'w-full py-3.5 px-4 bg-white border border-outline-variant rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-outline text-body-md text-on-surface';
  const fieldError = 'border-error focus:ring-error focus:border-error';

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 space-y-8">
      <header>
        <h2 className="text-headline-sm text-on-surface mb-1">Método de pago</h2>
        <p className="text-body-md text-on-surface-variant">
          Ingresa los datos de tu tarjeta de crédito o débito.
        </p>
      </header>

      {/* Tarjeta visual */}
      <CardVisual form={form} cardType={cardType} isFlipped={cvvFocused} />

      {/* Formulario */}
      <div className="space-y-5">
        {/* Número */}
        <div className="space-y-1.5">
          <label className="block text-label-md text-on-surface-variant">Número de tarjeta</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={form.number}
              maxLength={maxLength}
              onChange={(e) => handleNumberChange(e.target.value)}
              className={`${fieldBase} pr-16 ${errors.number ? fieldError : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {cardType === 'visa' && (
                <span className="text-[#1a1f71] font-bold text-sm italic tracking-wide">VISA</span>
              )}
              {cardType === 'mastercard' && (
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-red-600 opacity-90" />
                  <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-90 -ml-2" />
                </div>
              )}
              {cardType === 'amex' && (
                <span className="text-[#0f4c75] font-bold text-xs tracking-widest">AMEX</span>
              )}
              {cardType === 'other' && (
                <span className="material-symbols-outlined text-outline text-xl">credit_card</span>
              )}
            </div>
          </div>
          {errors.number && <p className="text-label-md text-error px-1">{errors.number}</p>}
        </div>

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="block text-label-md text-on-surface-variant">Nombre del titular</label>
          <input
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={form.name}
            maxLength={60}
            onChange={(e) => set('name', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toUpperCase())}
            className={`${fieldBase} ${errors.name ? fieldError : ''}`}
          />
          {errors.name && <p className="text-label-md text-error px-1">{errors.name}</p>}
        </div>

        {/* Vencimiento + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-label-md text-on-surface-variant">Vencimiento</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={form.expiry}
              maxLength={5}
              onChange={(e) => handleExpiryChange(e.target.value)}
              className={`${fieldBase} ${errors.expiry ? fieldError : ''}`}
            />
            {errors.expiry && <p className="text-label-md text-error px-1">{errors.expiry}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-md text-on-surface-variant">
              CVV {cardType === 'amex' ? '(4 dígitos)' : '(3 dígitos)'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder={cardType === 'amex' ? '0000' : '000'}
              value={form.cvv}
              maxLength={cardType === 'amex' ? 4 : 3}
              onChange={(e) => handleCvvChange(e.target.value)}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              className={`${fieldBase} ${errors.cvv ? fieldError : ''}`}
            />
            {errors.cvv && <p className="text-label-md text-error px-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="flex items-center gap-2 text-label-md text-on-surface-variant bg-surface-container-low rounded-lg px-4 py-3">
        <span className="material-symbols-outlined text-base text-secondary">lock</span>
        Tus datos están protegidos con cifrado SSL de 256 bits.
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </Button>
        <Button type="button" size="lg" onClick={handleSubmit}>
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
}
