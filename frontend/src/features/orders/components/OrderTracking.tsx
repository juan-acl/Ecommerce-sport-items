import { cn } from '@shared/utils/cn';
import type { OrderStatus } from '../types';

interface OrderTrackingProps {
  status: OrderStatus;
  createdAt: string;
}

interface TimelineStep {
  id: 'confirmed' | 'shipped' | 'transit' | 'delivered';
  label: string;
  description: string;
  icon: string;
}

const STEPS: TimelineStep[] = [
  {
    id: 'confirmed',
    label: 'Orden confirmada',
    description: 'Tu pago fue procesado',
    icon: 'task_alt',
  },
  {
    id: 'shipped',
    label: 'Enviado desde almacén',
    description: 'En proceso de empaque',
    icon: 'inventory_2',
  },
  {
    id: 'transit',
    label: 'En tránsito',
    description: 'Tu paquete está en camino',
    icon: 'local_shipping',
  },
  {
    id: 'delivered',
    label: 'Entregado',
    description: 'Listo para disfrutar',
    icon: 'home',
  },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-GT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderTracking({ status, createdAt }: OrderTrackingProps) {
  // Para esta versión, todas las órdenes nuevas están "paid" → step 1 completo
  // En producción real, este mapeo vendría del backend
  const completedStepIndex =
    status === 'paid' ? 0 : status === 'shipped' ? 2 : status === 'cancelled' ? -1 : 0;
  const isInTransit = status === 'shipped';

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-headline-sm text-on-surface">Estado del envío</h2>
        {isInTransit && (
          <span className="text-label-md text-secondary uppercase tracking-wider bg-secondary-container px-3 py-1 rounded-full">
            En tránsito
          </span>
        )}
      </header>

      <ol className="relative">
        {STEPS.map((step, index) => {
          const isCompleted = index <= completedStepIndex;
          const isActive = index === completedStepIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.id} className="flex gap-4 pb-6 last:pb-0 relative">
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-4 top-10 bottom-0 w-0.5',
                    index < completedStepIndex ? 'bg-primary' : 'bg-outline-variant',
                  )}
                />
              )}

              {/* Icon circle */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  isCompleted
                    ? isActive
                      ? 'bg-secondary-container'
                      : 'bg-primary'
                    : 'bg-surface-container-high',
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-base',
                    isActive
                      ? 'text-on-secondary-container'
                      : isCompleted
                        ? 'text-white'
                        : 'text-outline',
                  )}
                >
                  {isCompleted && !isActive ? 'check' : step.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    'text-body-md font-semibold',
                    isCompleted ? 'text-on-surface' : 'text-on-surface-variant',
                  )}
                >
                  {step.label}
                </p>
                {index === 0 && isCompleted && (
                  <p className="text-label-md text-on-surface-variant mt-1">
                    {formatDateTime(createdAt)}
                  </p>
                )}
                {index !== 0 && (
                  <p className="text-label-md text-on-surface-variant mt-1">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
