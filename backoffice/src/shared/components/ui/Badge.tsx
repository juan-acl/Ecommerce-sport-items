import { cn } from '@shared/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface',
  success: 'bg-secondary-container text-on-secondary-container',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ variant = 'default', children, className }: Readonly<BadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-label-md font-semibold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
