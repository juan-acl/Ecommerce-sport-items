import { Button } from '@shared/components/ui/Button';

interface PaymentMethodProps {
  onContinue: () => void;
  onBack: () => void;
}

export function PaymentMethod({ onContinue, onBack }: PaymentMethodProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <header className="mb-6">
        <h2 className="text-headline-sm text-on-surface mb-2">Método de pago</h2>
        <p className="text-body-md text-on-surface-variant">
          Para esta versión, el pago se procesa de forma simulada como demostración.
        </p>
      </header>

      <div className="space-y-4 mb-8">
        <div className="border-2 border-primary bg-primary-fixed/30 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined !text-white">credit_card</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-body-lg font-semibold text-on-surface">Pago simulado (demo)</h3>
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </div>
              <p className="text-body-md text-on-surface-variant">
                Tu orden se procesará automáticamente al finalizar.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-outline-variant rounded-lg p-5 opacity-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-outline">credit_card</span>
            </div>
            <div className="flex-1">
              <h3 className="text-body-lg font-semibold text-on-surface mb-1">
                Tarjeta de crédito
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Visa, Mastercard, American Express
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary-container/40 border border-secondary-container rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
          <div>
            <p className="text-body-md text-on-secondary-container font-semibold mb-1">
              Modo demostración
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </Button>
        <Button type="button" size="lg" onClick={onContinue}>
          Revisar orden
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
}
