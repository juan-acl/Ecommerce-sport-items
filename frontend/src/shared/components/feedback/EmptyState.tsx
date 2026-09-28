import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-outline">{icon}</span>
      </div>
      <h3 className="text-headline-sm text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
