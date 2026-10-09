import { cn } from '@shared/utils/cn';

export const fieldClass = (hasError?: boolean) =>
  cn(
    'rounded-none border-0 border-b bg-transparent pl-0 py-3 text-body-lg',
    'focus:ring-0 placeholder:text-outline-variant',
    hasError ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary',
  );
