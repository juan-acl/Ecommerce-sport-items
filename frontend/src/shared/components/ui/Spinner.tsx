import { cn } from '@shared/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function Spinner({ size = 'md', className }: Readonly<SpinnerProps>) {
  return (
    <span
      className={cn(
        'material-symbols-outlined animate-spin text-primary',
        sizeMap[size],
        className,
      )}
    >
      progress_activity
    </span>
  );
}
