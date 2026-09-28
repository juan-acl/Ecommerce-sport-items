import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
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
      <div className="space-y-unit-sm">
        {label && (
          <label htmlFor={id} className="block text-label-md text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-unit-md flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">
                {icon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full py-3.5 bg-white border border-outline-variant rounded-xl outline-none transition-all',
              'focus:ring-2 focus:ring-primary focus:border-primary',
              'placeholder:text-outline text-body-md text-on-surface',
              icon ? 'pl-[3.25rem]' : 'pl-4',
              rightSlot ? 'pr-12' : 'pr-4',
              error && 'border-error focus:ring-error focus:border-error',
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 pr-unit-md flex items-center">
              {rightSlot}
            </div>
          )}
        </div>
        {hint && !error && <p className="text-[11px] text-outline px-1">{hint}</p>}
        {error && <p className="text-label-md text-error px-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
