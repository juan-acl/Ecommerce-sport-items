import { cn } from '@shared/utils/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function Spinner({ size = 'md', className }: Readonly<SpinnerProps>) {
  return (
    <span
      className={cn(
        'material-symbols-outlined animate-spin text-primary',
        sizeStyles[size],
        className,
      )}
    >
      progress_activity
    </span>
  );
}
