import { cn } from '@shared/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container-low text-on-surface-variant ring-outline-variant before:bg-outline',
  success: 'bg-[#ddfbf2] text-[#005142] ring-[#006b58]/20 before:bg-[#006b58]',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/15 before:bg-amber-500',
  error: 'bg-error-container text-on-error-container ring-error/15 before:bg-error',
  info: 'bg-[#e0f7f8] text-[#0e8a94] ring-[#0e8a94]/20 before:bg-[#0e8a94]',
};

export function Badge({ variant = 'default', children, className }: Readonly<BadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset',
        "before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
