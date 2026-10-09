import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, rightSlot, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-[12px] font-medium text-on-surface">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[18px] text-outline transition-colors group-focus-within:text-primary">
                {icon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full h-10 bg-white border border-outline-variant rounded-md outline-none transition-colors',
              'hover:border-outline/60 focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary',
              'placeholder:text-outline/80 text-body-md text-on-surface',
              icon ? 'pl-10' : 'pl-3',
              rightSlot ? 'pr-10' : 'pr-3',
              error && 'border-error focus:ring-error/10 focus:border-error',
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
              {rightSlot}
            </div>
          )}
        </div>
        {hint && !error && <p className="text-[11px] text-on-surface-variant">{hint}</p>}
        {error && <p className="text-[11px] font-medium text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
