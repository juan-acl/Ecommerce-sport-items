import { cn } from '@shared/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: Readonly<SkeletonProps>) {
  return <div className={cn('animate-pulse bg-surface-container-high rounded', className)} />;
}
