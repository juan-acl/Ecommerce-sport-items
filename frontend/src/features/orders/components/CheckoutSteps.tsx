import { cn } from '@shared/utils/cn';

export type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'shipping', label: 'Envío' },
  { id: 'payment', label: 'Pago' },
  { id: 'review', label: 'Revisión' },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold transition-all',
                  isActive && 'bg-primary text-white',
                  isCompleted && 'bg-primary text-white',
                  !isActive && !isCompleted && 'bg-surface-container-high text-on-surface-variant',
                )}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-body-md font-semibold whitespace-nowrap',
                  isActive ? 'text-on-surface' : 'text-on-surface-variant',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-outline-variant',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
