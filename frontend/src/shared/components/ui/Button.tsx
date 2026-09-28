import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary !text-white shadow-cta hover:bg-primary-container active:scale-[0.98]',
  secondary: 'bg-secondary !text-white hover:opacity-90 active:scale-[0.98]',
  outline:
    'border border-outline-variant !text-on-surface bg-transparent hover:bg-surface-container-low active:scale-95',
  ghost: '!text-on-surface bg-transparent hover:bg-surface-container-low active:scale-95',
  danger: 'bg-error !text-white hover:opacity-90 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
            <span>Cargando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
