import { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary-container text-on-secondary-container',
  outline: 'border border-outline-variant text-on-surface',
  success: 'bg-secondary-container text-on-secondary-container',
  error: 'bg-error-container text-on-error-container',
};

export function Badge({ variant = 'primary', children, className }: Readonly<BadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-md',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
