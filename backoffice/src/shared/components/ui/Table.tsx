import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: Readonly<TableProps>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant">
      <table className={cn('w-full text-body-md', className)}>{children}</table>
    </div>
  );
}

export function TableHead({ children }: Readonly<{ children: ReactNode }>) {
  return <thead className="bg-surface-container-low">{children}</thead>;
}

export function TableBody({ children }: Readonly<{ children: ReactNode }>) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: Readonly<TableRowProps>) {
  return (
    <tr
      className={cn(
        'border-t border-outline-variant hover:bg-surface-container transition-colors',
        'even:bg-surface-container-low',
        className,
      )}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: Readonly<TableCellProps>) {
  return (
    <td className={cn('px-4 py-3 text-on-surface', className)}>{children}</td>
  );
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

export function TableHeaderCell({ children, className }: Readonly<TableHeaderCellProps>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </th>
  );
}
