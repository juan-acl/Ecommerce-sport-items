import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
          <Icon size={32} className="text-on-surface-variant" />
        </div>
      )}
      <h3 className="text-headline-sm text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
